import {
    HOME_PATIENTS_ACTION,
    HOME_PATIENT_ACTION,
    HomePatientAction,
    HomePatientsAction,
    NESTED_COLUMNS_ACTION,
    NestedColumnsAction
} from './home.actions';

import { DataColumn } from '../../models/data-columns';
import { MyPatient } from '../../models/my-patients';
import { Patient } from '../../models/patient';
import { PatientPage } from '../../models/patient-page';
import { orderBy } from 'lodash';

const homePatientsInitialState = {
    selectedPatient: null, // MyPatient
    selectedFolder: null, // DataColumn
    selectedSubFolder: null, // DataColumn
    patientPage: null, // PatientPage
    myPatients: [],
    updates: {},
    patientBaseList: []
};

export function homePatientsReducer(state = homePatientsInitialState, action: HomePatientsAction) {

    switch (action.type) {

        case HOME_PATIENTS_ACTION.HOME_REFRESH:
            return {
                ...state,
            };
        case HOME_PATIENTS_ACTION.PATIENT_BASE_LIST:
            state.selectedFolder = null;
            state.selectedPatient = null;
            state.patientPage = null;
            return {
                ...state,
                patientBaseList: { ...action.payload }
            };
        case HOME_PATIENTS_ACTION.SELECTED_PATIENT:
            return {
                ...state,
                selectedPatient: { ...action.payload }
            };
        case HOME_PATIENTS_ACTION.SELECTED_PROVIDER:
            state.selectedFolder = null;
            return {
                ...state,
                selectedProvider: { ...action.payload }
            };
        case HOME_PATIENTS_ACTION.SELECTED_FOLDER:
            return {
                ...state,
                selectedFolder: action.payload ? { ...action.payload } : null,
                selectedSubFolder: null, // reset sub folder selection
                hideFolders: false
            };
        case HOME_PATIENTS_ACTION.SELECTED_SUB_FOLDER:
            return {
                ...state,
                selectedSubFolder: action.payload ? { ...action.payload } : null
            };
        case HOME_PATIENTS_ACTION.HOME_HIDE_PATIENT_FOLDERS:
            return {
                ...state,
                hideFolders: action.payload
            };
        case HOME_PATIENTS_ACTION.HOME_PATIENT_FOLDERS:
            return {
                ...state,
                patientFolders: [ ...action.payload ]
            };
        case HOME_PATIENTS_ACTION.HOME_PATIENT_PROVIDERS:
            return {
                ...state,
                patientProviders: [ ...action.payload ]
            };
        case HOME_PATIENTS_ACTION.MY_PATIENTS:
            return {
                ...state,
                myPatients: [ ...action.payload ]
            };

        case HOME_PATIENTS_ACTION.SET_PATIENT_PAGE:
            return {
                ...state,
                patientPage: { ...action.payload }
            };
        case HOME_PATIENTS_ACTION.UPDATE_MY_PATIENT:
            state.myPatients.forEach((item: MyPatient) => {
                if (item.id === action.payload.id) {
                    item = { ...action.payload };
                }
            });
            return {
                ...state,
                myPatients: [ ...state.myPatients ]
            };
        case HOME_PATIENTS_ACTION.UPDATES:
            return {
                ...state,
                updates: [ ...action.payload ]
            };
        case HOME_PATIENTS_ACTION.HOME_MARK_ALL_AS_SEEN:
            return {
                ...state,
                updates: [ ...action.payload ]
            };
        default:
            return state;
    }
}

// const homePatientUpdatesInitialState = {
//     seenExcludeList: []
// }

// export function homePatientUpdatesReducer(state = homePatientUpdatesInitialState, action: HomePatientUpdatesAction) {
//     switch (action.type) {

//         case HOME_PATIENT_UPDATES_ACTION.SEEN_EXCLUDE_LIST:
//             return {
//                 ...state,
//                 seenExcludeList: [...action.payload]
//             };
//     }
// }

/* TODO: OBSOLETE: Cleanup  */

const initialState = {
    columns: []
};

export function nestedColumnsReducer(state = initialState, action: NestedColumnsAction) {

    switch (action.type) {

        case NESTED_COLUMNS_ACTION.GET_COLUMNS:
            state.columns = orderBy(action.payload, 'order', ['asc']);
            return {
                ...state,
                columns: [
                    ...state.columns
                ]
            };

        case NESTED_COLUMNS_ACTION.COPY_COLUMN:
            const groupIndex = state.columns.findIndex(e => e.group_id === action.payload.group_id);
            const groupLength = state.columns.filter(e => e.group_id === action.payload.group_id).length;
            state.columns.splice(groupIndex + groupLength, 0, action.payload);
            state.columns.forEach(item => {
                if (item.group_id === action.payload.group_id) {
                    item.authors_in_group.push(Number(localStorage.getItem('idrUserId')));
                }
            });
            return {
                ...state,
                columns: [...state.columns]
            };

        case NESTED_COLUMNS_ACTION.UPDATE_COLUMN:
            const columns = state.columns.filter(e => e.id !== action.payload.id);
            const updatedColumnIndex = state.columns.findIndex(e => e.id === action.payload.id);
            const initCells = state.columns[updatedColumnIndex].cells;
            columns.splice(updatedColumnIndex, 0, Object.assign(action.payload, {cells: initCells}));
            state.columns = columns.filter(e => !e.is_hidden);
            return {
                ...state,
                columns: [...state.columns]
            };

        case NESTED_COLUMNS_ACTION.HIDE_COLUMN:
            state.columns = state.columns.filter(e => e.id !== action.payload);
            return {
                ...state,
                columns: [...state.columns]
            };

        case NESTED_COLUMNS_ACTION.CREATE_CELL:
            state.columns.forEach(column => {
                if (column.group_id === action.payload.column_group_id) {
                    column.cells.push(action.payload);
                }
            });
            return {
                ...state,
                columns: [...state.columns]
            };

        case NESTED_COLUMNS_ACTION.EDIT_CELL:
            state.columns.forEach(column => {

                if (column.group_id === action.payload.column_group_id) {
                    const updatedCellIndex = column.cells.findIndex(cell => cell.id === action.payload.id);
                    column.cells.splice(updatedCellIndex, 1, action.payload);
                }
            });
            return {
                ...state,
                columns: [...state.columns]
            };

        case NESTED_COLUMNS_ACTION.CREATE_COLUMN_FROM_SOCKET:
            const newColumns = action.payload[1];
            newColumns.forEach(column => column.cells = [action.payload[0]]);
            state.columns.push(...newColumns);
            return {
                ...state,
                columns: [...state.columns]
            };

        case NESTED_COLUMNS_ACTION.UPDATE_CHAT_FROM_SOCKET:
            const chat_history = action.payload;
            state.columns.forEach(column => {
                column.cells.forEach(cell => {
                    if (!!cell && cell.chat && cell.chat.id === chat_history.id) {
                        cell.chat = chat_history;
                    }
                });
            });
            return {
                ...state,
                columns: [...state.columns]
            };
        case NESTED_COLUMNS_ACTION.CHANGE_CHATS_READ_STATUS:
            const chat = action.payload;
            state.columns.forEach(column => {
                column.cells.forEach(cell => {
                    if (!!cell && cell.chat && cell.chat.id === chat.id) {
                        cell.chat.count_of_unread_messages = 0;
                        cell.chat.top_urgency = 5;
                    }
                });
            });
            return {
                ...state,
                columns: [...state.columns]
            };
        default:
            return state;
    }
}


const homePatientInitialState = {
    homePatients: []
};

export function homePatientReducer(state = homePatientInitialState, action: HomePatientAction) {

    switch (action.type) {

        case HOME_PATIENT_ACTION.GET_HOME_PATIENTS:
            return {
                ...state,
                homePatients: [
                    ...action.payload
                ]
            };

        case HOME_PATIENT_ACTION.UPDATE_HOME_PATIENT:
            const updatedPatientIndex = state.homePatients.findIndex(patient => patient.id === action.payload.id);
            state.homePatients.splice(updatedPatientIndex, 1, action.payload);

            return {
                ...state,
                homePatients: [...state.homePatients]
            };

        default:
            return state;
    }
}
