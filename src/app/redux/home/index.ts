import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AppState } from '../app.state';

const getHomeState = createFeatureSelector<AppState>('home');

export const sampleAction = createSelector(
    getHomeState
);
