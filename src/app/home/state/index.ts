import { createFeatureSelector, createSelector } from '@ngrx/store';

import { State } from './reducers';

const getHomeState = createFeatureSelector<State>('home');

export const getState = createSelector(
    getHomeState,
    state => state.home
);

export const getPatients = createSelector(
    getHomeState,
    state => state.home.myPatients
);

export const getUpdateFolders = createSelector(
    getHomeState,
    state => state.home.updateFolders
);

export const getPatientFolders = createSelector(
    getHomeState,
    state => state.home.patientFolders
);

export const getHideFolders = createSelector(
    getHomeState,
    state => state.home.hideFolders
);

export const getSelectedFolder = createSelector(
    getHomeState,
    state => state.home.selectedFolder
);

export const getSelectedSubFolder = createSelector(
    getHomeState,
    state => state.home.selectedSubFolder
);

export const getUpdates = createSelector(
    getHomeState,
    state => state.home.updates
);

export const getSelectedPatient = createSelector(
    getHomeState,
    state => state.home.selectedPatient
);

export const getSelectedProvider = createSelector(
    getHomeState,
    state => state.home.selectedProvider
);

export const getProviders = createSelector(
    getHomeState,
    state => state.home.selectedProvider
)

export const getMessages = createSelector(
    getHomeState,
    state => state.home.messages
)

export const getAllPatients = createSelector(
    getHomeState,
    state => state.home.allPatients
)
// TODO: Selector for current doctor patients patient_headers

// TODO: Selector for UpdateFolders on selected patient

// TODO: Selector for Updates on selected UpdateForlder

// TODO:




// export const myPatients = createSelector(
//     getHomeState,
//     state => state.
// )
