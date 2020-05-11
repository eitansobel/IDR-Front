import * as fromMessage from './message.reducer';

import { ActionReducer, ActionReducerMap, combineReducers, compose } from '@ngrx/store';

import { InjectionToken } from '@angular/core';

export interface State {
    message: fromMessage.MessageState;
}

export const MESSAGE_REDUCER_TOKEN =
    new InjectionToken<ActionReducerMap<State>>('Message Reducers');

export function getReducers(): ActionReducerMap<State> {
    // map of reducers
    return {
        message: fromMessage.MessageReducer,
    };
}
