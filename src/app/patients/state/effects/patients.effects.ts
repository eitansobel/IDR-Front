import * as fromActions from '../actions/patients.actions';

import { Action, Store, select } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { EMPTY, Observable, merge, of } from 'rxjs';
import { catchError, exhaustMap, filter, find, map, mergeMap, startWith, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Patient } from 'src/app/models/patient';
import { PatientsService } from 'src/app/patients/services/patients.service';
import { Profile } from 'src/app/models/profile';
import { StaffService } from 'src/app/staff/service/staff.service';
import { State } from '../reducers';

// Required Fields:
// * `chat` (int) id of chat
// * `subject` (str) message subject
// * `text` (str) message text

// Optional Fields:

// * `flagged` (boolean) Default False
// * `urgency` (int) 1 - 'Immediate', 2 - '30 minutes', 3 - '1hr', 4 - '2hr', 5 - 'FYI - No Alert'. Default 5
// ---

@Injectable()
export class PatientsEffects {

    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private store: Store<State>,
        public dialog: MatDialog,
        public patientsService: PatientsService,
        public staffService: StaffService,
    ) { }

    @Effect()
    loadPatients$: Observable<Action> = this.actions$.pipe(
        ofType(
            fromActions.PatientsActionsTypes.LoadPatients,
            fromActions.PatientsActionsTypes.MessageDialog
        ),
        mergeMap(action => {
            return this.patientsService
                .getAllPatients()
                .pipe(
                    map((patients: Patient[]) => {
                        return new fromActions.LoadPatientsSuccess(patients);
                    }),
                    catchError(err => of(new fromActions.Error(err)))
                );
        })
    );

    @Effect()
    loadPatientsList: Observable<Action> = this.actions$.pipe(
        ofType(
            fromActions.PatientsActionsTypes.LoadPatientsList,
        ),
        mergeMap(action => {
            return this.patientsService
                .getPatList()
                .pipe(
                    map((patients: any) => {
                        return new fromActions.LoadPatientsListSuccess(patients);
                    }),
                    catchError(err => of(new fromActions.Error(err)))
                );
        })
    )

    @Effect()
    loadProviders$: Observable<Action> = this.actions$.pipe(
        ofType(
            fromActions.PatientsActionsTypes.LoadProviders,
            fromActions.PatientsActionsTypes.MessageDialog
        ),
        mergeMap(action => {

            return this.staffService
                .getAllMembers2()
                .pipe(
                    map((providers: Profile[]) => {
                        return new fromActions.LoadProvidersSuccess(providers);
                    }),
                    catchError(err => of(new fromActions.Error(err)))
                );
        })
    );

    @Effect()
    hidePatient$: Observable<Action> = this.actions$.pipe(
        ofType(fromActions.PatientsActionsTypes.HidePatient),
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

}

