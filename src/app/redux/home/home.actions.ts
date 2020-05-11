import {Chat, HistoryForSockets} from '../../models/chat';
import {HomePatient, NestedColumn, NestedHomeCell} from '../../models/home';

import {Action} from '@ngrx/store';
import { DataColumn } from '../../models/data-columns';
import { MyPatient } from '../../models/my-patients';
import { Pages } from '../../models/pages';
import { Patient } from '../../models/patient';
import { PatientBase } from 'src/app/models/patient-base';
import { PatientFolder } from 'src/app/models/patient-folder';
import { PatientPage } from '../../models/patient-page';
import { UpdateFolderSummary } from 'src/app/models/patient-folder-summary';

export namespace HOME_PATIENTS_ACTION {
    export const MY_PATIENTS = 'GET_MY_PATIENTS';
    export const SELECTED_PATIENT = 'SELECTED_PATIENT';
    export const SELECTED_PROVIDER = 'SELECTED_PROVIDER';
    export const SELECTED_FOLDER = 'SELECTED_FOLDER';
    export const SELECTED_SUB_FOLDER = 'SELECTED_SUB_FOLDER';
    export const SET_PATIENT_PAGE = 'SET_PATIENT_PAGE';
    export const UPDATE_MY_PATIENT = 'UPDATE_MY_PATIENT';
    export const UPDATES = 'UPDATES';
    export const PATIENT_BASE_LIST = 'PATIENT_BASE_LIST';
    export const HOME_REFRESH = 'HOME_REFRESH';
    export const HOME_HIDE_PATIENT_FOLDERS = 'HOME_HIDE_FOLDERS_VIEW';
    export const HOME_PATIENT_FOLDERS = 'HOME_PATIENT_FOLDERS';
    export const HOME_PATIENT_PROVIDERS = 'HOME_PATIENT_PROVIDERS';
    export const HOME_MARK_ALL_AS_SEEN = 'HOME_MARK_ALL_AS_SEEN';
}

export class HomeRefresh implements Action {
    readonly type = HOME_PATIENTS_ACTION.HOME_REFRESH;
    constructor(public payload: any) {}
}

export class MyPatients implements Action {
    readonly type = HOME_PATIENTS_ACTION.MY_PATIENTS;
    constructor(public payload: MyPatient[]) {}
}

export class SelectedPatient implements Action {
    readonly type = HOME_PATIENTS_ACTION.SELECTED_PATIENT;
    constructor(public payload: PatientBase) {}
}

export class SelectedProvider implements Action {
    readonly type = HOME_PATIENTS_ACTION.SELECTED_PROVIDER;
    constructor(public payload: any) {}
}

export class SelectedFolder implements Action {
    readonly type = HOME_PATIENTS_ACTION.SELECTED_FOLDER;
    constructor(public payload: UpdateFolderSummary) {}
}

export class SelectedSubFolder implements Action {
    readonly type = HOME_PATIENTS_ACTION.SELECTED_SUB_FOLDER;
    constructor(public payload: UpdateFolderSummary) {}
}

export class HomeHidePatientFolders implements Action {
    readonly type = HOME_PATIENTS_ACTION.HOME_HIDE_PATIENT_FOLDERS;
    constructor(public payload: boolean) {}
}

export class HomePatientFolders implements Action {
    readonly type = HOME_PATIENTS_ACTION.HOME_PATIENT_FOLDERS;
    constructor(public payload: any) {}
}

export class HomePatientProviders implements Action {
    readonly type = HOME_PATIENTS_ACTION.HOME_PATIENT_PROVIDERS;
    constructor(public payload: any) {}
}

export class HomeMarkAllAsSeen implements Action {
    readonly type = HOME_PATIENTS_ACTION.HOME_MARK_ALL_AS_SEEN;
    constructor(public payload: any) {}
}

export class SetPatientPage implements Action {
    readonly type = HOME_PATIENTS_ACTION.SET_PATIENT_PAGE;
    constructor(public payload: PatientPage) {}
}

export class UpdateMyPatient implements Action {
    readonly type = HOME_PATIENTS_ACTION.UPDATE_MY_PATIENT;
    constructor(public payload: MyPatient) {}
}

// TODO: Define Update model once provided by backend
export class Updates implements Action {
    readonly type = HOME_PATIENTS_ACTION.UPDATES;
    constructor(public payload: any[]) {}
}

export class PatientBaseList implements Action {
    readonly type = HOME_PATIENTS_ACTION.PATIENT_BASE_LIST;
    constructor(public payload: PatientBase[]) { }
}

export type HomePatientsAction =
    SelectedPatient |
    MyPatients |
    UpdateMyPatient |
    SelectedFolder |
    SetPatientPage |
    SelectedSubFolder |
    Updates |
    PatientBaseList |
    HomeRefresh |
    HomeHidePatientFolders |
    HomePatientFolders |
    HomePatientProviders |
    SelectedProvider |
    HomeMarkAllAsSeen;


/* Patient Updates */

// export namespace HOME_PATIENT_UPDATES_ACTION {
//     export const SEEN_EXCLUDE_LIST = 'SEEN_EXCLUDE_LIST';
// }

// export class SeenExcludeList implements Action {
//     readonly type = HOME_PATIENT_UPDATES_ACTION.SEEN_EXCLUDE_LIST;
//     constructor(public payload: any) { }
// }

// export type HomePatientUpdatesAction =
//     SeenExcludeList;



/* TODO: OBSOLETE: Clean up */

export namespace NESTED_COLUMNS_ACTION {
    export const GET_COLUMNS = 'GET_COLUMNS';
    export const COPY_COLUMN = 'COPY_COLUMN';
    export const UPDATE_COLUMN = 'UPDATE_COLUMN';
    export const HIDE_COLUMN = 'HIDE_COLUMN';
    export const CREATE_CELL = 'CREATE_CELL';
    export const EDIT_CELL = 'EDIT_CELL';
    export const CREATE_COLUMN_FROM_SOCKET = 'CREATE_COLUMN_FROM_SOCKET';
    export const UPDATE_CHAT_FROM_SOCKET = 'UPDATE_CHAT_FROM_SOCKET';
    export const CHANGE_CHATS_READ_STATUS = 'CHANGE_CHATS_READ_STATUS';
}

export class GetNestedColumns implements Action {
    readonly type = NESTED_COLUMNS_ACTION.GET_COLUMNS;

    constructor(public payload: NestedColumn[]) {
    }
}

export class CopyNestedColumn implements Action {
    readonly type = NESTED_COLUMNS_ACTION.COPY_COLUMN;

    constructor(public payload: NestedColumn) {
    }
}

export class UpdateNestedColumn implements Action {
    readonly type = NESTED_COLUMNS_ACTION.UPDATE_COLUMN;

    constructor(public payload: NestedColumn) {
    }
}

export class HideNestedColumn implements Action {
    readonly type = NESTED_COLUMNS_ACTION.HIDE_COLUMN;

    constructor(public payload) {
    }
}

export class CreateCell implements Action {
    readonly type = NESTED_COLUMNS_ACTION.CREATE_CELL;

    constructor(public payload: NestedHomeCell) {
    }
}

export class EditNestedCell implements Action {
    readonly type = NESTED_COLUMNS_ACTION.EDIT_CELL;

    constructor(public payload: NestedHomeCell) {
    }
}

export class CreateColumnFromSocket implements Action {
    readonly type = NESTED_COLUMNS_ACTION.CREATE_COLUMN_FROM_SOCKET;

    constructor(public payload: [NestedHomeCell, NestedColumn[]]) {
    }
}

export class UpdateChatFromSocket implements Action {
    readonly type = NESTED_COLUMNS_ACTION.UPDATE_CHAT_FROM_SOCKET;

    constructor(public payload: HistoryForSockets) {
    }
}

export class ChangeChatsReadStatus implements Action {
    readonly type = NESTED_COLUMNS_ACTION.CHANGE_CHATS_READ_STATUS;

    constructor(public payload) {
    }
}

export type NestedColumnsAction = GetNestedColumns | CopyNestedColumn | UpdateNestedColumn | HideNestedColumn |
    CreateCell | EditNestedCell | CreateColumnFromSocket | UpdateChatFromSocket | ChangeChatsReadStatus;


export namespace HOME_PATIENT_ACTION {
    export const GET_HOME_PATIENTS = 'GET_HOME_PATIENTS';
    export const UPDATE_HOME_PATIENT = 'UPDATE_HOME_PATIENT';
}

export class GetHomePatients implements Action {
    readonly type = HOME_PATIENT_ACTION.GET_HOME_PATIENTS;

    constructor(public payload: HomePatient[]) {
    }
}

export class UpdateHomePatient implements Action {
    readonly type = HOME_PATIENT_ACTION.UPDATE_HOME_PATIENT;

    constructor(public payload: HomePatient) {
    }
}

export type HomePatientAction = GetHomePatients | UpdateHomePatient;
