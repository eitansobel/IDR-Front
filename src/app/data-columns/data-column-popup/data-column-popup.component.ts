import { Component, Inject, Input, OnInit } from '@angular/core';
import { CreateColumn, DeleteColumn, UpdateColumn } from '../../redux/dataColumns/data-column.action';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';

import { AppState } from '../../redux/app.state';
import { ConfirmDialogComponent } from 'src/app/common/confirm-dialog/confirm-dialog.component';
import { CustomValidators } from '../../models/validator';
import { DataColumn } from '../../models/data-columns';
import { DataColumnsService } from '../services/data-columns.service';
import { DataColumnsUpdateIntervalMapService } from '../services/data-columns-update-interval-map.service';
import { DialogOverviewComponent } from '../../common/dialogOverview/dialogOverview.component';
import { NgOption } from '@ng-select/ng-select';
import { NotifyService } from '../../services/notify.service';
import { SortByPipe } from '../../pipe/sort.pipe';
import { Store } from '@ngrx/store';
import { UpdateNestedColumn } from '../../redux/home/home.actions';

@Component({
    selector: 'idr-data-column-popup',
    templateUrl: './data-column-popup.component.html',
    styleUrls: ['./data-column-popup.component.scss']
})

export class DataColumnPopupComponent implements OnInit {
    public userFullName: string;
    public columnAuthor: string;
    public headerText = '';
    public updateIntervalTypes: NgOption[];
    public currentColumn: DataColumn;
    public currentColumnId: number;
    public columnForm: FormGroup;
    public homePage: boolean;
    public maxLength = 50;
    public _subFolders: FormArray;

    formSubmitted = false;
    message;

    public showHideTypes: NgOption[] = [
        {
            value: false,
            label: 'Show'
        },
        {
            value: true,
            label: 'Hide'
        },
    ];

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dataColumnsUpdateIntervalMapService: DataColumnsUpdateIntervalMapService,
        public dialogRef: MatDialogRef<DataColumnPopupComponent>,
        private dataService: DataColumnsService,
        private fb: FormBuilder,
        private sort: SortByPipe,
        private store: Store<AppState>,
        private notify: NotifyService,
        public dialog: MatDialog
    ) {
        if (this.data) {
            this.headerText = this.data.header;
            if (this.data.columnInstance) {
                this.homePage = this.data.nested;
                this.currentColumn = this.data.columnInstance;
                this.columnAuthor = this.currentColumn.author.full_name;
                this.currentColumnId = this.currentColumn.id;
            }
        }
    }

    ngOnInit() {

        this.store.select('profilePage').map(data => data.profile).subscribe((_profile) => {
            this.userFullName = `${_profile.first_name} ${_profile.last_name}`;
        });

        this.updateIntervalTypes = this.dataColumnsUpdateIntervalMapService.getLabelValue;

        this.columnForm = this.fb.group({
            title: ['', [
                Validators.required,
                // Validators.maxLength(this.maxLength),
                CustomValidators.validateBackspace
            ]],
            is_hidden: [false, []],
            is_private: [false, []]
        });

        if (this.currentColumn) {
            if (this.currentColumn.subfolders) {
                this.columnForm.addControl('subfolders', new FormArray([]));
            }
            this.columnForm.patchValue(this.currentColumn);
        }

        this.fillForm();
    }

    fillForm() {
        if (this.currentColumn) {

            if (this.currentColumn.subfolders) {

                this.currentColumn.subfolders.forEach(subFolder => {

                    subFolder.update_interval = subFolder.update_interval.toString();

                    const formGroup = this.createSubFolderGroup();
                    formGroup.patchValue(subFolder);

                    this.subFolders.push(formGroup);

                });

                //this.fillSubFolders(this.currentColumn.subfolders);
            }

        } else {

            this.columnForm.setValue({
                title: '',
                is_hidden: false,
                is_private: false,
            });

        }
    }

    createSubFolderGroup() {
        return this.fb.group({
            id: [],
            parent_id: [this.currentColumnId],
            title: ['Untitled'],
            update_interval: ['2', [Validators.required]],
            author: []
        });
    }

    getFormControl() {
        return this.fb.control(null);
    }

    addSubFolder() {
        if (!this.currentColumn || !this.currentColumn.subfolders) {
            this.columnForm.addControl('subfolders', new FormArray([]));
        }
        const formGroup = this.createSubFolderGroup();
        this.subFolders.push(formGroup);
        this.subFolders.markAsDirty();
    }

    get subFolders(): FormArray {
        const folders = (this.columnForm.get('subfolders') as FormArray);
        return folders;
    }

    save() {

        if (this.columnForm.valid && this.columnForm.dirty) {
            this.formSubmitted = false;
            const formData = this.columnForm.value;

            if (formData.subfolders && formData.subfolders.length > 0) {
                // TODO: Remove this once backend process null values properly
                formData.subfolders.forEach(item => {
                    if (!item.id){
                        delete item.id;
                    }
                    if (!item.parent_id) {
                        delete item.parent_id;
                    }
                    if (!item.author) {
                        delete item.author;
                    }
                });
            }

            if (this.currentColumn && this.currentColumn.id) {

                // Update folder
                this.dataService.updateDataColumn(this.currentColumn.id, formData).subscribe(
                    (resp: DataColumn) => {
                        if (this.homePage) {
                            this.notify.notifyError('TODO: Process UpdateNestedColumn.');
                            // this.store.dispatch(new UpdateNestedColumn(resp));
                        } else {
                            this.store.dispatch(new UpdateColumn(resp));
                        }
                        this.dialogRef.close();
                    }, err => {
                        this.notify.notifyError(err);
                    });

            } else {

                // Create folder
                this.dataService.createDataColumn(formData).subscribe(
                    (resp: DataColumn) => {
                        this.store.dispatch(new CreateColumn(resp));
                        this.dialogRef.close();
                    }, err => {
                        this.notify.notifyError(err);
                    });

            }
        } else {
            this.formSubmitted = true;
        }
    }

    removeSubFolderControl(index) {
        this.subFolders.removeAt(index);
    }


    deleteSubFolder(subFolder, index) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '342px',
            data: {
                header: 'Delete Folder',
                body: `Are you sure you want to delete sub-folder ${
                    subFolder.value.title
                }?`
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (subFolder.value.id > 0) {
                    this.dataService.deleteDataColumn(subFolder.value.id).subscribe(
                        _d => {
                            // Remove sub folder control
                            this.removeSubFolderControl(index);

                            // Mark form dirty to enable Save button. (better UX)
                            this.subFolders.markAsDirty();

                            // Update parent
                            this.store.dispatch(new UpdateColumn(this.currentColumn));
                        },
                        err => {
                            this.notify.notifyError(err);
                        }
                    );
                } else {
                    this.removeSubFolderControl(index);
                }
            }
        });
    }

    closeDialog() {
        this.dialogRef.close();
    }

    cancel() {
        this.columnForm.reset();
        this.dialogRef.close();
    }

    // TODO: Improve subfolder height restriction
    public get subFoldersHeight() {
        const subs = <FormArray>this.columnForm.get('subfolders');
        const subsHeight = subs.length * 55;
        return subsHeight > 200 ? 200 : subsHeight;
    }
}
