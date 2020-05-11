import { Component, OnInit } from '@angular/core';

import { AppState } from '../redux/app.state';
import { DataColumn } from '../models/data-columns';
import { DataColumnPopupComponent } from './data-column-popup/data-column-popup.component';
import { DataColumnsService } from './services/data-columns.service';
import { GetColumns } from '../redux/dataColumns/data-column.action';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { UserPermissionService } from '../services/user-permission.service';

@Component({
    selector: 'idr-data-columns',
    templateUrl: './data-columns.component.html',
    styleUrls: ['./data-columns.component.scss']
})
export class DataColumnsComponent implements OnInit {
    public listHeader: string[] = [
        'Update Folder Title',
        'Visibility',
        'Private/Public'
    ];
    public spinner = true;
    public loadProfile = false;

    constructor(
        public dialog: MatDialog,
        private dataColumnService: DataColumnsService,
        private userPermissionService: UserPermissionService,
        private store: Store<AppState>
    ) {
    }

    ngOnInit() {
        this.dataColumnService.getDataColumns()
            .subscribe((_dataColumns: DataColumn[]) => {
                this.store.dispatch(new GetColumns(_dataColumns));
            });
    }

    newDataColumn(): void {
        this.dialog.open(DataColumnPopupComponent, {
            width: '440px',
            data: {
                header: 'Create Update Folder',
            }
        });
    }

    get userCanCreateDataColumn() {
        return this.userPermissionService.userCanCreateDataColumn;
    }
}
