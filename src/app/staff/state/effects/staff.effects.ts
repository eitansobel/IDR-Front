import * as fromActions from '../actions/staff.actions';
import * as fromStaff from '../';

import { Action, Store, select } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { EMPTY, Observable, merge, of } from 'rxjs';
import { catchError, exhaustMap, filter, find, map, mergeMap, startWith, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import { HospitalDepartmentService } from 'src/app/services/hospital.structure.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Patient } from 'src/app/models/patient';
import { PatientsService } from 'src/app/patients/services/patients.service';
import { Profile } from 'src/app/models/profile';
import { StaffService } from 'src/app/staff/service/staff.service';
import { State } from '../reducers';

@Injectable()
export class StaffEffects {

    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private store: Store<State>,
        public patientsService: PatientsService,
        public staffService: StaffService,
        private hospitalDepartmentService: HospitalDepartmentService,
    ) { }

    @Effect()
    loadStaff$: Observable<Action> = this.actions$.pipe(
        ofType(
            fromActions.StaffActionsTypes.LoadStaff
        ),
        withLatestFrom(this.store.select(fromStaff.getState)),
        mergeMap(([action, state]: [any, any]) => {
            console.log('state', state)
            // Load /v1/doctors
            return this.staffService
                .getAllMembers()
                .pipe(
                    switchMap((staff_v1: Profile[]) => {

                        // Load /v2/doctors
                        return this
                            .staffService
                            .getAllMembers2()
                            .pipe(
                                mergeMap((staff_v2: any[]) => {
                                    // merge v1 & v2 doctors
                                    const members = staff_v1
                                        .map((x: Profile) => {
                                            return Object.assign(x, staff_v2.find(y =>
                                                y.id === x.remote_id
                                            ));
                                        });
                                    return [
                                        new fromActions.LoadStaffSuccess(members),
                                        new fromActions.SelectStaffList(),
                                    ]
                                })
                            );

                    }),
                    catchError(err => of(new fromActions.Error(err)))
                );
        })
    );

    // this.staffS.getAllMembers().subscribe((_members: Profile[]) => {
    //     this.staffS.getAllMembers2().subscribe((_members2: Profile[]) => {
    //         this.members = _members.map((x: Profile) => {
    //             return Object.assign(x, _members2.find(y =>
    //                 y.id === x.remote_id
    //             ));
    //         });

    //         this.store.dispatch(new GetMembers(this.members));
    //     }, err => {
    //         this.notify.notifyError(err);
    //     });
    // }, err => {
    //     this.notify.notifyError(err);
    // });

    @Effect()
    loadStaffList: Observable<Action> = this.actions$.pipe(
        ofType(
            fromActions.StaffActionsTypes.LoadStaffList,
        ),
        mergeMap(action => {
            return this.staffService
                .getStaffList()
                .pipe(
                    switchMap((list: any) => {
                        return [
                            new fromActions.LoadStaffListSuccess(list),
                            new fromActions.LoadDepartments(),
                        ];
                    }),
                    catchError(err => of(new fromActions.Error(err)))
                );
        })
    );

    @Effect()
    loadDepartments: Observable<Action> = this.actions$.pipe(
        ofType(
            fromActions.StaffActionsTypes.LoadDepartments,
        ),
        mergeMap(action => {
            return this.hospitalDepartmentService
                .getDepartments()
                .pipe(
                    switchMap((departments: any[]) => {
                        return [
                            new fromActions.LoadDepartmentsSuccess(departments),
                            new fromActions.LoadStaff()
                        ];
                    }),
                    catchError(err => of(new fromActions.Error(err)))
                );
        })
    );
}

// this.staffService.getStaffList().subscribe((_staffLists: StaffList[]) => {
//     console.log('_staffLists', _staffLists)

//     if (this.checkedTitle === 'Pended Users' && _staffLists) {
//         this.onChooseData({
//             participants: _staffLists[_staffLists.length - 1]['default']['pended_users']['participants'],
//             qty: _staffLists[_staffLists.length - 1]['default']['pended_users']['participants'].length,
//             title: 'Pended Users'
//         });
//     }

//     this.store.dispatch(new GetStaffLists(_staffLists));
//     this.spinner = false;
// }, err => {
//     this.spinner = false;
//     this.notify.notifyError(err);
// });
