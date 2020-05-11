import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {AppState} from '../../redux/app.state';
import { AuthService } from 'src/app/auth/services/auth.service';
import { BehaviorSubject } from 'rxjs';
import { CustomValidators } from 'src/app/models/validator';
import { ProfileService } from '../service/profile.service';
import { Store } from '@ngrx/store';

@Component({
    selector: 'idr-personal-form',
    templateUrl: './personal-form.component.html',
    styleUrls: ['./personal-form.component.scss']
})
export class PersonalFormComponent implements OnInit {
    public formGroup: FormGroup;
    @Input() isEdit = false;
    @Input() showControls = true;
    @Input() userRemoteId;

    private _profile;
    @Input()
    get profile() {
        return this._profile;
    }
    set profile(value) {
        this._profile = value;
        this.setupForm(value);
    }

    @Output() init: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();

    constructor(
        public formBuilder: FormBuilder,
        private profileService: ProfileService,
        private store: Store<AppState>,
        private authService: AuthService,
    ) {
        this.createForm();
    }

    ngOnInit() {
    }

    setupForm(data) {
        if (data) {
            this.formGroup.patchValue({
                first_name: data.first_name || '',
                last_name: data.last_name || '',
                middle_name: data.middle_name || '',
                title: data.title || '',
                prefix: data.prefix || '',
                suffix: data.suffix || '',
                preferred_name: data.preferred_name || '',
                birthday: data.birthday || ''
            });
        }
    }

    createForm() {
        this.formGroup = this.formBuilder.group({
            first_name: [null, Validators.required],
            last_name: [null, Validators.required],
            middle_name: [null, [
                Validators.minLength(3),
                Validators.maxLength(30),
                CustomValidators.validateCharacters
            ]],
            title: [null, [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(30)
            ]],
            prefix: [null, [CustomValidators.validateCharacters]],
            suffix: [null, [CustomValidators.validateCharacters]],
            preferred_name: [null, [CustomValidators.validateCharacters]],
            birthday: [null, [CustomValidators.validateBirthdayRequired]]
        });
    }

    submit() {
        if (this.formGroup.valid) {
            if (this.profile) {
                this.updateProfile();
            }
        }
    }

    updateProfile() {
        if(this.profile && this.profile.remote_id > 0) {
            this.profileService
                .updateMemberServer1(this.formGroup.value, this.profile.remote_id)
                .subscribe((result) => {
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
