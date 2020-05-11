import * as fromPatients from './patients.reducer';

import { ActionReducerMap } from '@ngrx/store';
import { InjectionToken } from '@angular/core';

export interface State {
    patients: fromPatients.PatientsState;
}

export const PATIENTS_REDUCER_TOKEN =
    new InjectionToken<ActionReducerMap<State>>('Patients Reducers');

export function getReducers(): ActionReducerMap<State> {
    return {
        patients: fromPatients.PatientsReducer
    };
}
