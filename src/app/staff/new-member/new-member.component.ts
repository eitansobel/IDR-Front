import {AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, Inject, Input, OnInit, Renderer2, ViewChild} from '@angular/core';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import {CustomValidators, matchOtherValidator} from '../../models/validator';
import {
    FormBuilder,
    FormGroup,
    Validators
} from '@angular/forms';
import { LoadStaff, LoadStaffList } from '../state/actions/staff.actions';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatStepper} from '@angular/material';
import {
    Ng4FilesConfig,
    Ng4FilesSelected,
    Ng4FilesService,
    Ng4FilesStatus
} from '../../ng4-files';

import { AccountFormComponent } from 'src/app/profile/account-form/account-form.component';
import {AddMember} from '../../redux/members/members.action';
import { AdditionalFormComponent } from 'src/app/profile/additional-form/additional-form.component';
import {AppState} from '../../redux/app.state';
import {AuthService} from '../../auth/services/auth.service';
import { ContactFormComponent } from 'src/app/profile/contact-form/contact-form.component';
import {HospitalDepartmentService} from '../../services/hospital.structure.service';
import {MultyUploadComponent} from "../multyupload/multyupload.component";
import {NgOption} from '@ng-select/ng-select';
import {NotifyService} from "../../services/notify.service";
import {Papa} from 'ngx-papaparse';
import { PersonalFormComponent } from 'src/app/profile/personal-form/personal-form.component';
import { State } from '../state/reducers';
import {Store} from '@ngrx/store';
import { tap } from 'lodash';

@Component({
    selector: 'idr-new-member',
    templateUrl: './new-member.component.html',
    styleUrls: ['./new-member.component.scss']
})
export class NewMemberComponent implements OnInit, AfterViewInit, AfterViewChecked {
    private testConfig: Ng4FilesConfig = {
        acceptExtensions: ['csv'],
        maxFilesCount: 1
    };
    csvError: boolean = false;
    filename: string = `Drag and drop file to this area or choose file. \n
     CSV files supported.`;
    hospital;
    showCancel: boolean = true;
    personal: FormGroup;
    contactInfo: FormGroup;
    additionalInfo: FormGroup;
    contactInfoEdit: boolean = true;
    additionalInfoEdit: boolean = true;
    personalEdit: boolean = true;
    formSubmitted: boolean = false;
    personalFile: string;
    selectedFiles: any[] = [];
    hospital_department: any[] = [];
    croppedImage: string = '';
    last_update: string = '';
    message;
    approvedUser: boolean = false;
    csvErrorText: string = '';
    showClear: boolean = false;
    preferred_mode: NgOption[] = [
        {
            value: 0,
            label: 'Select Preferred Contact Method'
        },
        {
            value: 1,
            label: 'Phone'
        },
        {
            value: 2,
            label: 'Cell'
        },
        {
            value: 3,
            label: 'Pager'
        },
        {
            value: 4,
            label: 'Fax'
        },
        {
            value: 5,
            label: 'Email'
        }
    ];

    hospital_role: NgOption[] = [];
    file;

    public backVisible = new Subject<boolean>();
    public nextVisible = new Subject<boolean>();
    public closeVisible = new Subject<boolean>();

    @ViewChild('stepper') private stepper: MatStepper;

    @ViewChild(PersonalFormComponent) personalForm: PersonalFormComponent;
    @ViewChild(ContactFormComponent) contactForm: ContactFormComponent;
    @ViewChild(AdditionalFormComponent) additionalForm: AdditionalFormComponent;
    @ViewChild(AccountFormComponent) accountForm: AccountFormComponent;

    constructor(
        public dialogRef: MatDialogRef<NewMemberComponent>,
        public dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private hospitalDepartmentService: HospitalDepartmentService,
        private fb: FormBuilder,
        private renderer: Renderer2,
        private auth: AuthService,
        private ng4FilesService: Ng4FilesService,
        private store: Store<AppState>,
        private store2: Store<State>,
        private notify: NotifyService,
        protected changeDetectorRef: ChangeDetectorRef,
        private papa: Papa,
        private authService: AuthService,
    ) {
        this.store.select('rolesPage').map((x) => x.roles).subscribe((_roles) => {
            this.hospital_role = _roles;
        });
    }

    stepChanged($event) {
        this.updateStepButtons();
    }

    createUser(){
        // const personalForm = this.stepForm1.value;
        // console.log('personalForm', personalForm)
        // const contactForm = this.stepForm2.value;
        // const additionalForm = this.stepForm3.value;
        // const accountForm = this.stepForm4.value;

        const personalFormData = this.personalForm.formGroup;
        const contactFormData = this.contactForm.formGroup;
        const additionalFormData = this.additionalForm.formGroup;
        const accountFormData = this.accountForm.formGroup;

        let registerForm = { ... personalFormData.value };
        registerForm = { ...registerForm, ... contactFormData.value };
        registerForm = { ...registerForm, ... additionalFormData.value };
        registerForm = { ...registerForm, ... accountFormData.value };

        console.log('register form', registerForm)

        this.updateStepButtons(true);

        this.authService.register(registerForm).subscribe(
            (resp) => {
                this.store.dispatch(new AddMember({...registerForm, remote_id: resp.remote_id}));
                this.stepper.next();
                this.notify.success('New Team Member successfully created.');
            },
            (err) => {
                console.log('AuthService error: ', err);
                this.updateStepButtons();
                this.notify.notifyError(err);
            });
    }

    ngAfterViewInit() {
        this.updateStepButtons();
    }

    goBack(stepper: MatStepper){
        stepper.previous();
    }

    goForward(stepper: MatStepper){
        if (stepper.selectedIndex === 3) {
            this.createUser();
        } else {
            stepper.next();
        }
    }

    filesSelect(selectedFiles: Ng4FilesSelected, ): void {

        for (let i = 0; i < selectedFiles.files.length; i++) {
            const file = selectedFiles.files[i];
            this.file = selectedFiles.files[0];
            if (file['status'] === 4) {

            } else {
                this.filename = selectedFiles.files[i].name;
            }
        }
        this.csvErrorText = '';
        this.csvError = false;
    }

    importData() {

        const result = {};
        this.papa.parse(this.file, {

            complete: (results, file) => {
                results.data = results.data.filter(x => {
                    return    !x.every((el) => { return el == ""; });
                });

                if (results.data.length > 2) {
                    this.closeDialog();
                    this.dialog.open(MultyUploadComponent, {
                        width: '90%',
                    });
                }

                results.data[0].forEach((key, i) => {
                    switch (key) {
                        case 'Date of Birth':
                            key = 'birthday';
                            break;
                        case 'Phone Number':
                            key = 'phone';
                            break;
                        case 'Job':
                            key = 'title';
                            break;
                        case 'Title':
                            key = 'title';
                            break;
                        case 'Role':
                            const role = this.hospital_role.find((x) =>
                                x.title.toLowerCase() === results.data[1][i].toLowerCase()
                            );
                            if (!role) {
                                this.csvErrorText += 'Role is wrong \n';
                                this.csvError = true;
                            } else {
                                results.data[1][i] = role.id;
                                key = 'hospital_role';
                            }
                            break;
                        case 'Hospital Department':
                            const departament = this.hospital_department.find((x) =>
                                x.title.toLowerCase() === results.data[1][i].toLowerCase()
                            );
                            if (!departament) {
                                this.csvErrorText += 'Hospital department is wrong\n';
                                this.csvError = true;
                            } else {
                                results.data[1][i] = departament.id;
                                key = 'hospital_department';
                            }
                            break;
                    }
                    const newKey = key.toLowerCase().replace(/ /g, '_');

                    result[newKey] = results.data[1][i];
                    this.autoFillForm(newKey, results.data[1][i]);
                });
            }
        });
        this.showCancel = false;
        this.file = null;
        this.showClear = true;
        this.filename = 'Drag and drop file to this area of choose file.';
        this.selectedFiles = [];
    }

    autoFillForm(key, value) {
        if (this.personal.get(key)) {
            this.personal.get(key).patchValue(value);
        }
    }

    ngOnInit() {
        this.ng4FilesService.addConfig(this.testConfig);
        this.renderer.addClass(document.body, 'modal-open');
        this.hospitalDepartmentService.getDepartments().subscribe((departments) => {
            this.hospital = departments;
            this.hospital_department = this.hospital[this.data.hospital.hospital_id - 1].hospital_department;
        }, err => {
            this.notify.notifyError(err);
        });
        this.personal = this.fb.group({
            first_name: ['', [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(30),
                CustomValidators.validateCharacters
            ]],
            last_name: ['', [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(30),
                CustomValidators.validateCharacters
            ]],
            middle_name: ['', [
                Validators.minLength(3),
                Validators.maxLength(30),
                CustomValidators.validateCharacters
            ]],
            title: ['', [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(30),
                CustomValidators.validateCharacters
            ]],
            prefix: ['', []],
            suffix: ['', []],
            preferred_name: ['', [CustomValidators.validateCharacters]],
            birthday: [null, [CustomValidators.validateBirthdayRequired]],
            phone: ['', [Validators.required,
            CustomValidators.validatePhone
            ]],
            fax: ['', [
                CustomValidators.validatePhone
            ]],
            pager: ['', [
                CustomValidators.validatePhone
            ]],
            email: ['', [
                Validators.required,
                CustomValidators.validateEmail
            ]],
            cell: ['', [Validators.required,
            CustomValidators.validatePhone
            ]],
            preferred_mode: [null, [CustomValidators.validateEmailRequired
            ]],

            hospital_role: [null, [Validators.required]],
            dea_number: ['', []],
            hospital: [this.data.hospital.hospital_id, [Validators.required]],
            hospital_department: [null, [Validators.required]],
            user_id: ['', []],
            npi_number: ['', []],
            state_license: ['', []],
            username: ['', [Validators.required, Validators.minLength(3)]],
            password: ['', [
                Validators.minLength(8),
                Validators.required,
                 CustomValidators.validatePassword,
            ]],
            confirm_password: ['', [
                Validators.required,
                Validators.minLength(8),
                CustomValidators.validatePassword,
                matchOtherValidator('password')
            ]]
        });
    }


    updateStepButtons(forceHide = false) {
        setTimeout(() => {
            if(forceHide){
                this.backVisible.next(false);
                this.nextVisible.next(false);
            } else {
                this.backVisible.next(this.stepper.selectedIndex > 0 && this.stepper.selectedIndex <= 3);
                this.nextVisible.next(this.stepper.selectedIndex <= 3);
                this.closeVisible.next(this.stepper.selectedIndex > 3);
            }
        });
    }


    ngAfterViewChecked(): void {
        this.changeDetectorRef.detectChanges();
    }

    closeDialog() {
        this.dialogRef.close();
        this.renderer.removeClass(document.body, 'modal-open');
    }

    onChange($event) {
        this.personal.get('hospital_department').patchValue(null);
        this.hospital_department = $event.hospital_department;
    }

    cancelImport() {
        this.file = null;
        this.filename = 'Drag and drop file to this area of choose file.';
        this.selectedFiles = [];
        this.csvErrorText = '';
        this.csvError = false;
    }

    clearForm() {
        this.personal.get('hospital').patchValue(this.data.hospital.hospital_id);
        this.personal.get('username').patchValue(null);
        this.personal.get('password').patchValue(null);
        this.personal.get('confirm_password').patchValue(null);
        this.personal.reset();
        this.showCancel = true;
        this.showClear = false;
        this.csvErrorText = '';
        this.csvError = false;
    }

    save() {
        this.personal.get('hospital').patchValue(this.data.hospital.hospital_id);

        if (this.personal.valid && this.personal.dirty) {
            this.formSubmitted = false;
            const obj = this.personal.value;
            this.auth.register(obj).subscribe(
                (resp) => {
                    this.formSubmitted = true;
                    this.store.dispatch(new AddMember({...this.personal.value, remote_id: resp.remote_id}));
                    this.closeDialog();
                },
                (err) => {
                    this.notify.notifyError(err);
                });
        } else {
            this.formSubmitted = true;
        }
    }

    cancel() {
        this.personal.reset();
        this.changeDetectorRef.detectChanges();
        this.closeDialog();
    }
}
