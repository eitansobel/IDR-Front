import { HomeActions, HomeActionsTypes } from '../actions/home.actions';

import { Pages } from 'src/app/models/pages';
import { Patient } from 'src/app/models/patient';
import { PatientBase } from 'src/app/models/patient-base';
import { PatientPage } from 'src/app/models/patient-page';
import { Sort } from 'src/app/models/sort';

export interface HomeState {
    seenExcludeList: any[];
    myPatients: PatientBase[];
    selectedPatient: any;
    allPatients: any[];
    updateFolders: any[];
    selectedFolder: any;
    selectedSubFolder: any;
    patientFolders: any[];
    patientPage: PatientPage;
    selectedProvider: any;
    hideFolders: boolean;
    providers: any[];
    patientProviders: any[];
    updates: any[];
    sort: Sort;
    messages: any[];
    error: string;
}

const initialState: HomeState = {
    seenExcludeList: [],
    myPatients: [],
    updateFolders: [],
    patientFolders: [],
    selectedFolder: null,
    selectedSubFolder: null,
    selectedPatient: null,
    allPatients: [],
    selectedProvider: null,
    providers: [],
    patientProviders: [],
    patientPage: null,
    hideFolders: false,
    updates: null,
    sort: null,
    messages: [],
    error: '',
};

export function HomeReducer(state = initialState, action: HomeActions): HomeState {
    switch (action.type) {
        case HomeActionsTypes.HidePatientSuccess: {
            return {
                ...state,
                error: ''
            };
        }
        case HomeActionsTypes.AddSeenExcludeList: {
            const seenExcludeList = !action.payload.seen ?
                [...state.seenExcludeList, action.payload.update.id] :
                [...state.seenExcludeList];
            return {
                ...state,
                seenExcludeList: seenExcludeList,
                error: ''
            };
        }
        case HomeActionsTypes.SetUpdateSeen: {
            // Add update to seen exclusion list if marked as unseen
            // const seenExcludeList = !action.payload.seen ?
            //     [...state.seenExcludeList, action.payload.update.id] :
            //     [...state.seenExcludeList];
            // const seenExcludeList = [...state.seenExcludeList];
            // if (!action.payload.seen) {
            //     seenExcludeList.push(action.payload.update.id);
            // }
            return {
                ...state,
                //seenExcludeList: seenExcludeList,
                error: ''
            };
        }
        case HomeActionsTypes.SetUpdateSeenSuccess: {
            // TODO: Update seen list
            return {
                ...state,
                error: ''
            };
        }
        case HomeActionsTypes.SetAllUpdatesSeen: {
            // Add update to seen exclusion list if marked as unseen
            return {
                ...state,
                error: ''
            };
        }
        case HomeActionsTypes.SetAllUpdatesSeenSuccess: {
            // Add update to seen exclusion list if marked as unseen
            return {
                ...state,
                seenExcludeList: [],
                error: ''
            };
        }

        // patients loaded
        // ? page selected

        // ? folder selected
        // ? sub folder selected
        // updates filtered

        // provider selected
        // updates filtered

        // messages selected
        // messages filtered

        case HomeActionsTypes.LoadPatientsSuccess: {
            let patient = null;
            if (state.patientPage) {
                patient = action.payload.find(p => p.id === state.patientPage.patient.id);
            }
            return {
                ...state,
                selectedPatient: { ...patient },
                myPatients: [...action.payload],
                error: ''
            };
        }
        case HomeActionsTypes.LoadPatientsFail: {
            // Add update to seen exclusion list if marked as unseen
            return {
                ...state,
                error: action.payload
            };
        }

        case HomeActionsTypes.LoadAllPatientsSuccess: {
            return {
                ...state,
                allPatients: [ ...action.payload ],
                error: ''
            };
        }

        case HomeActionsTypes.SortPatients: {
            return {
                ...state,
                sort: action.payload ? action.payload : null,
                error: ''
            };
        }

        case HomeActionsTypes.LoadUpdateFoldersSuccess: {
            const pid = state.patientPage && state.patientPage.patient ? state.patientPage.patient.remote_id : null;
            const patientFolders = action.payload ? action.payload.find(item => item.patientId === pid) : null;
            return {
                ...state,
                updateFolders: [...action.payload],
                patientFolders: patientFolders ? [ ...patientFolders.folders ] : [],
                error: ''
            };
        }

        case HomeActionsTypes.SelectPatient: {
            state.patientPage.patient = action.payload;
            return {
                ...state,
                selectedPatient: { ...action.payload },
                error: ''
            };
        }

        case HomeActionsTypes.SelectFolder: {
            return {
                ...state,
                selectedFolder: action.payload ? { ...action.payload } : null,
                selectedSubFolder: null,
                error: ''
            };
        }

        case HomeActionsTypes.SelectSubFolder: {
            return {
                ...state,
                selectedSubFolder: action.payload ? { ...action.payload } : null,
                error: ''
            };
        }

        case HomeActionsTypes.SelectPage:
            if (action.payload.patient.id !== state.selectedPatient.id ||
                action.payload.page !== state.patientPage.page) {
                    state.selectedFolder = null;
                    state.selectedSubFolder = null;
                    state.selectedProvider = null;
                    state.hideFolders = false;
            }
            const patientId = action.payload ? action.payload.patient.id : null;
            const selPatient = state.myPatients.find(p => p.id === patientId);

            return {
                ...state,
                selectedPatient: { ...selPatient },
                patientPage: { ...action.payload }
                // selectedFolder: action.payload.page === Pages.Providers ? null : state.selectedFolder,
                // selectedSubFolder: action.payload.page === Pages.Providers ? null : state.selectedSubFolder,
                // selectedProvider: action.payload.page === Pages.Patients ? null : state.selectedProvider
            };

        case HomeActionsTypes.HideFolders:
            return {
                ...state,
                hideFolders: action.payload
            };

        case HomeActionsTypes.SelectProvider:
            state.selectedFolder = null;
            state.selectedSubFolder = null;
            return {
                ...state,
                selectedProvider: { ...action.payload },
                hideFolders: false
            };

        case HomeActionsTypes.LoadProviders:
            return {
                ...state,
                error: ''
            };

        case HomeActionsTypes.LoadProvidersSuccess:
            const pid = state.patientPage && state.patientPage.patient ? state.patientPage.patient.remote_id : null;
            const patientProviders = action.payload.find(item => item.patientId === pid);
            return {
                ...state,
                providers: [...action.payload],
                patientProviders: patientProviders ? [...patientProviders.providers] : null,
                error: ''
            };

        case HomeActionsTypes.SetUpdates:
            return {
                ...state,
                updates: [ ...action.payload ]
            };

        case HomeActionsTypes.ResetStore: {
            state = initialState;
            return {
                ...state,
            };
        }

        case HomeActionsTypes.LoadMessagesSuccess: {
            console.log('[HOME] LoadMessagesSuccess:', action.payload);
            return {
                ...state,
                messages: [...action.payload]
            };
        }

        case HomeActionsTypes.MessageDialogResult: {
            console.log('MessageDialogResult:', action.payload);
            return {
                ...state,
            };
        }

        case HomeActionsTypes.Error: {
            return {
                ...state,
                error: action.payload
            };
        }
        default: {
            return {
                ...state
            };
        }
    }
};
