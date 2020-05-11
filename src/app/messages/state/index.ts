import { createFeatureSelector, createSelector } from '@ngrx/store';

import { State } from './reducers';

const getMessagesState = createFeatureSelector<State>('message');

export const getState = createSelector(
    getMessagesState,
    state => state.message
);

export const getMessages = createSelector(
    getMessagesState,
    state => state.message.messages
);

export const getChats = createSelector(
    getMessagesState,
    state => state.message.chats
);

export const getPatients = createSelector(
    getMessagesState,
    state => state.message.patients
);

export const getProviders = createSelector(
    getMessagesState,
    state => state.message.providers
);

export const getSelectedProvider = createSelector(
    getMessagesState,
    state => state.message.selectedProvider
);

export const getSelectedPatient = createSelector(
    getMessagesState,
    state => state.message.selectedPatient
);
