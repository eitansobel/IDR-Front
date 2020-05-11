import { Action } from '@ngrx/store';
import { Chat } from 'src/app/models/chat';
import { MessageDialogData } from '../../models/message-dialog-data';
import { Patient } from 'src/app/models/patient';
import { Profile } from 'src/app/models/profile';

export enum MessageActionsTypes {
    MessageDialog = '[MESSAGE] Message dialog',
    MessageDialogResult = '[MESSAGE] Message dialog result',
    MessageDialogClose = '[MESSAGE] Message dialog close',

    LoadChats = '[MESSAGE] Load chats',
    LoadChatsSuccess = '[MESSAGE] Load chats success',

    LoadMessages = '[MESSAGE] Load messages',
    LoadMessagesSuccess = '[MESSAGE] Load messages success',

    PatientSearchDialog = '[MESSAGE] Patient search dialog',
    PatientSearchDialogResult = '[MESSAGE] Patient search result',
    PatientSearchDialogClose = '[MESSAGE] Patient search close',

    ProviderSearchDialog = '[MESSAGE] Provider search dialog',
    ProviderSearchDialogResult = '[MESSAGE] Provider search result',
    ProviderSearchDialogClose = '[MESSAGE] Provider search close',

    LoadProviders = '[MESSAGE] Load providers',
    LoadProvidersSuccess = '[MESSAGE] Load providers success',

    LoadPatients = '[MESSAGE] Load patients',
    LoadPatientsSuccess = '[MESSAGE] Load patients success',

    Error = '[MESSAGE] Error',
    ResetStore = '[MESSAGE] Reset store',

    Refresh = '[MESSAGE] Refresh'
}

export class MessageDialog implements Action {
    readonly type = MessageActionsTypes.MessageDialog;
    constructor(public payload: MessageDialogData) {}
}

export class MessageDialogResult implements Action {
    readonly type = MessageActionsTypes.MessageDialogResult;
    constructor(public payload: any) {}
}

export class MessageDialogClose implements Action {
    readonly type = MessageActionsTypes.MessageDialogClose;
}


export class LoadChats implements Action {
    readonly type = MessageActionsTypes.LoadChats;
}


export class LoadChatsSuccess implements Action {
    readonly type = MessageActionsTypes.LoadChatsSuccess;
    constructor(public payload: any[]) {}
}

export class LoadMessages implements Action {
    readonly type = MessageActionsTypes.LoadMessages;
    constructor(public payload: Chat) {}
}
export class LoadMessagesSuccess implements Action {
    readonly type = MessageActionsTypes.LoadMessagesSuccess;
    constructor(public payload: any[]) {}
}

export class PatientSearchDialog implements Action {
    readonly type = MessageActionsTypes.PatientSearchDialog;
    constructor(public payload: any) {}
}

export class PatientSearchDialogResult implements Action {
    readonly type = MessageActionsTypes.PatientSearchDialogResult;
    constructor(public payload: Patient) {}
}

export class PatientSearchDialogClose implements Action {
    readonly type = MessageActionsTypes.PatientSearchDialogClose;
}


export class ProviderSearchDialog implements Action {
    readonly type = MessageActionsTypes.ProviderSearchDialog;
    constructor(public payload: any) {}
}

export class ProviderSearchDialogResult implements Action {
    readonly type = MessageActionsTypes.ProviderSearchDialogResult;
    constructor(public payload: Profile) {}
}

export class ProviderSearchDialogClose implements Action {
    readonly type = MessageActionsTypes.ProviderSearchDialogClose;
}

export class LoadPatients implements Action {
    readonly type = MessageActionsTypes.LoadPatients;
    constructor() {}
}

export class LoadPatientsSuccess implements Action {
    readonly type = MessageActionsTypes.LoadPatientsSuccess;
    constructor(public payload: Patient[]) {}
}


export class LoadProviders implements Action {
    readonly type = MessageActionsTypes.LoadPatients;
    constructor() {}
}

export class LoadProvidersSuccess implements Action {
    readonly type = MessageActionsTypes.LoadProvidersSuccess;
    constructor(public payload: Profile[]) {}
}

export class Refresh implements Action {
    readonly type = MessageActionsTypes.Refresh;
    constructor() {}
}

export class Error implements Action {
    readonly type = MessageActionsTypes.Error;
    constructor(public payload: any) {}
}

export class ResetStore implements Action {
    readonly type = MessageActionsTypes.ResetStore;
    constructor() {}
}

export type MessageActions =
    MessageDialog |
    MessageDialogResult |
    MessageDialogClose |
    LoadChats |
    LoadChatsSuccess |
    LoadMessages |
    LoadMessagesSuccess |
    PatientSearchDialog |
    PatientSearchDialogResult |
    PatientSearchDialogClose |
    ProviderSearchDialog |
    ProviderSearchDialogResult |
    ProviderSearchDialogClose |
    LoadPatients |
    LoadPatientsSuccess |
    LoadProviders |
    LoadProvidersSuccess |
    Refresh |
    Error |
    ResetStore;
