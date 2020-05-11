import * as fromHome from './home.reducers';

import { ActionReducer, ActionReducerMap, combineReducers, compose } from '@ngrx/store';

import { InjectionToken } from '@angular/core';

export interface State {
    home: fromHome.HomeState;
}

export const HOME_REDUCER_TOKEN =
    new InjectionToken<ActionReducerMap<State>>('Home Reducers');

export function getReducers(): ActionReducerMap<State> {
    // map of reducers
    return {
        home: fromHome.HomeReducer,
    };
}
