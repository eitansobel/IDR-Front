import * as moment from 'moment';

import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators
} from '@angular/forms';

import {AppState} from '../redux/app.state';
import {ChangePassComponent} from './change-pass/change-pass.component';
import {CropImageComponent} from './crop-image/crop-image.component';
import {CustomValidators} from '../models/validator';
import {HospitalDepartmentService} from '../services/hospital.structure.service';
import {Hospitals} from '../models/hospital';
import {MatDialog} from '@angular/material';
import {NgOption} from '@ng-select/ng-select';
import {NotifyService} from "../services/notify.service";
import {Observable} from 'rxjs/Observable';
import { PersonalFormComponent } from './personal-form/personal-form.component';
import {PrivilegesComponent} from '../common/privileges/privileges.component';
import { Profile } from '../models/profile';
import {ProfileService} from './service/profile.service';
import {Store} from '@ngrx/store';
import {environment} from '../../environments/environment';

@Component({
    selector: 'idr-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],

})
export class ProfileComponent implements OnInit, AfterViewInit {
    @ViewChild(PersonalFormComponent) personalForm: PersonalFormComponent;

    personalFormEdit: boolean = false;

    personal: FormGroup;
    contactInfo: FormGroup;
    additionalInfo: FormGroup;
    contactInfoEdit: boolean = true;
    additionalInfoEdit: boolean = true;
    personalEdit: boolean = true;
    hospitalsState: Observable<Hospitals>;
    formSubmitted: boolean = false;
    personalFile: string;
    selectedFiles: any[] = [];
    hospital_department: any[] = [];
    hospital: any[] = [];
    croppedImage: string = '';
    last_update: string = '';
    approvedUser: boolean = false;
    is_admin: boolean = false;
    _permissions;
    message: string;
    maxLength = 50;
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

    public myProfile: Profile;

    constructor(public dialog: MatDialog,
        private fb: FormBuilder,
        private hd: HospitalDepartmentService,
        private profileS: ProfileService,
        private notify: NotifyService,
        private store: Store<AppState>
    ) {
        this.store
            .select('profilePage')
            .map(data => data.profile)
            .subscribe((data: Profile) => {
                console.log('data', data)
                this.myProfile = data;
            });

        this.hd.getDepartments().subscribe((departments) => {
            this.hospital = departments;
            this.initForm();
        }, err => {
            this.notify.notifyError(err);
        });

        this.profileS.getPermissions().subscribe((_permissions) => {
            this._permissions = _permissions;
        }, err => this.notify.notifyError(err));

    }


    ngOnInit() {


        this.personal = this.fb.group({
            first_name: ['', [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(30),
                CustomValidators.validateCharacters
            ]],
            last_name: [null, [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(30),
                CustomValidators.validateCharacters
            ]],
            middle_name: [null, [
                Validators.minLength(3),
                Validators.maxLength(30),
                CustomValidators.validateCharacters
            ]],
            title: [null, [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(30),
                CustomValidators.validateBackspace
            ]],
            prefix: [null, [CustomValidators.validateCharacters]],
            suffix: [null, [CustomValidators.validateCharacters]],
            preferred_name: [null, [CustomValidators.validateCharacters]],
            birthday: [null, [CustomValidators.validateBirthdayRequired]]
        });

        this.contactInfo = this.fb.group({
            phone: ['', Validators.compose([Validators.required,
            CustomValidators.validatePhone,
            ])],
            fax: [null, [
                CustomValidators.validatePhone
            ]],
            pager: [null, [
                CustomValidators.validatePhone
            ]],
            email: ['', [
                Validators.required,
                CustomValidators.validateEmail
            ]],
            cell: [null, [Validators.required,
            CustomValidators.validatePhone
            ]],
            preferred_mode: [null, [CustomValidators.validateEmailRequired
            ]]
        });

        this.additionalInfo = this.fb.group({
            hospital_role: [null, [Validators.required]],
            dea_number: [null, []],
            hospital: [null, [Validators.required]],
            hospital_department: [null, [Validators.required]],
            user_id: [null, []],
            npi_number: [null, []],
            state_license: [null, []]
        });
        this.initForm();
    }

    ngAfterViewInit() {
        console.log('this.personalForm', this.personalForm)
    }

    initForm() {

        this.store.select('profilePage').map(data => data.profile).subscribe((data) => {
            if (!data.remote_id) return;
            this.is_admin = data.is_admin;
            this.store.select('rolesPage').map((x) => x.roles).subscribe((_roles) => {

                this.hospital_role = _roles.filter((x) => {
                    if (!this.is_admin && x.id === 1) {
                        return false;
                    } else {
                        return x;
                    }
                });
            });
            this.approvedUser = data.is_approved;
            this.last_update = moment(data.last_update).format('DD.MM.YYYY');
            if (data.full_photo) {
                this.croppedImage = `${environment.settings.imageUrl}${data.full_photo}`;
            } else {
                this.croppedImage = '';
            }

            this.personal.setValue({
                first_name: data.first_name || '',
                last_name: data.last_name || '',
                middle_name: data.middle_name,
                title: data.title,
                prefix: data.prefix,
                suffix: data.suffix,
                preferred_name: data.preferred_name,
                birthday: data.birthday
            });

            this.contactInfo.setValue({
                phone: data.phone,
                fax: data.fax,
                email: data.email || 'Unknown',
                cell: data.cell,
                pager: data.pager,
                preferred_mode: data.preferred_mode || 0
            });

            this.additionalInfo.setValue({
                hospital_role: data.hospital_role,
                dea_number: data.dea_number,
                hospital: data.hospital,
                hospital_department: data.hospital_department,
                user_id: data.user_id,
                npi_number: data.npi_number,
                state_license: data.state_license
            });
            const hospital = this.hospital.filter((hp) => hp.clinic_remote_id === data.hospital);
            if (!hospital.length) return;
            this.hospital_department = hospital[0].hospital_department;
        });
        this.contactInfo.controls.preferred_mode.disable();
        this.additionalInfo.controls.hospital_role.disable();
        this.additionalInfo.controls.hospital.disable();
        this.additionalInfo.controls.hospital_department.disable();
        this.hospitalsState = this.store.select('hospitalsPage');
    }

    disabledSelect(value) {
        switch (value) {
            case 'contactInfoEdit':
                if (this.contactInfoEdit) {
                    this.contactInfo.controls.preferred_mode.disable();
                } else {
                    this.contactInfo.controls.preferred_mode.enable();
                }
                break;
            case 'additionalInfoEdit':
                if (this.additionalInfoEdit) {
                    this.additionalInfo.controls.hospital_role.disable();
                    this.additionalInfo.controls.hospital.disable();
                    this.additionalInfo.controls.hospital_department.disable();
                } else {
                    this.additionalInfo.controls.hospital_role.enable();
                    this.additionalInfo.controls.hospital_department.enable();
                }
                break;
        }
    }

    onSave(value) {
        const param = value[0];
        this.personal.value.title.trim();
        switch (param) {
            case 'personalEdit':
                if (this.personal.valid) {
                    this.personalEdit = !this.personalEdit;
                }
                break;
            case 'contactInfoEdit':
                if (this.contactInfo.valid) {
                    this.contactInfoEdit = !this.contactInfoEdit;
                }
                break;
            case 'additionalInfoEdit':
                this.additionalInfoEdit = !this.additionalInfoEdit;
                break;
        }

        if (value[1]) {
            this.initForm();
        }

        this.disabledSelect(param);
    }

    uploadPhoto() {
        this.dialog.open(CropImageComponent, {
            data: {
                header: 'Profile Photo',
                ok: 'Save',
                full_photo: this.myProfile.full_photo
            }
        });
    }

    changePass() {
        this.dialog.open(ChangePassComponent, {
            data: {
                header: 'Change Password',
                ok: 'Save'
            }
        });
    }

    checkPrivileges() {
        this.dialog.open(PrivilegesComponent, {
            data: {
                header: 'User Privilege',
                canChanged: true,
                _permissions: this._permissions
            }
        });
    }
}
