import { Action } from '@ngrx/store';
import { Chat } from 'src/app/models/chat';
import { Patient } from 'src/app/models/patient';
import { PatientBase } from 'src/app/models/patient-base';
import { Profile } from 'src/app/models/profile';

export enum PatientsActionsTypes {
    MessageDialog = '[PATIENTS] Message dialog',
    MessageDialogResult = '[PATIENTS] Message dialog result',
    MessageDialogClose = '[PATIENTS] Message dialog close',

    PatientSearchDialog = '[PATIENTS] Patient search dialog',
    PatientSearchDialogResult = '[PATIENTS] Patient search result',
    PatientSearchDialogClose = '[PATIENTS] Patient search close',

    ProviderSearchDialog = '[PATIENTS] Provider search dialog',
    ProviderSearchDialogResult = '[PATIENTS] Provider search result',
    ProviderSearchDialogClose = '[PATIENTS] Provider search close',

    LoadProviders = '[PATIENTS] Load providers',
    LoadProvidersSuccess = '[PATIENTS] Load providers success',

    LoadPatients = '[PATIENTS] Load patients',
    LoadPatientsSuccess = '[PATIENTS] Load patients success',

    LoadPatientsList = '[PATIENTS] Load patiens list',
    LoadPatientsListSuccess = '[PATIENTS] Load patiens list success',

    Error = '[PATIENTS] Error',
    ResetStore = '[PATIENTS] Reset store',

    HidePatient = '[PATIENTS] Hide Patient',
    HidePatientSuccess = '[PATIENTS] Hide Patient Success',

    Refresh = '[PATIENTS] Refresh'
}

export class MessageDialog implements Action {
    readonly type = PatientsActionsTypes.MessageDialog;
    constructor(public payload: any) {}
}

export class MessageDialogResult implements Action {
    readonly type = PatientsActionsTypes.MessageDialogResult;
    constructor(public payload: any) {}
}

export class MessageDialogClose implements Action {
    readonly type = PatientsActionsTypes.MessageDialogClose;
}

export class PatientSearchDialog implements Action {
    readonly type = PatientsActionsTypes.PatientSearchDialog;
    constructor(public payload: any) {}
}

export class PatientSearchDialogResult implements Action {
    readonly type = PatientsActionsTypes.PatientSearchDialogResult;
    constructor(public payload: Patient) {}
}

export class PatientSearchDialogClose implements Action {
    readonly type = PatientsActionsTypes.PatientSearchDialogClose;
}


export class ProviderSearchDialog implements Action {
    readonly type = PatientsActionsTypes.ProviderSearchDialog;
    constructor(public payload: any) {}
}

export class ProviderSearchDialogResult implements Action {
    readonly type = PatientsActionsTypes.ProviderSearchDialogResult;
    constructor(public payload: Profile) {}
}

export class ProviderSearchDialogClose implements Action {
    readonly type = PatientsActionsTypes.ProviderSearchDialogClose;
}

export class LoadPatients implements Action {
    readonly type = PatientsActionsTypes.LoadPatients;
    constructor() {}
}

export class LoadPatientsSuccess implements Action {
    readonly type = PatientsActionsTypes.LoadPatientsSuccess;
    constructor(public payload: Patient[]) {}
}

export class LoadPatientsList implements Action {
    readonly type = PatientsActionsTypes.LoadPatientsList;
    constructor() {}
}

export class LoadPatientsListSuccess implements Action {
    readonly type = PatientsActionsTypes.LoadPatientsListSuccess;
    constructor(public payload: any[]) {}
}

export class LoadProviders implements Action {
    readonly type = PatientsActionsTypes.LoadPatients;
    constructor() {}
}

export class LoadProvidersSuccess implements Action {
    readonly type = PatientsActionsTypes.LoadProvidersSuccess;
    constructor(public payload: Profile[]) {}
}

export class Refresh implements Action {
    readonly type = PatientsActionsTypes.Refresh;
    constructor() {}
}

export class Error implements Action {
    readonly type = PatientsActionsTypes.Error;
    constructor(public payload: any) {}
}

export class HidePatient implements Action {
    readonly type = PatientsActionsTypes.HidePatient;
    constructor(public payload: number, public visibility = false) {}
}

export class HidePatientSuccess implements Action {
    readonly type = PatientsActionsTypes.HidePatientSuccess;
    constructor(public payload: PatientBase) {}
}

export class ResetStore implements Action {
    readonly type = PatientsActionsTypes.ResetStore;
    constructor() {}
}

export type PatientsActions =
    MessageDialog |
    MessageDialogResult |
    MessageDialogClose |
    PatientSearchDialog |
    PatientSearchDialogResult |
    PatientSearchDialogClose |
    ProviderSearchDialog |
    ProviderSearchDialogResult |
    ProviderSearchDialogClose |
    LoadPatients |
    LoadPatientsSuccess |
    LoadPatientsList |
    LoadPatientsListSuccess |
    LoadProviders |
    LoadProvidersSuccess |
    Refresh |
    Error |
    HidePatient |
    HidePatientSuccess |
    ResetStore;
