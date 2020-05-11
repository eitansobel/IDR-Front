import * as moment from 'moment';

import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    Validators
} from '@angular/forms';
import { Component, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';

import { AddProfile } from '../../redux/profile/profile.action';
import { AppState } from '../../redux/app.state';
import { AuthService } from '../services/auth.service';
import { ClearLists } from '../../redux/staff/staff.action';
import { ClearMembers } from '../../redux/members/members.action';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { User } from '../../models/user';

@Component({
    selector: 'idr-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

    form: FormGroup;
    message: string;
    username: AbstractControl;
    formSubmitted = false;
    public lock = false;
    redirectLink;

    constructor(private fb: FormBuilder,
        private auth: AuthService,
        private router: Router,
        private store: Store<AppState>,
        @Inject(DOCUMENT) private document: Document,
        private renderer: Renderer2,
    ) {
        const now = new Date();
        const nowInTimestamp = moment(now).format('X');
        const getOldTime = localStorage.getItem('signout_time');

        if (!getOldTime) {
            localStorage.removeItem('username');
            localStorage.removeItem('signout_time');
            localStorage.removeItem('lock');
            localStorage.removeItem('logoutPage');
        } else {
            const oldTime = moment(getOldTime).format('X');
            if (oldTime < nowInTimestamp) {
                localStorage.removeItem('username');
                localStorage.removeItem('signout_time');
                localStorage.removeItem('lock');
                localStorage.removeItem('logoutPage');
            }
        }
    }

    ngOnDestroy(): void {
        this.renderer.removeClass(this.document.body, 'grey');
    }

    ngOnInit() {
        this.renderer.addClass(this.document.body, 'grey');

        this.lock = localStorage.getItem('lock') === 'true' ? true : false;
        this.redirectLink = localStorage.getItem('logoutPage');

        this.form = this.fb.group({
            username: ['', [
                Validators.required,
                Validators.minLength(3)
            ]],
            password: [null, [
                Validators.required,
                Validators.minLength(3)]
            ],
        });
        this.form.get('username').patchValue(localStorage.getItem('username'));
    }

    login($event) {
        if (this.form.dirty && this.form.valid) {
            this.formSubmitted = false;

            if (this.lock) {

                this.auth.login(new User(
                    this.form.value.username,
                    this.form.value.password,
                )).subscribe(
                    (data) => {
                        localStorage.setItem('idrToken', data.token);
                        localStorage.setItem('idrUserId', data.user.id);
                        this.router.navigateByUrl(this.redirectLink);
                        this.store.dispatch(new AddProfile(data.user));
                    },
                    (err) => {
                        // * check if error is not standart *//
                        this.message = err.non_field_errors[0];
                    });
            } else {

                if (localStorage.getItem('idrToken')) {
                    this.router.navigateByUrl('auth/set-alerts');
                    this.store.dispatch(new ClearLists());
                    this.store.dispatch(new ClearMembers());
                } else {
                    this.auth.login(new User(
                        this.form.value.username,
                        this.form.value.password,
                    )).subscribe(
                        (data) => {
                            this.store.dispatch(new ClearLists());
                            this.store.dispatch(new ClearMembers());
                            localStorage.setItem('idrToken', data.token);
                            localStorage.setItem('idrUserId', data.user.id);
                            localStorage.setItem('username', this.form.value.username);
                            this.router.navigateByUrl('auth/set-alerts');
                            this.store.dispatch(new AddProfile(data.user));
                        },
                        (err) => {
                            // * check if error is not standart *//
                            this.message = err.non_field_errors[0];
                        });
                }
            }
        } else {
            this.formSubmitted = true;
        }
    }

    safeMode() {
        localStorage.removeItem('username');
        localStorage.removeItem('lock');
        localStorage.removeItem('logoutPage');
        this.form.get('username').patchValue(localStorage.getItem(''));
        this.lock = false;
    }

    registration() {
    }
}
