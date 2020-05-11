import * as _ from 'lodash';
import * as moment from 'moment';

import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    Validators
} from '@angular/forms';
import { Component, Inject, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';

import { AddAlertComponent } from './add-alert/add-alert.component';
import { AlertService } from '../../auth/services/alerts.service';
import { Alerts } from '../../models/alert';
import { AppState } from '../../redux/app.state';
import { AuthService } from '../services/auth.service';
import { ChatService } from '../../messages/services/chat.service';
import { DOCUMENT } from '@angular/common';
import { DateValidator } from '../../models/validator';
import { GetAlerts } from '../../redux/alerts/alerts.action';
import {
    GetColumns
} from '../../redux/dataColumns/data-column.action';
import { Hospitals } from '../../models/hospital';
import { MatDialog } from '@angular/material';
import { NgOption } from '@ng-select/ng-select';
import { NotifyService } from '../../services/notify.service';
import { Observable } from 'rxjs/Observable';
import { ProfileService } from '../../profile/service/profile.service';
import { Router } from '@angular/router';
import { StaffListSettings } from '../../models/staff-list';
import { StaffService } from '../../staff/service/staff.service';
import { Store } from '@ngrx/store';

@Component({
    selector: 'idr-method-alert',
    templateUrl: './method-alert.component.html',
    styleUrls: ['./method-alert.component.scss'],
    providers: [ProfileService, AlertService]
})
export class MethodAlertComponent implements OnInit, OnDestroy {

    public form: FormGroup;
    message;
    username: AbstractControl;
    formSubmitted = false;
    alerts: NgOption[] = [];
    is_admin: false;
    tempArray;
    arrayForm = [];
    removeForm = [];
    onDuty = true;
    onCall = true;
    workGroupList: StaffListSettings[];
    unreadMessage: number;
    @ViewChild(AddAlertComponent) productsChild: AddAlertComponent;
    selected_wg: number[];

    constructor(private fb: FormBuilder,
        private alertService: AlertService,
        private chatService: ChatService,
        private staffService: StaffService,
        public dialog: MatDialog,
        private store: Store<AppState>,
        private pService: ProfileService,
        private notify: NotifyService,
        private router: Router,
        private auth: AuthService,
        @Inject(DOCUMENT) private document: Document,
        private renderer: Renderer2
    ) {

        /* get history of alerts */
        this.alertService.getAlerts().subscribe((alerts) => {
            this.store.dispatch(new GetAlerts(alerts));
        }, err => {
            this.notify.notifyError(err);
        });

    }

    ngOnDestroy(): void {
        this.renderer.removeClass(this.document.body, 'grey');
    }

    ngOnInit(): void {
        this.renderer.addClass(this.document.body, 'grey');

        /* Get saved profile data and push to store */
        this.form = this.fb.group({
            first: [null, [
                Validators.required,
            ]],
            second: [null, [
                Validators.required,
            ]],
            third: [null],
            forth: [null],
            selectedMoment2: [
                moment().add(30, 'minutes'),
                Validators.compose([Validators.required, DateValidator.date])
            ]
        });

        // TODO: make select key strongly typed
        this.store.select('profilePage').subscribe((data) => {
            if (!data.partialProfile) { return; }

            if (data.partialProfile.alerts) { // && !this.selected_wg
                this.selected_wg = data.partialProfile.alerts.chosen_workgroup || [];
                this.is_admin = data.partialProfile.is_admin;
                this.staffService.getStaffList().subscribe((_resp: any[]) => {
                    const copiedResp = [..._resp];
                    copiedResp.forEach(list => {
                        list.is_selected = this.selected_wg.includes(list.id);
                    });
                    this.workGroupList = copiedResp.filter(item => item.id > 0);
                }, err => {
                    this.notify.notifyError(err);
                });
            }

            if (!data.partialProfile.hospital) { return; }

            if (data.partialProfile.alerts) {

                if (data.partialProfile.alerts.alert1) {
                    this.form.get('first').patchValue(data.partialProfile.alerts.alert1.id);
                }
                if (data.partialProfile.alerts.alert2) {
                    this.form.get('second').patchValue(data.partialProfile.alerts.alert2.id);
                }
                if (data.partialProfile.alerts.alert3) {
                    this.form.get('third').patchValue(data.partialProfile.alerts.alert3.id);
                }
                if (data.partialProfile.alerts.alert4) {
                    this.form.get('forth').patchValue(data.partialProfile.alerts.alert4.id);
                }
            }


            this.store
                .select('alertSingle')
                .map((_a) => _a.setAlert[0])
                .subscribe((_a) => {
                    if (!_a) { return; }
                    switch (_a.selectedItem) {
                        case 1:
                            this.form.get('first').patchValue(_a.id);
                            break;
                        case 2:
                            this.form.get('second').patchValue(_a.id);
                            break;
                        case 3:
                            this.form.get('third').patchValue(_a.id);
                            break;
                        case 4:
                            this.form.get('forth').patchValue(_a.id);
                            break;
                    }
                });

            this.store.select('alertPage').subscribe((_a) => {
                console.log('_a', _a)
                this.alerts = _a.alerts.filter((x) => {
                    return x.show === true;
                });
                this.tempArray = _a.alerts.filter((x) => {
                    return x.show === true;
                });

                // TODO: Remove redundent check after QA
                // if (!this.alerts.find((obj) => obj.id === this.form.value.first)) {
                //     this.form.get('first').patchValue(null);
                // }
                // if (!this.alerts.find((obj) => obj.id === this.form.value.second)) {
                //     this.form.get('second').patchValue(null);
                // }
                // if (!this.alerts.find((obj) => obj.id === this.form.value.third)) {
                //     this.form.get('third').patchValue(null);
                // }
                // if (!this.alerts.find((obj) => obj.id === this.form.value.forth)) {
                //     this.form.get('forth').patchValue(null);
                // }
                this.arrayForm = [];
                this.arrayForm.push(this.form.value.first);
                this.arrayForm.push(this.form.value.second);
                this.arrayForm.push(this.form.value.third);
                this.arrayForm.push(this.form.value.forth);
                setTimeout(() => {
                    this.arrayForm.forEach((y) => {
                        this.alerts = this.alerts.filter((x) => x.id !== y);
                    });
                });
            });
            this.arrayForm = [];
            this.arrayForm.push(this.form.value.first);
            this.arrayForm.push(this.form.value.second);
            this.arrayForm.push(this.form.value.third);
            this.arrayForm.push(this.form.value.forth);
            setTimeout(() => {
                this.arrayForm.forEach((y) => {
                    this.alerts = this.alerts.filter((x) => x.id !== y);
                });
            });
        }, err => {
            this.notify.notifyError(err);
        });

        this.chatService.getUnreadMessages().subscribe((_resp: any) => {
            this.unreadMessage = _resp.count_of_unread_messages;
        }, err => {
            this.notify.notifyError(err);
        });
    }

    removeFromArray() {
        this.removeForm = [];
        this.removeForm.push(this.form.value.first);
        this.removeForm.push(this.form.value.second);
        this.removeForm.push(this.form.value.third);
        this.removeForm.push(this.form.value.forth);
        const indexDiff = _.difference(this.arrayForm, this.removeForm);

        const el = this.tempArray.find((_c) => _c.id === indexDiff[0]);
        this.arrayForm = this.arrayForm.filter((_c) => indexDiff[0] !== _c);

        if (!el) { return; }
        const arr = this.alerts;
        arr.push(el);
        return arr;
    }

    addToArray(event) {
        const temp = [];
        temp.push(this.form.value.first);
        temp.push(this.form.value.second);
        temp.push(this.form.value.third);
        temp.push(this.form.value.forth);
        const some = this.alerts.map((x) => x.id);
        const other = this.tempArray.map((x) => x.id);
        const mergeArr = _.union(temp, some);
        const indexDiff = _.difference(other, mergeArr);

        if (indexDiff.length > 0) {
            const el = this.tempArray.find((_c) => _c.id === indexDiff);
            this.alerts.push(el);
        }

        this.alerts = this.alerts.filter((x) => x.id !== event.id);
        this.arrayForm = [];
        this.arrayForm.push(this.form.value.first);
        this.arrayForm.push(this.form.value.second);
        this.arrayForm.push(this.form.value.third);
        this.arrayForm.push(this.form.value.forth);
    }

    update(event) {
        if (!event) {
            const arr = this.removeFromArray();
            this.alerts = [];
            const scope = this;
            setTimeout(() => {
                scope.alerts = arr;
            }, 0);
        }
    }


    setAlerts() {

        if (this.form.valid) {
            const signOutTime = moment(this.form.value.selectedMoment2).format();
            this.formSubmitted = false;
            localStorage.setItem('alerts', 'true');
            const data = {
                'alerts': {
                    'alert1': this.form.value.first,
                    'alert2': this.form.value.second,
                    'alert3': this.form.value.third,
                    'alert4': this.form.value.forth,
                    'on_duty': this.onDuty,
                    'on_call': this.onCall,
                    'chosen_workgroup': (this.workGroupList || []).filter(wg => wg.is_selected).map(wg => wg.id),
                    'sign_out': signOutTime
                },
            };

            this.alertService.updateDoctorAlerts(data).subscribe((_data) => {
                localStorage.setItem('signout_time', signOutTime);
                if (!this.unreadMessage) {
                    this.router.navigateByUrl('dashboard/profile');
                } else {
                    this.router.navigateByUrl('dashboard/messages');
                }

            }, err => {
                this.notify.notifyError(err);
            });
        } else {
            this.formSubmitted = true;
        }
    }

    createNewAlert() {
        this.dialog.open(AddAlertComponent, {
            width: '360px',
            data: {
                header: 'Add Alert Method',
                ok: 'Add Alert Method',
                edit: false
            }
        });
    }

    editAlert() {
        this.dialog.open(AddAlertComponent, {
            width: '360px',
            data: {
                header: 'Edit Alert Method',
                ok: 'Save Alert Method',
                edit: true
            }
        });
    }

    logout() {
        this.auth.logout().subscribe(() => {
            this.auth.clearStoreOnLogout();
        }, err => {
            this.notify.notifyError(err);
        });
    }

}
