import * as moment from 'moment';

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { AppState } from '../../redux/app.state';
import { CustomValidators } from '../../models/validator';
import { DataColumn } from '../../models/data-columns';
import { DataColumnsUpdateIntervalMapService } from '../../data-columns/services/data-columns-update-interval-map.service';
import { HomeRefresh } from 'src/app/redux/home/home.actions';
import { Refresh } from '../state/actions/home.actions';
import { Store } from '@ngrx/store';
import { Update } from '../../models/update';
import { UpdatesService } from '../services/updates.service';

@Component({
    selector: 'idr-update-dialog',
    templateUrl: './update-dialog.component.html',
    styleUrls: ['./update-dialog.component.scss'],
    providers: [UpdatesService]
})
export class UpdateDialogComponent implements OnInit {
    headerText = '';
    updateForm: FormGroup;
    message: any;
    currentUpdate: Update;
    selectedFolder: any;
    public isFlagged: false;

    constructor(
        public store: Store<AppState>,
        public intervalService: DataColumnsUpdateIntervalMapService,
        public updatesService: UpdatesService,
        public fb: FormBuilder,
        public dialogRef: MatDialogRef<UpdateDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {

        this.headerText = data.header;
        this.currentUpdate = data.update;
        this.selectedFolder = data.folder;

    }

    ngOnInit() {
        // TODO: IMPORTANT: Remove default 30 minutes interval once IDR-662 is done
        const folderInterval = this.intervalService.secondsToUpdate(this.data.folder.update_interval || 2);
        const nextUpdate = moment().local().add(folderInterval, 'milliseconds');

        const _currentUpdate = this.currentUpdate || new Update();


        this.updateForm = this.fb.group({
            active: [true],
            flagged: [false],
            content: [null, [Validators.required]],
            files: [null],
            remind_time_enabled: [true],
            remind_time: [nextUpdate],
            // doctor: [this.data.doctor.id],
            folder: [ this.data.folder ],
            patient: [this.data.patient.id]
        });

        if (this.currentUpdate) {
            this.updateForm.patchValue(this.currentUpdate);
            this.updateForm.markAsDirty();
        }
    }

    closeDialog() {
        this.dialogRef.close();
    }

    save() {
        if (this.updateForm.valid && this.updateForm.dirty) {

            const formData = this.updateForm.value;
            const local = moment(formData.remind_time).format();
            const utc = moment(local).utc();

            this.updatesService
                .createUpdate({
                    active: formData.active,
                    content: formData.content,
                    files: formData.files,
                    flagged: formData.flagged,
                    folder: formData.folder.id,
                    patient: formData.patient,
                    remind_time: formData.remind_time_enabled ? utc : void 0,
                })
                .subscribe(result => {
                    this.store.dispatch(new Refresh());
                    this.dialogRef.close(result);
                });
        }
    }

    filesChanged(evt) {

    }

    filesUpdated(evt) {

    }
}
