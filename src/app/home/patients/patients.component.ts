import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { HomePatientProviders, SelectedPatient, UpdateMyPatient } from '../../redux/home/home.actions';
import { Refresh, SelectPage, SelectPatient } from '../state/actions/home.actions';

import { AppState } from '../../redux/app.state';
import { BaseComponent } from 'src/app/common/base/base.component';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { DataColumn } from 'src/app/models/data-columns';
import { DataColumnsService } from '../../data-columns/services/data-columns.service';
import { DialogOverviewComponent } from '../../common/dialogOverview/dialogOverview.component';
import { FoldersService } from '../services/folders.service';
import { MatDialog } from '@angular/material';
import { MyPatient } from '../../models/my-patients';
import { Pages } from '../../models/pages';
import { Patient } from 'src/app/models/patient';
import { PatientBase } from 'src/app/models/patient-base';
import { PatientFolder } from 'src/app/models/patient-folder';
import { PatientPage } from '../../models/patient-page';
import { PatientProvider } from 'src/app/models/patient-provider';
import { PatientsService } from '../../patients/services/patients.service';
import { Router } from '@angular/router';
import { StaffService } from 'src/app/staff/service/staff.service';
import { Store } from '@ngrx/store';
import { UpdateFolderSummary } from 'src/app/models/patient-folder-summary';
import { UpdateMyPatientStatus } from '../../redux/patientsList/patientsList.action';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'idr-patients',
    templateUrl: './patients.component.html',
    styleUrls: ['./patients.component.scss'],
    providers: [DataColumnsService]
})
export class PatientsComponent extends BaseComponent implements OnInit, OnDestroy {
    @Input() patients: any = []; // { <id>: PatientBase }
    @Input() allPatients: any[];
    // @Input() selectedPage: any;
    @Input() selectedPatient: PatientBase;
    @Input() selectedFolder: UpdateFolderSummary; // { <id>: PatientBase }
    @Input() folderPerPatient: boolean;
    @Input() updateFolders: any[];
    @Output() pageChanged = new EventEmitter<PatientPage>(); // TODO: Define model { patient: ..., page: ... }
    @Output() patientHidden = new EventEmitter<PatientBase>();
    public selectedPage: Pages;
    public patientSearchKeys = ['first_name', 'last_name'];
    public patientSearchText: string;
    // public selectedPatient: PatientBase;
    public objectKeys = Object.keys;
    // public patientFolders: PatientFolder[] = [];

    // Providers
    public patientProviders: any[];
    public patientProvidersOriginal: string;
    public imageUrl: string = environment.settings.backend2;

    constructor(
        private dataService: DataColumnsService,
        public dialog: MatDialog,
        private store: Store<AppState>,
        private patientsService: PatientsService,
        private router: Router,
        private foldersService: FoldersService,
        private staffService: StaffService
    ) {
        super();
    }

    ngOnInit() {
        // this.store
        //     .select('homePatientsPage')
        //     .subscribe(stored => {
        //         this.patientFolders = stored.patientFolders;
        //         if (!stored.patientProviders) {
        //             this.getProviders();
        //         }
        //     });
    }

    getPatientAvatar(patient) {
        const match = this.allPatients.find(p => p.id === patient.remote_id);
        if (match) {
            return this.imageUrl + match.avatar;
        }
        return null;
    }

    ngOnDestroy() {

    }

    hidePatient(patient: PatientBase) {

        const patientName = `${patient.first_name} ${patient.last_name}`;
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            panelClass: 'p0',
            width: '380px',
            data: {
                header: 'Remove Patient',
                body: `Are you sure you want to remove  ${patientName}?`
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (patient && patient.id > 0) {
                    this.patientHidden.emit(patient);
                }

                // if (patient.value.id > 0) {
                //     this.dataService.deleteDataColumn(subFolder.value.id).subscribe(
                //         _d => {
                //             this.removeSubFolderControl(index);
                //             this.store.dispatch(new DeleteColumn(subFolder.value));
                //         },
                //         err => {
                //             this.notify.notifyError(err);
                //         }
                //     );
                // } else {
                //     this.removeSubFolderControl(index);
                // }
            }
        });

    }

    get patientFolder() {
        return this.selectedFolder;
    }

    getFolderByPatient(patient: PatientBase) {
        let result = null;
        if (this.updateFolders) {
            const item = this.updateFolders.find(q => q.patientId === patient.remote_id);
            if (item) {
                item.folders.forEach(q => {
                    const sub = q.subfolders.find((s: UpdateFolderSummary) => s.id === this.selectedFolder.id)
                    if (sub) {
                        result = { ...sub };
                    }
                });
            }
        }
        return result;
    }

    selectPatient(patient: PatientBase) {
        this.selectPage(patient, Pages.Patients);
    }

    selectProvider(patient: PatientBase) {
        this.selectPage(patient, Pages.Providers);
    }

    selectMessages(patient: PatientBase) {
        this.selectPage(patient, Pages.Messages);
    }

    selectPatientFolder(patient: PatientBase) {
        this.selectedPatient = patient;
        this.store.dispatch(new SelectPatient(patient));
        this.store.dispatch(new Refresh());
    }

    selectPage(patient: PatientBase, page: Pages) {
        // this.selectedPatient = patient;
        this.selectedPage = page;
        this.pageChanged.emit(new PatientPage(patient, page));
    }

    totalProviderNewUpdates(patient: PatientBase) {
        let total = 0;
        if (this.patientProviders && this.patientProviders.length > 0) {
            const item = this.patientProviders.find(element => element.patientId === patient.remote_id);
            if (item && item.providers && item.providers.length > 0) {
                item.providers.forEach(element => {
                    total += element.unseen;
                });
            }
        }
        return total;
    }

    totalProviderExpiredUpdates(patient: PatientBase) {
        const total = 0;
        return total;
    }

    totalNewMessages(patient: PatientBase) {
        return 0;
    }
}

