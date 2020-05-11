import * as fromStaff from './staff.reducer';

import { ActionReducerMap } from '@ngrx/store';
import { InjectionToken } from '@angular/core';

export interface State {
    staff: fromStaff.StaffState;
}

export const STAFF_REDUCER_TOKEN =
    new InjectionToken<ActionReducerMap<State>>('Staff Reducers');

export function getReducers(): ActionReducerMap<State> {
    return {
        staff: fromStaff.StaffReducer
    };
}
