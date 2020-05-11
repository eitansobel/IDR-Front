import { Action } from '@ngrx/store';
import { MessageDialogData } from 'src/app/messages/models/message-dialog-data';
import { PatientBase } from 'src/app/models/patient-base';
import { PatientPage } from 'src/app/models/patient-page';
import { Sort } from 'src/app/models/sort';

export enum HomeActionsTypes {
    HidePatient = '[HOME] Hide patient',
    HidePatientSuccess = '[HOME] Hide patient success',

    AddSeenExcludeList = '[HOME] Seen exclude list',

    SetUpdateSeen = '[HOME] Set update seen',
    SetUpdateSeenSuccess = '[HOME] Set update seen success',
    SetAllUpdatesSeen = '[HOME] Set all updates seen',
    SetAllUpdatesSeenSuccess = '[HOME] Set all updates seen success',

    Load = '[Home] Load',

    LoadPatients = '[HOME] Load my patients',
    LoadPatientsSuccess = '[HOME] Load my patients success',
    LoadPatientsFail = '[HOME] Load my patients fail',

    LoadAllPatients = '[HOME] Load all patients',
    LoadAllPatientsSuccess = '[HOME] Load all patients success',

    SortPatients = '[HOME] Sort patients',

    SelectPatient = '[HOME] Select patient',
    SelectFolder = '[HOME] Select folder',
    SelectSubFolder = '[HOME] Select sub-folder',
    SelectPage = '[HOME] Select patient page',
    SelectProvider = '[HOME] Select provider',

    HideFolders = '[Home] Hide patient folders',

    GetPatientUpdates = '[HOME] Get patient updates',
    CreatePatientUpdate = '[HOME] Create patient updates',

    LoadProviders = '[HOME] Load providers',
    LoadProvidersSuccess = '[HOME] Load providers success',

    LoadUpdateFolders = '[HOME] Load update folders',
    LoadUpdateFoldersSuccess = '[HOME] Load update folders success',

    LoadUpdates = '[HOME] Load updates',
    LoadUpdatesSuccess = '[HOME] Load updates success',

    SetUpdates = '[HOME] Set updates for selected patient',

    Refresh = '[HOME] Refresh',

    MessageDialog = '[HOME] Message dialog',
    MessageDialogResult = '[HOME] Message dialog result',
    MessageDialogClose = '[HOME] Message dialog close',

    LoadMessages = '[HOME] Load messages',
    LoadMessagesSuccess = '[HOME] Load messages success',

    ResetStore = '[HOME] Reset store',

    Error = '[HOME] Error'
}

export class LoadMessages implements Action {
    readonly type = HomeActionsTypes.LoadMessages;
    constructor() {}
}
export class LoadMessagesSuccess implements Action {
    readonly type = HomeActionsTypes.LoadMessagesSuccess;
    constructor(public payload: any[]) {}
}

export class SortPatients implements Action {
    readonly type = HomeActionsTypes.SortPatients;
    constructor(public payload: Sort) {}
}

export class HidePatient implements Action {
    readonly type = HomeActionsTypes.HidePatient;
    constructor(public payload: number, public visibility = false) {}
}

export class HidePatientSuccess implements Action {
    readonly type = HomeActionsTypes.HidePatientSuccess;
    constructor(public payload: PatientBase) {}
}


export class AddSeenExcludeListAction implements Action {
    readonly type = HomeActionsTypes.AddSeenExcludeList;
    constructor(public payload: any) {}
}

export class SetUpdateSeen implements Action {
    readonly type = HomeActionsTypes.SetUpdateSeen;
    constructor(public payload: any) { }
}

export class SetUpdateSeenSuccess implements Action {
    readonly type = HomeActionsTypes.SetUpdateSeenSuccess;
    constructor(public payload: any) { }
}

export class SetAllUpdatesSeen implements Action {
    readonly type = HomeActionsTypes.SetAllUpdatesSeen;
    constructor(public payload: number) { }
}

export class SetAllUpdatesSeenSuccess implements Action {
    readonly type = HomeActionsTypes.SetAllUpdatesSeenSuccess;
    constructor() { }
}



export class Load implements Action {
    readonly type = HomeActionsTypes.Load;
    constructor() { }
}


export class SelectPatient implements Action {
    readonly type = HomeActionsTypes.SelectPatient;
    constructor(public payload: PatientBase) {}
}

export class LoadPatients implements Action {
    readonly type = HomeActionsTypes.LoadPatients;
    constructor() { }
}

export class LoadPatientsSuccess implements Action {
    readonly type = HomeActionsTypes.LoadPatientsSuccess;
    constructor(public payload: any[]) { }
}

export class LoadPatientsFail implements Action {
    readonly type = HomeActionsTypes.LoadPatientsFail;
    constructor(public payload: string) { }
}

export class LoadAllPatients implements Action {
    readonly type = HomeActionsTypes.LoadAllPatients;
    constructor() { }
}

export class LoadAllPatientsSuccess implements Action {
    readonly type = HomeActionsTypes.LoadAllPatientsSuccess;
    constructor(public payload: any[]) { }
}

export class SelectFolder implements Action {
    readonly type = HomeActionsTypes.SelectFolder;
    constructor(public payload: any) {}
}

export class SelectSubFolder implements Action {
    readonly type = HomeActionsTypes.SelectSubFolder;
    constructor(public payload: any) {}
}

export class SelectPage implements Action {
    readonly type = HomeActionsTypes.SelectPage;
    constructor(public payload: PatientPage) {}
}

export class HideFolders implements Action {
    readonly type = HomeActionsTypes.HideFolders;
    constructor(public payload: boolean) {}
}


export class LoadUpdateFolders implements Action {
    readonly type = HomeActionsTypes.LoadUpdateFolders;
    constructor() {}
}

export class LoadUpdateFoldersSuccess implements Action {
    readonly type = HomeActionsTypes.LoadUpdateFoldersSuccess;
    constructor(public payload: any[]) {}
}


export class LoadUpdates implements Action {
    readonly type = HomeActionsTypes.LoadUpdates;
    constructor() {}
}

export class LoadUpdatesSuccess implements Action {
    readonly type = HomeActionsTypes.LoadUpdatesSuccess;
    constructor(public payload: any[]) {}
}


export class CreatePatientUpdate implements Action {
    readonly type = HomeActionsTypes.CreatePatientUpdate;
    constructor(public payload: string) { }
}

export class SelectProvider implements Action {
    readonly type = HomeActionsTypes.SelectProvider;
    constructor(public payload: any) {}
}

export class LoadProviders implements Action {
    readonly type = HomeActionsTypes.LoadProviders;
    constructor() {}
}

export class LoadProvidersSuccess implements Action {
    readonly type = HomeActionsTypes.LoadProvidersSuccess;
    constructor(public payload: any[]) {}
}

export class SetUpdates implements Action {
    readonly type = HomeActionsTypes.SetUpdates;
    constructor(public payload: any) {}
}

export class Refresh implements Action {
    readonly type = HomeActionsTypes.Refresh;
    constructor() {}
}

export class MessageDialog implements Action {
    readonly type = HomeActionsTypes.MessageDialog;
    constructor(public payload: MessageDialogData) {}
}

export class MessageDialogResult implements Action {
    readonly type = HomeActionsTypes.MessageDialogResult;
    constructor(public payload: any) {}
}

export class MessageDialogClose implements Action {
    readonly type = HomeActionsTypes.MessageDialogClose;
}

export class ResetStore implements Action {
    readonly type = HomeActionsTypes.ResetStore;
    constructor() {}
}

export class Error implements Action {
    readonly type = HomeActionsTypes.Error;
    constructor(public payload: string) { }
}


// export class SeenExcludeList implements Action {
//     readonly type = HOME_PATIENT_UPDATES_ACTION.SEEN_EXCLUDE_LIST;
//     constructor(public payload: any) { }
// }

// export type HomePatientUpdatesAction =
//     SeenExcludeList;

export type HomeActions =
    SortPatients |
    HidePatient |
    HidePatientSuccess |
    AddSeenExcludeListAction |
    SetUpdateSeen |
    SetUpdateSeenSuccess |
    SetAllUpdatesSeen |
    SetAllUpdatesSeenSuccess |
    LoadPatients |
    LoadPatientsSuccess |
    LoadPatientsFail |
    LoadAllPatients |
    LoadAllPatientsSuccess |
    LoadUpdateFolders |
    LoadUpdateFoldersSuccess |
    LoadProviders |
    LoadProvidersSuccess |
    SelectPatient |
    SelectFolder |
    SelectSubFolder |
    SelectPage |
    HideFolders |
    SelectProvider |
    SetUpdates |
    Refresh |
    ResetStore |
    MessageDialog |
    MessageDialogResult |
    MessageDialogClose |
    LoadMessages |
    LoadMessagesSuccess |
    Error;
