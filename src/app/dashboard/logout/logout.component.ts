import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { AppState } from '../../redux/app.state';
import { AuthService } from '../../auth/services/auth.service';
import { BaseComponent } from 'src/app/common/base/base.component';
import { ClearAlert } from '../../redux/alerts/alerts.action';
import { ClearLists } from '../../redux/staff/staff.action';
import { ClearPatLists } from '../../redux/patientsList/patientsList.action';
import { ClearPatients } from '../../redux/patients/patients.action';
import { Logout } from '../../redux/profile/profile.action';
import { NotifyService } from '../../services/notify.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

@Component({
    selector: 'idr-logout',
    templateUrl: './logout.component.html',
    styleUrls: ['./logout.component.scss']
})
export class LogoutComponent extends BaseComponent implements OnInit {
    public header = '';
    private saveMode = false;
    username;

    constructor(public dialogRef: MatDialogRef<LogoutComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private auth: AuthService,
        private notify: NotifyService,
        private router: Router,
        private store: Store<AppState>
    ) {
        super();
        if (this.data) {
            this.header = this.data.header;
            this.username = this.data.username;
        }
    }

    ngOnInit() {
    }

    close() {
        this.dialogRef.close();
    }

    logoutControl(value) {
        this.saveMode = value;
    }

    logout() {
        if (!this.saveMode) {
            this.auth
                .logout()
                .subscribe(() => {
                    this.clearStore();
                    this.auth.clearStoreOnLogout();
                    this.dialogRef.close();
                }, (err) => {
                    if (err.detail === 'Invalid token') {
                        this.clearStore();
                        this.auth.clearStoreOnLogout();
                        this.dialogRef.close();
                    } else {
                        this.notify.notifyError(err);
                        this.dialogRef.close();
                    }
                });
        } else {
            localStorage.removeItem('idrToken');
            localStorage.removeItem('idrId');
            this.router.navigateByUrl('auth/login');
            this.clearStore();
            localStorage.setItem('lock', 'true');
            localStorage.setItem('logoutPage', this.router.url);
            this.dialogRef.close();
        }
    }

    clearStore() {
        this.store.dispatch(new Logout());
        this.store.dispatch(new ClearAlert());
        this.store.dispatch(new ClearLists());
        this.store.dispatch(new ClearPatLists());
        this.store.dispatch(new ClearPatients());
        this.dialogRef.close();
    }
}
