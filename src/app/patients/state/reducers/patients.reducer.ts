import { PatientsActions, PatientsActionsTypes } from '../actions/patients.actions';

import { Patient } from 'src/app/models/patient';
import { Profile } from 'src/app/models/profile';

export interface PatientsState {
    patients: Patient[];
    providers: Profile[];
    selectedPatient: Patient;
    selectedProvider: Profile;
    patientsList: any[];
    selectedPatientsList: any;
    error: any;
};

const initialState: PatientsState = {
    patients: [],
    providers: [],
    selectedPatient: null,
    selectedProvider: null,
    patientsList: [],
    selectedPatientsList: null,
    error: null
};

export function PatientsReducer(state = initialState, action: PatientsActions): PatientsState {
    switch (action.type) {
        case PatientsActionsTypes.MessageDialog: {
            return {
                ...state,
            };
        }
        case PatientsActionsTypes.MessageDialogResult: {
            return {
                ...state,
            };
        }
        case PatientsActionsTypes.LoadPatientsSuccess: {
            return {
                ...state,
                patients: [...action.payload]
            };
        }
        case PatientsActionsTypes.LoadPatientsListSuccess: {
            // patientslist api endpoint returns non standard result set
            // result set contains object with only "all_patients" field
            // extract it to show on top of the list at Patients page
            const index = action.payload.findIndex(q => q.all_patients);
            const allPatients = action.payload[index];
            action.payload.splice(index, 1);

            console.log('--- allPatients ---', allPatients)

            return {
                ...state,
                patientsList: [...action.payload],
                patients: [...allPatients.all_patients]
            };
        }
        case PatientsActionsTypes.LoadProvidersSuccess: {
            return {
                ...state,
                providers: [...action.payload]
            };
        }
        case PatientsActionsTypes.PatientSearchDialogResult: {
            return {
                ...state,
                selectedPatient: action.payload
            }
        }
        case PatientsActionsTypes.ProviderSearchDialogResult: {
            return {
                ...state,
                selectedProvider: action.payload
            }
        }
        case PatientsActionsTypes.Error: {
            return {
                ...state,
                error: action.payload
            };
        }
        case PatientsActionsTypes.ResetStore: {
            state = initialState;
            return {
                ...state,
            };
        }
        case PatientsActionsTypes.HidePatientSuccess: {
            return {
                ...state,
                error: ''
            };
        }
        default: {
            return {
                ...state,
            };
        }
    }
}
