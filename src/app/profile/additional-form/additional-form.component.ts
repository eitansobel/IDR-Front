// WARNING: hospital_id or clinic_remote_id ?

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, take, tap } from 'rxjs/operators';

import {AppState} from '../../redux/app.state';
import { CustomValidators } from 'src/app/models/validator';
import { HospitalDepartmentService } from 'src/app/services/hospital.structure.service';
import { Profile } from 'src/app/models/profile';
import { ProfileService } from '../service/profile.service';
import { Store } from '@ngrx/store';

@Component({
  selector: 'idr-additional-form',
  templateUrl: './additional-form.component.html',
  styleUrls: ['./additional-form.component.scss']
})
export class AdditionalFormComponent implements OnInit {
    public formGroup: FormGroup;
    @Input() isEdit = false;
    @Input() showControls = true;

    private _profile;
    @Input()
    get profile() {
        return this._profile;
    }
    set profile(value) {
        this._profile = value;
        this.setupForm(value);
    }

    public hospitals: any[] = [];
    public departments: any[] = [];
    public roles: any[] = [];

    hospitals$ = this.store.select('hospitalsPage')
        .pipe(
            map(data => data.hospitals.map(hospital => {
                return Object.assign(hospital, { id: hospital.hospital_id });
            })),
        );

    // departments$ = this.store.select('hospitalsPage').pipe(
    //     tap((data) => console.log('async departments data', data, this.formGroup.value.hospital)),
    //     map(data => data.hospitals.find(hospital => hospital.hospital_id === this.formGroup.value.hospital)),
    //     map(hospital => hospital ? hospital.hospital_role : null)
    // );

    // roles$ = this.store.select('hospitalsPage').pipe(
    //     tap((data) => console.log('async roles data', data, this.formGroup.value.hospital)),
    //     map(data => data.hospitals.find(hospital => hospital.hospital_id === this.formGroup.value.hospital)),
    //     map(hospital => hospital ? hospital.hospital_role : null)
    // );

    constructor(
        public formBuilder: FormBuilder,
        private profileService: ProfileService,
        private store: Store<AppState>,
        private hospitalDepartmentService: HospitalDepartmentService,
    ) {
        // hospitalDepartmentService.getDepartments().subscribe((departments) => {
        //     this.departments = departments;
        //     console.log('this.departments', this.departments)
        //     // this.hospital_department = this.departments[this.data.hospital.hospital_id - 1].hospital_department;
        // }, err => {
        //     console.log('ERROR: Cannot load hospital departments');
        //     // this.notify.notifyError(err);
        // });

        // this.store.select('hospitalsPage').subscribe((hospitalsPage) => {
        //     if (!hospitalsPage) {
        //         return;
        //     }
        //     this.hospitals = hospitalsPage.hospitals;
        //     this.store.select('profilePage').map(data => data.profile).subscribe((_profile: Profile) => {

        //         // WARNING: hospital_id or clinic_remote_id ?
        //         const hospital = hospitalsPage.hospitals.find(h => h.hospital_id === _profile.hospital);
        //         const departments = hospital.hospital_department;
        //         const roles = hospital.hospital_role;
        //         const isAdmin = _profile.is_admin;
        //         const userHospital = this.hospitals[_profile.hospital - 1];
        //     });
        // });

        // this.createForm();
        this.createForm();
    }

    ngOnInit() {
    }

    hospitalChanged($event){
        this.hospitals$
            .pipe(take(1))
            .subscribe(hospitals => {
                const hospital = hospitals.find(_hospital => _hospital.hospital_id === $event);
                if(hospital) {
                    this.departments = hospital.hospital_department;
                    this.roles = hospital.hospital_role;
                } else{
                    console.log('WARNING: Hospital not found. $event:', $event);
                }
            });
    }



    createForm(){
        this.formGroup = this.formBuilder.group({
            hospital_role: [null, Validators.required],
            hospital: [null, Validators.required],
            hospital_department: [null, [Validators.required]],
            state_license: [null, []],
            dea_number: [null, []],
            user_id: [null, []],
            npi_number: [null, []]
        });
    }

    setupForm(data){
        if(data){
            this.formGroup.patchValue({
                hospital_role: data.hospital_role,
                hospital: data.hospital,
                hospital_department: data.hospital_department,
                state_license: data.state_license,
                dea_number: data.dea_number,
                user_id: data.user_id,
                npi_number: data.npi_number
            });
            this.hospitalChanged(data.hospital);
        }
    }

    submit() {
        if (this.formGroup.valid){
            console.log('this.formGroup.valid', this.formGroup.valid)
            this.profileService.updateMemberServer1(this.formGroup.value, this.profile.remote_id).subscribe(() => {
                // this.store.dispatch(new AddProfile(this.formData.value));
                // this.onSave.emit([this.editName]);
                // this.message = '';
                this.isEdit = false;
            }, err => {
                if (err.detail === 'Invalid token') {
                    localStorage.removeItem('idrToken');
                    localStorage.removeItem('idrId');
                } else {
                    console.log('ERROR: ', err);
                }
            });
        }
    }
}
