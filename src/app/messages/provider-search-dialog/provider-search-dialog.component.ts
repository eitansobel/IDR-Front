import * as fromActions from '../state/';

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Store, select } from '@ngrx/store';
import { filter, map } from 'rxjs/operators';

import { Profile } from 'src/app/models/profile';
import { SortPatientsByPipe } from 'src/app/pipe/sortPatients.pipe';
import { State } from '../state/reducers';

@Component({
  selector: 'idr-provider-search-dialog',
  templateUrl: './provider-search-dialog.component.html',
  styleUrls: ['./provider-search-dialog.component.scss']
})
export class ProviderSearchDialogComponent implements OnInit {

    public form: FormGroup;
    public headerText: string;
    private sortIndex = 0;
    public sortDirection = 0;
    public selectedPatient = null;

    people$ = this.store.pipe(
        select(fromActions.getProviders),
        map(people => {
            let result = this.sortPipe.transform(people, this.sortIndex, this.sortDirection);
            console.log('result', result)
            if (result && this.form && this.form.value) {
                result = result.filter((person: Profile) => {
                    return person.first_name
                        .toLowerCase()
                        .startsWith(this.form.value.first_name.toLowerCase());
                });
            }
            return result;
        })
    );

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<ProviderSearchDialogComponent>,
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
            role: [''],
            wg: [''],
            onDuty: [false],
            onCall: [false],
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
