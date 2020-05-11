import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CustomValidators, matchOtherValidator } from 'src/app/models/validator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {AppState} from '../../redux/app.state';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ProfileService } from '../service/profile.service';
import { Store } from '@ngrx/store';

@Component({
  selector: 'idr-account-form',
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.scss']
})
export class AccountFormComponent implements OnInit {
    public formGroup: FormGroup;
    @Input() isEdit = false;
    @Input() showControls = true;

    constructor(
        public formBuilder: FormBuilder,
        private profileService: ProfileService,
        private store: Store<AppState>,
        private authService: AuthService
    ) {
        this.createForm();
    }

    ngOnInit() {

    }
    createForm(){
        this.formGroup = this.formBuilder.group({
            username: [null, [
                Validators.required,
                Validators.minLength(3)
            ]],
            password: [null, [
                Validators.minLength(8),
                Validators.required,
                 CustomValidators.validatePassword
            ]],
            confirm_password: [null, [
                Validators.required,
                Validators.minLength(8),
                CustomValidators.validatePassword,
                matchOtherValidator('password')
            ]]
        });
    }
    setupForm(){
        // this.store
        //     .select('profilePage')
        //     .map(data => data.profile)
        //     .subscribe((data) => {
        //         if (!data.remote_id) {
        //             return;
        //         }

        //         // this.formGroup.setValue({
        //         //     phone: data.phone,
        //         //     pager: data.pager,
        //         //     cell: data.cell,
        //         //     fax: data.fax,
        //         //     email: data.email || 'Unknown',
        //         //     preferred_mode: data.preferred_mode || 0
        //         // });

        //     });
    }

    submit() {
        if (this.formGroup.valid) {
            this.createUser(this.formGroup.value);
            console.log('this.formGroup.valid', this.formGroup.valid)
                // this.profileService.updateProfileServer1(this.formGroup.value).subscribe(() => {
                //     // this.store.dispatch(new AddProfile(this.formData.value));
                //     // this.onSave.emit([this.editName]);
                //     // this.message = '';
                // }, err => {
                //     if (err.detail === 'Invalid token') {
                //         localStorage.removeItem('idrToken');
                //         localStorage.removeItem('idrId');
                //     } else {
                //         console.log('ERROR: ', err);
                //     }
                // });
        }
    }

    createUser(data){
        this.authService.register(data).subscribe(
            (resp) => {
                console.log('User Created:', resp);
                //this.store.dispatch(new AddMember({...this.personal.value, remote_id: resp.remote_id}));
                //this.closeDialog();
            },
            (err) => {
                //this.notify.notifyError(err);
            });
    }

    updateUser(){

    }
}
