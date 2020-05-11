import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {AppState} from '../../redux/app.state';
import { CustomValidators } from 'src/app/models/validator';
import { ProfileService } from '../service/profile.service';
import { Store } from '@ngrx/store';

@Component({
    selector: "idr-contact-form",
    templateUrl: "./contact-form.component.html",
    styleUrls: ["./contact-form.component.scss"]
})
export class ContactFormComponent implements OnInit {
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

    constructor(
        public formBuilder: FormBuilder,
        private profileService: ProfileService,
        private store: Store<AppState>
    ) {
        // TODO: Replace emitter with ViewChild
        this.createForm();
    }

    ngOnInit() {
        this.createForm();
    }

    createForm() {
        this.formGroup = this.formBuilder.group({
            phone: [null, Validators.required],
            pager: [null, Validators.required],
            cell: [null, [Validators.required]],
            fax: [null, []],
            email: [null, [Validators.required, CustomValidators.validateEmail]],
            preferred_mode: [null, []]
        });
    }

    setupForm(data){
        if(data){
            this.formGroup.patchValue({
                phone: data.phone,
                pager: data.pager,
                cell: data.cell,
                fax: data.fax,
                email: data.email || 'Unknown',
                preferred_mode: data.preferred_mode || 0
            });
        }
    }

    submit() {
        if (this.formGroup.valid){
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
