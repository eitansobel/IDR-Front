import { createFeatureSelector, createSelector } from '@ngrx/store';

import { State } from './reducers';

const getStaffState = createFeatureSelector<State>('staff');

export const getState = createSelector(
    getStaffState,
    state => state
);

export const staffList = createSelector(
    getStaffState,
    state => state.staff.staffList
);

export const staffTable = createSelector(
    getStaffState,
    state => state.staff.staffTable
);

export const selectedStaffList = createSelector(
    getStaffState,
    state => state.staff.selectedStaffList
);
