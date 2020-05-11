import * as fromHome from '../state';
import * as moment from 'moment';

import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AddSeenExcludeListAction, Refresh, SetUpdateSeen } from '../state/actions/home.actions';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { AddProfile } from 'src/app/redux/profile/profile.action';
import { ApiFactory } from 'src/app/services/api.factory';
import { AppState } from '../../redux/app.state';
import { BaseComponent } from '../../common/base/base.component';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DataColumn } from '../../models/data-columns';
import { LoadPatients } from 'src/app/messages/state/actions/message.actions';
import { MatDialog } from '@angular/material';
import { MyPatient } from 'src/app/models/my-patients';
import { NotifyService } from 'src/app/services/notify.service';
import { Observable } from 'rxjs/Observable';
import { Patient } from '../../models/patient';
import { PatientBase } from 'src/app/models/patient-base';
import { PatientFolder } from 'src/app/models/patient-folder';
import { Profile } from '../../models/profile';
import { RouterService } from '../../services/router.service';
import { State } from '../state/reducers';
import { Update } from 'src/app/models/update';
import { UpdateDialogComponent } from '../update-dialog/update-dialog.component';
import { UpdateFolderSummary } from 'src/app/models/patient-folder-summary';
import { UpdatesService } from '../services/updates.service';
import { environment } from 'src/environments/environment';
import { filter } from 'lodash';
import { load } from '@angular/core/src/render3';
import { tap } from 'rxjs/operators';

@Component({
    selector: 'idr-updates',
    templateUrl: './updates.component.html',
    styleUrls: ['./updates.component.scss'],
    providers: [RouterService, UpdatesService]
})
export class UpdatesComponent extends BaseComponent implements OnInit, OnDestroy {
    @Input() general = false;
    selectedFolder: UpdateFolderSummary;
    selectedFolderId: number;
    selectedProviderId: number;
    selectedProvider: any;
    userProfile: Profile;
    patient: PatientBase;
    isSubFolder = false;
    updates: Update[];
    _data: any;

    public updates$ = this.store
        .pipe(
            select(fromHome.getUpdates)
        );

    public selectedProvider$ = this.store
        .pipe(
            select(fromHome.getSelectedProvider),
            tap(provider => { this.selectedProvider = provider; }
        )
    );

    public selectedSubFolder$ = this.store
        .pipe(
            select(fromHome.getSelectedSubFolder),
            tap(subFolder => { this.selectedFolder = subFolder; }
        )
    );

    public selectedPatient$ = this.store
        .pipe(
            select(fromHome.getSelectedPatient),
            tap(patient => { this.patient = patient; })
        )
        .takeUntil(this.destroyed$)
        .subscribe();

    public selectedFolder$ = this.store
        .pipe(
            select(fromHome.getSelectedFolder)
        );

    private BASE_URL: string = environment.settings.backend1 + 'api/';

    constructor(
        public dialog: MatDialog,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private routerService: RouterService,
        private updatesService: UpdatesService, // rename to UpdateService
        private store: Store<AppState>,
        private store2: Store<State>,
        private af: ApiFactory,
        private notify: NotifyService,
    ) {
        super();
        this.updates = [];
    }

    ngOnInit() {
        this.load();
    }
    ngOnDestroy() {

    }

    load() {
        // this.store.select('homePatientsPage')
        //     .map((data) => data)
        //     .takeUntil(this.destroyed$)
        //     .subscribe((data) => {
        //         this._data = data;
        //         // Keep selectedPatient reference to create/modify updates
        //         this.patient = data.selectedPatient;
        //         if (!this.patient) {
        //             return;
        //         }
        //         // Keep selected (sub-)folder reference to get updates
        //         if (data.selectedSubFolder && data.selectedSubFolder.id > 0) {
        //             this.isSubFolder = true;
        //             this.selectedFolder = data.selectedSubFolder;
        //         } else {
        //             this.isSubFolder = false;
        //             this.selectedFolder = data.selectedFolder;
        //         }

        //         // Get updates for currently authenicated doctor and selected folder
        //         if (this.selectedFolder && this.selectedFolder.id > 0) {
        //             this.getUpdates(this.selectedFolder.id, this.patient.id);
        //         } else if(this.selectedProviderId > 0){
        //             this.getUpdates(null, this.patient.id, data.selectedProvider.id);
        //         } else {
        //             this.getUpdates(null, this.patient.id);
        //         }
        //     });

        this.activatedRoute.params.subscribe(q => {
            this.selectedFolderId = q.folderId;
            this.selectedProviderId = q.providerId;
        });
    }


    getUpdates(folderId?, patientId?, providerId?) {
        this.updatesService
            .getUpdates(folderId, patientId, providerId)
            .subscribe((updates: any) => {
                this.sortUpdates(updates);
            });
    }

    sortUpdates(updates) {
        this.updates = updates.sort((a, b) => {
            if (
                (a['created'] || '').toLowerCase() < (b['created'] || '').toLowerCase()
            ) {
                return 1;
            } else if (
                (a['created'] || '').toLowerCase() > (b['created'] || '').toLowerCase()
            ) {
                return -1;
            } else {
                return 0;
            }
        });
    }

    openUpdateDialog(update?: Update) {
        const _selFolderTitle = (<any>this.selectedFolder || {}).title;
        const _selFolder = this.selectedFolder || update.folder;

        const dialogRef = this.dialog.open(UpdateDialogComponent, {
            width: '440px',
            data: {
                header: _selFolderTitle || 'Copy Update',
                folder: _selFolder || update.folder,
                doctor: this.userProfile,
                patient: this.patient,
                update: update
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                // TODO: Insert entry into updates
                //this.updates.splice(0, 0, result);
                this.store2.dispatch(new Refresh());
            }
        });
    }

    addUpdateClicked() {
        this.openUpdateDialog();
    }

    copyUpdateClicked($event, update: Update) {
        this.openUpdateDialog(update);
    }

    getProfile() {
        const id = localStorage.getItem('idrUserId');
        return this.af.sendGet(`${this.BASE_URL}v1/doctor/${id}/`);
    }

    mergeUpdates(profile: Profile, updates: Update[]): Profile {
        profile.my_patients_list_participants.forEach((_myPatient: MyPatient) => {
            updates.forEach(_update => {
                if (_myPatient.patient.id === _update.patient) {
                    if (!_myPatient.updates) {
                        _myPatient.updates = [];
                    }
                    _myPatient.updates.push(_update);
                }
            });
        });
        return profile;
    }

    setSeen(event, update: Update, seen: {state: boolean, custom_unseen: boolean}) {
        event.preventDefault();
        event.stopPropagation();
        this.store2.dispatch(new SetUpdateSeen({ update: update, seen: seen.custom_unseen }));
    }

    setFlagged(event, update: Update, flag = false) {
        event.preventDefault();
        event.stopPropagation();
        this.updatesService
            .setFlagged(update, !this.isFlagged(update))
            .subscribe(
                result => {
                    // TODO: Dispatch modified update
                    this.store2.dispatch(new Refresh());
                },
                error => {
                    this.notify.notifyError('An error occured while unflagging this update. Please try again later.');
                }
            );
    }

    formatDate(update: Update) {
        const updateToday = moment.utc(update.created).local();
        if (moment().startOf('day').valueOf() === updateToday.clone().startOf('day').valueOf()) {
            return `Today ${moment.utc(update.created).local().format('hh:mm A')}`;
        } else {
            return updateToday.format('MMM DD, YYYY hh:mm A');
        }
    }

    isFlagged(update: Update) {
        if (update.flagged_custom === true) {
            return true;
        } else if (update.flagged_custom === false) {
            return false;
        }
        return update.flagged;
    }
}
