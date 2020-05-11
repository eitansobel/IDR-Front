import * as fromActions from '../actions/home.actions';
import * as fromHome from '..';

import { Action, Store, select } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { EMPTY, Observable, merge, of } from 'rxjs';
import { catchError, exhaustMap, filter, find, map, mergeMap, startWith, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import { FoldersService } from '../../services/folders.service';
import { HomeService } from '../../services/home.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MessageDialogComponent } from 'src/app/messages/message-dialog/message-dialog.component';
import { MessageDialogData } from 'src/app/messages/models/message-dialog-data';
import { Pages } from 'src/app/models/pages';
import { Patient } from 'src/app/models/patient';
import { PatientFolder } from 'src/app/models/patient-folder';
import { PatientPage } from 'src/app/models/patient-page';
import { PatientsService } from 'src/app/patients/services/patients.service';
import { StaffService } from 'src/app/staff/service/staff.service';
import { State } from '../reducers';
import { UpdatesService } from '../../services/updates.service';

@Injectable()
export class UpdateEffects {

    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private store: Store<State>,
        private updatesService: UpdatesService,
        private patientsService: PatientsService,
        private homeService: HomeService,
        private foldersService: FoldersService,
        private staffService: StaffService,
        public dialog: MatDialog,
    ) { }


    @Effect()
    selectPatientPage$: Observable<Action> = this.actions$.pipe(
        ofType(fromActions.HomeActionsTypes.SelectPage),
        withLatestFrom(this.store.select(fromHome.getState)),
        mergeMap(([action, state]: [any, any]) => {
            if (action && action.payload) {
                switch (action.payload.page) {
                    case Pages.Patients: {
                        return of(new fromActions.LoadUpdateFolders());
                    }
                    case Pages.Providers: {
                        return of(new fromActions.LoadProviders());
                    }
                    default: {
                        return of(new fromActions.LoadUpdateFolders());
                    }
                }
            }
            return of();
        })
    );

    // Add Update to seen exclude list
    // Execute

    // @Effect({ dispatch: false })
    // seenExcludeList$: Observable<Action> = this.actions$.pipe(
    //     ofType(fromActions.HomeActionsTypes.Sample),
    //     tap(() => console.log('Effect called'))
    //     // mergeMap((pList) => {

    //     //     console.log('Effect called', pList);
    //     //     // return this.http.get<string>('')
    //     //     //   .pipe(
    //     //     //     map((userName) => {
    //     //     //       return new actions.method(payload);
    //     //     //     })
    //     //     //   )
    //     // })
    // );

    @Effect()
    setUpdateSeen$: Observable<Action> = this.actions$.pipe(
        ofType(fromActions.HomeActionsTypes.SetUpdateSeen),
        mergeMap((action: any) => {
            return this.updatesService
                .setSeen(action.payload.update, action.payload.seen)
                .pipe(
                    map((item: any) => {
                        //action.payload.update.seen = action.payload.seen;
                        return new fromActions.LoadPatients();
                        //return new fromActions.SetUpdateSeenSuccess(action.payload);
                    }),
                    catchError(err => of(new fromActions.Error(err)))
                );
        })
    );


    @Effect()
    setAllUpdatesSeen$: Observable<Action> = this.actions$.pipe(
        ofType(fromActions.HomeActionsTypes.SetAllUpdatesSeen),
        withLatestFrom(this.store.select(fromHome.getState)),
        mergeMap(([action, state]) => {

            // TODO: Prevent unnecesary call to set all updates seen
            // check array for unseen updates

            return this.updatesService
                .setSeenBulk(state.selectedPatient, state.seenExcludeList)
                .pipe(
                    map((item: any) => {
                        return new fromActions.SetAllUpdatesSeenSuccess();
                    }),
                    catchError(err => of(new fromActions.Error(err)))
                );
        })
    );

    @Effect()
    refresh$: Observable<Action> = this.actions$.pipe(
        ofType(fromActions.HomeActionsTypes.Refresh),
        switchMap(res => [
            new fromActions.LoadPatients(),
            new fromActions.LoadUpdates(),
            new fromActions.LoadProviders()
        ])
    );

    @Effect()
    loadPatients$: Observable<Action> = this.actions$.pipe(
        ofType(fromActions.HomeActionsTypes.LoadPatients),
        startWith(new fromActions.Load()),
        withLatestFrom(this.store.select(fromHome.getState)),
        mergeMap(([action, state]) => {
            return this.homeService
                .getPatientsHeaders()
                .pipe(
                    switchMap((items: any[]) => {
                        const actions = [];
                        actions.push(new fromActions.LoadPatientsSuccess(items));
                        actions.push(new fromActions.LoadAllPatients());
                        if (state.patientPage) {
                            actions.push(new fromActions.SelectPage(state.patientPage));
                        }
                        return actions;
                    }),
                    catchError(err => of(new fromActions.LoadPatientsFail(err)))
                );
        })
    );

    @Effect()
    getPatientFolders$: Observable<Action> = this.actions$.pipe(
        ofType(fromActions.HomeActionsTypes.LoadUpdateFolders),
        mergeMap((action) => {
            return this.foldersService
                .getFolders()
                .pipe(
                    map((data: any) => {
                        const patientFolders: PatientFolder[] = [];
                        Object.keys(data).forEach(key => {
                            const pid = Number.parseInt(key, 10);
                            patientFolders.push({
                                patientId: pid,
                                folders: data[key]
                            });
                        });
                        return new fromActions.LoadUpdateFoldersSuccess(patientFolders);
                    })
                );
        })
    );

    @Effect()
    getPatientUpdates$: Observable<Action> = this.actions$.pipe(
        ofType(
            fromActions.HomeActionsTypes.GetPatientUpdates,
            fromActions.HomeActionsTypes.SelectPage,
            fromActions.HomeActionsTypes.SelectFolder,
            fromActions.HomeActionsTypes.SelectSubFolder,
            fromActions.HomeActionsTypes.SelectProvider,
        ),
        withLatestFrom(this.store.select(fromHome.getState)),
        mergeMap(([action, state]: [any, any]) => {
            // TODO: Create patient update
            if (!state.selectedPatient) {
                return EMPTY;
            }
            let folderId = null;
            let providerId = state.selectedProvider ? state.selectedProvider.id : null;
            let patientId = state.selectedPatient.id;
            let generalUpdates = false;

            if (state.selectedSubFolder && state.selectedSubFolder.id > 0) {
                folderId = state.selectedSubFolder.id;
            } else {
                folderId = state.selectedFolder ? state.selectedFolder.id : null;
            }

            // Get updates for currently authenicated doctor and selected folder
            // if (selectedFolder && selectedFolder.id > 0) {
            //     this.getUpdates(this.selectedFolder.id, this.patient.id);
            // } else if(selectedProviderId > 0){
            //     this.getUpdates(null, this.patient.id, data.selectedProvider.id);
            // } else {
            //     this.getUpdates(null, this.patient.id);
            // }
            if(action.type === fromActions.HomeActionsTypes.SelectPage){
                if(action.payload.page === Pages.Providers){
                    generalUpdates = true;
                }
            }
            if(action.type === fromActions.HomeActionsTypes.SelectProvider){
                generalUpdates = true;
            }

            return this.updatesService
                .getUpdates(folderId, patientId, providerId, generalUpdates)
                .pipe(
                    map((updates: any) => {
                        updates = updates.sort((a, b) => {
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
                        return new fromActions.SetUpdates(updates);
                    }),
                    catchError(err => of(new fromActions.Error(err)))
                );
        })
    );

    @Effect()
    loadProviders$: Observable<Action> = this.actions$.pipe(
        ofType(fromActions.HomeActionsTypes.LoadProviders),
        withLatestFrom(this.store.select(fromHome.getState)),
        mergeMap(([action, state]) => {
            return this.staffService
                .getPatientProviders()
                .pipe(
                    map((items: any) => {
                        const providers: any[] = [];
                        Object.keys(items).forEach(key => {
                            const pid = Number.parseInt(key, 10);
                            providers.push({
                                patientId: pid,
                                providers: items[key]
                            });
                        });
                        return new fromActions.LoadProvidersSuccess(providers);
                    }),
                    catchError(err => of(new fromActions.Error(err)))
                );
        })
    );

    @Effect()
    hidePatient$: Observable<Action> = this.actions$.pipe(
        ofType(fromActions.HomeActionsTypes.HidePatient),
        mergeMap((action: any) => {
            return this.patientsService
                .patientShow(action.visibility, action.payload)
                .pipe(
                    switchMap((item: any) => {
                        return [
                            new fromActions.HidePatientSuccess(action.payload),
                            new fromActions.LoadPatients()
                        ];
                    }),
                    catchError(err => of(new fromActions.Error(err)))
                );
        })
    );

    @Effect()
    messageDialog$: Observable<Action> = this.actions$.pipe(
        ofType(fromActions.HomeActionsTypes.MessageDialog),
        map((action: any) => action.payload),
        exhaustMap((data: MessageDialogData) => {
            const dialogRef = this.dialog.open(MessageDialogComponent, {
                width: '440px',
                data: {
                    headerText: data.headerText || 'New Message',
                }
            });
            return dialogRef.afterClosed();
        }),
        map((result: any) => {
            if (result === undefined) {
                return new fromActions.MessageDialogClose();
            }
            return new fromActions.MessageDialogResult(result);
        })
    );

    @Effect()
    loadMessages$: Observable<Action> = this.actions$.pipe(
        ofType(fromActions.HomeActionsTypes.LoadMessages),
        startWith(new fromActions.LoadMessages()),
        map(action => {
            const sample = [
                {
                    id: 1,
                    subject: 'Abnormal Blood Pressure. High Heartbeat',
                    message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                    type: 1,
                    important: false,
                    seen: false
                },
                {
                    id: 2,
                    subject: 'Re: Blood Pressure.',
                    message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                    type: 2,
                    important: true,
                    seen: true
                },
                {
                    id: 3,
                    subject: 'Headache Complaints.',
                    message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                    type: 3,
                    important: false,
                    seen: true
                },
            ]
            return new fromActions.LoadMessagesSuccess(sample);
        })
    );

    @Effect()
    loadAllPatients$: Observable<Action> = this.actions$.pipe(
        ofType(fromActions.HomeActionsTypes.LoadAllPatients),
        mergeMap((action) => {
            return this.patientsService
                .getAllPatients2()
                .pipe(
                    map((patients: any[]) => {
                        return new fromActions.LoadAllPatientsSuccess(patients);
                    }),
                    catchError(err => of(new fromActions.Error(err)))
                );
        })
    );
}

