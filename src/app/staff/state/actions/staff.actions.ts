import { Action } from '@ngrx/store';
import { Profile } from 'src/app/models/profile';

export enum StaffActionsTypes {
    LoadStaff = '[STAFF] Load providers',
    LoadStaffSuccess = '[STAFF] Load providers success',

    LoadStaffList = '[STAFF] Load providers list',
    LoadStaffListSuccess = '[STAFF] Load providers list success',

    LoadDepartments = '[STAFF] Load departments',
    LoadDepartmentsSuccess = '[STAFF] Load departments success',

    SelectStaffList = '[STAFF] Select staff list item',

    Refresh = '[STAFF] Refresh',
    Error = '[STAFF] Error',
    ResetStore = '[STAFF] Reset store'
}

export class LoadDepartments implements Action {
    readonly type = StaffActionsTypes.LoadDepartments;
    constructor() {}
}

export class LoadDepartmentsSuccess implements Action {
    readonly type = StaffActionsTypes.LoadDepartmentsSuccess;
    constructor(public payload: any[]) {}
}

export class LoadStaff implements Action {
    readonly type = StaffActionsTypes.LoadStaff;
    constructor() {}
}

export class LoadStaffSuccess implements Action {
    readonly type = StaffActionsTypes.LoadStaffSuccess;
    constructor(public payload: Profile[]) {}
}


export class LoadStaffList implements Action {
    readonly type = StaffActionsTypes.LoadStaffList;
    constructor() {}
}

export class LoadStaffListSuccess implements Action {
    readonly type = StaffActionsTypes.LoadStaffListSuccess;
    constructor(public payload: any[]) {}
}

export class SelectStaffList implements Action {
    readonly type = StaffActionsTypes.SelectStaffList;
    constructor(public payload?: any) {}
}


export class Refresh implements Action {
    readonly type = StaffActionsTypes.Refresh;
    constructor() {}
}

export class Error implements Action {
    readonly type = StaffActionsTypes.Error;
    constructor(public payload: any) {}
}

export class ResetStore implements Action {
    readonly type = StaffActionsTypes.ResetStore;
    constructor() {}
}

export type StaffActions =
    LoadStaff |
    LoadStaffSuccess |
    LoadStaffList |
    LoadStaffListSuccess |
    SelectStaffList |
    Refresh |
    Error |
    ResetStore |
    LoadDepartments |
    LoadDepartmentsSuccess;
