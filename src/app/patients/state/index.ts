import { createFeatureSelector, createSelector } from '@ngrx/store';

import { State } from './reducers';

const getPatientsState = createFeatureSelector<State>('patients');

export const getState = createSelector(
    getPatientsState,
    state => state.patients
);

export const getPatients = createSelector(
    getPatientsState,
    state => state.patients.patients
);

export const getProviders = createSelector(
    getPatientsState,
    state => state.patients.providers
);

export const getSelectedProvider = createSelector(
    getPatientsState,
    state => state.patients.selectedProvider
);

export const getSelectedPatient = createSelector(
    getPatientsState,
    state => state.patients.selectedPatient
);

export const getPatientsList = createSelector(
    getPatientsState,
    state => state.patients.patientsList
);
