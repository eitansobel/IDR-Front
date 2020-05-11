import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

import {AppState} from '../../redux/app.state';
import {HomeService} from '../services/home.service';
import {NotifyService} from "../../services/notify.service";
import {Router} from '@angular/router';
import { Sort } from 'src/app/models/sort';
import { SortPatients } from '../state/actions/home.actions';
import { State } from '../state/reducers';
import {Store} from '@ngrx/store';
import {UpdatePatientOrder} from '../../redux/profile/profile.action';

@Component({
    selector: 'idr-sort-patient-popup',
    templateUrl: './sort-patient-popup.component.html',
    styleUrls: ['./sort-patient-popup.component.scss']
})
export class SortPatientPopupComponent implements OnInit {

    public headerText: string = '';
    public sort: number = 1;
    public order: number = 1;
    public id: number;
    message;



    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                public dialogRef: MatDialogRef<SortPatientPopupComponent>,
                private store: Store<AppState>,
                private store2: Store<State>,
                private hService: HomeService,
                private notify: NotifyService) {
        if (this.data) {
            this.headerText = this.data.header;
        }

    }

    ngOnInit() {
        this.store
            .select('profilePage')
            .map(data => data.profile)
            .subscribe((_profile) => {
                this.sort = _profile.patient_sort_by;
                this.order = _profile.patient_order;
                this.id = _profile.remote_id;
        });
    }
    closeDialog() {
        this.dialogRef.close();
    }
    applySort() {
        this.hService.setPatientOrder(this.id, {'patient_sort_by': this.sort, 'patient_order': this.order}).subscribe(
            () => {
                const sort = new Sort({sortBy: this.sort, order: this.order});
                this.store2.dispatch(new SortPatients(sort));
                this.store.dispatch(new UpdatePatientOrder( {patient_sort_by: this.sort, patient_order: this.order, remote_id: this.id}));
                this.dialogRef.close();
            },
            (err) => {
                this.notify.notifyError(err);
            }
        );
    }
}
