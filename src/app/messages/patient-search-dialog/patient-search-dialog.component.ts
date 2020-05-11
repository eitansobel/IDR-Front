import * as fromActions from '../state/';

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Store, select } from '@ngrx/store';

import { SortPatientsByPipe } from 'src/app/pipe/sortPatients.pipe';
import { State } from '../state/reducers';
import { map } from 'rxjs/operators';

@Component({
    selector: 'idr-patient-search-dialog',
    templateUrl: './patient-search-dialog.component.html',
    styleUrls: ['./patient-search-dialog.component.scss']
})
export class PatientSearchDialogComponent implements OnInit {
    public form: FormGroup;
    public headerText: string;
    private sortIndex = 0;
    public sortDirection = 0;
    public selectedPatient = null;

    people$ = this.store.pipe(
        select(fromActions.getPatients),
        map(patients => {
            return this.sortPipe.transform(patients, this.sortIndex, this.sortDirection);
        })
    );


    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<PatientSearchDialogComponent>,
        private fb: FormBuilder,
        private store: Store<State>,
        private sortPipe: SortPatientsByPipe
    ) {
        this.headerText = data.headerText;
    }

    ngOnInit() {
        this.form = this.fb.group({
            first_name: [''],
            last_name: [''],
            mrn: [''],
            dob: [''],
            list: [''],
        });
    }

    public sort(index) {
        this.sortIndex = index;
        this.sortDirection = this.sortDirection === 0 ? 1 : 0;
    }

    public ok() {
        this.dialogRef.close(this.selectedPatient);
    }

    public close() {
        this.dialogRef.close();
    }
}
