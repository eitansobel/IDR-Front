import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/distinctUntilChanged';

import * as fromActions from '../state/actions/home.actions';
import * as fromHome from '../state';

import { ActivatedRoute, Route, Router } from '@angular/router';
import { Component, EventEmitter, OnDestroy, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatAccordion, MatExpansionPanel } from '@angular/material';
import { SelectFolder, SelectSubFolder, SetAllUpdatesSeen } from '../state/actions/home.actions';
import { Store, select } from '@ngrx/store';

import { AppState } from '../../redux/app.state';
import { BaseComponent } from '../../common/base/base.component';
import { DataColumn } from '../../models/data-columns';
import { DataColumnsService } from '../../data-columns/services/data-columns.service';
import { FoldersService } from '../services/folders.service';
import { MyPatient } from 'src/app/models/my-patients';
import { NgScrollbar } from 'ngx-scrollbar';
import { PatientBase } from 'src/app/models/patient-base';
import { PatientFolder } from 'src/app/models/patient-folder';
import { RouterService } from '../../services/router.service';
import { State } from '../state/reducers';
import { UpdateFolderSummary } from 'src/app/models/patient-folder-summary';
import { filter } from 'lodash';
import { tap } from 'rxjs/internal/operators/tap';

// rxjs > 5.5 import { distinctUntilChanged } from 'rxjs/operators';

@Component({
    selector: 'idr-folders',
    templateUrl: './folders.component.html',
    styleUrls: ['./folders.component.scss']
})
export class FoldersComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChildren(MatAccordion) accordions: QueryList<MatAccordion>;
    @ViewChild(NgScrollbar) scrollRef: NgScrollbar;
    @ViewChildren(MatExpansionPanel) panel: QueryList<MatExpansionPanel>;
    @Output() subFolderChanged = new EventEmitter<DataColumn>();

    updateFolders$ = this.store.pipe(select(fromHome.getPatientFolders), tap((data) => console.log('update folders:', data)));
    hideFolders$ = this.store.pipe(select(fromHome.getHideFolders));
    folderToSelect$ = this.store.pipe(select(fromHome.getSelectedFolder));
    folderToSelect: any;

    folders: PatientFolder[] = [];
    folderLastSelected: DataColumn;
    routeParams: any;
    selectedPatient: PatientBase;
    selectedPatientId: number;
    _foldersOriginal = null;

    constructor(
        private dataColumnService: DataColumnsService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private routerService: RouterService,
        private store: Store<State>,
        private foldersService: FoldersService
    ) {
        super();
        this.folderToSelect$
            .takeUntil(this.destroyed$)
            .subscribe(folder => {
                this.folderToSelect = folder;
            });

        this.store.dispatch(new fromActions.LoadUpdateFolders());
    }

    ngOnInit() {
        this.activatedRoute
            .params
            .takeUntil(this.destroyed$)
            .subscribe(q => {
                this.routeParams = q;
                if (this.selectedPatientId !== q.patientId) {

                    // Set all updates as seen on patient change
                    // Ensure that updates was shown before calling it
                    if (this.selectedPatientId) {
                        this.store.dispatch(new SetAllUpdatesSeen(this.selectedPatientId));
                    }

                    // Keep patient reference to call this block once
                    this.selectedPatientId = q.patientId;

                    // Collapse all folders
                    setTimeout(() => {
                        if (!this.folderToSelect) {
                            this.collapseAll();
                        }
                    });
                }
            });

        // TODO: Pre-select folder
        // this.store
        //     .select('homePatientsPage')
        //     .takeUntil(this.destroyed$)
        //     .map(stored => stored)
        //     .subscribe(stored => {
        //         if (!stored.selectedPatient) {
        //             return;
        //         }
        //         this.hideFolders = stored.hideFolders;
        //         this.getFolders(stored.selectedPatient.remote_id);
        //         this.folderToSelect = stored.selectedFolder;
        //     });
    }

    ngOnDestroy() {
        // TODO: Account custom seen status
        this.store.dispatch(new SetAllUpdatesSeen(this.selectedPatientId));
        this.store.dispatch(new fromActions.SelectFolder(null));
    }

    isExpanded(folder: any) {
        return this.folderToSelect && folder.id === this.folderToSelect.id;
    }

    folderClicked(folder: any, event: Event): void {
        event.preventDefault();
        event.stopPropagation();
        if (this.folderToSelect && folder.id === this.folderToSelect.id) {
            this.folderToSelect = null;
            this.store.dispatch(new SelectFolder(null));
        } else {
            this.folderToSelect = folder; // new DataColumn(
            this.store.dispatch(new SelectFolder(folder));
            this.navigateToFolderId(folder ? folder.id : 0);
        }
    }

    subFolderClicked(folder: any, event: Event): void {
        event.stopPropagation();
        this.store.dispatch(new SelectSubFolder(folder));
        this.navigateToFolderId(folder.id);
    }

    collapseAll() {
        this.folderToSelect = null;
    }

    closeOtherPanels(openPanel: MatExpansionPanel) {
        this.panel.forEach(panel => {
            if (panel !== openPanel) {
                panel.close();
            }
        });
    }

    folderClosed(folder: DataColumn) {
        if (!this.folderToSelect) {
            this.navigateToFolderId(0);
        }
    }

    folderOpened(folder: DataColumn) {
    }

    selectSubFolder(folder: DataColumn) {
    }


    navigateToFolderId(folderId: number = 0) {
        this.router.navigate(
            [
                'patients',
                this.routeParams.patientId,
                folderId || 0
            ],
            { relativeTo: this.activatedRoute.parent }
        );
    }
}
