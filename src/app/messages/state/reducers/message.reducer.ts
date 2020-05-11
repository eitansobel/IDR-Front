import { MessageActions, MessageActionsTypes } from '../actions/message.actions';

import { Patient } from 'src/app/models/patient';
import { Profile } from 'src/app/models/profile';

export interface MessageState {
    sample: any[];
    chat: any;
    chats: any[];
    messages: any;
    patients: Patient[];
    providers: Profile[];
    selectedPatient: Patient;
    selectedProvider: Profile;
    error: any;
};

const initialState: MessageState = {
    sample: null,
    chat: {},
    chats: [],
    messages: {},
    patients: [],
    providers: [],
    selectedPatient: null,
    selectedProvider: null,
    error: null
};

export function MessageReducer(state = initialState, action: MessageActions): MessageState {
    switch (action.type) {
        case MessageActionsTypes.MessageDialog: {
            return {
                ...state,
            };
        }
        case MessageActionsTypes.MessageDialogResult: {
            console.log('MessageDialogResult:', action.payload);
            return {
                ...state,
            };
        }
        case MessageActionsTypes.LoadChatsSuccess: {
            console.log('LoadChatsSuccess:', action.payload);
            return {
                ...state,
                chats: [...action.payload]
            };
        }
        case MessageActionsTypes.LoadMessages: {
            console.log('LoadMessagesSuccess:', action.payload);
            return {
                ...state,
                chat: {...action.payload}
            };
        }
        case MessageActionsTypes.LoadMessagesSuccess: {
            console.log('LoadMessagesSuccess:', action.payload);
            return {
                ...state,
                messages: {...action.payload}
            };
        }
        case MessageActionsTypes.LoadPatientsSuccess: {
            return {
                ...state,
                patients: [...action.payload]
            };
        }
        case MessageActionsTypes.LoadProvidersSuccess: {
            return {
                ...state,
                providers: [...action.payload]
            };
        }
        case MessageActionsTypes.PatientSearchDialogResult: {
            return {
                ...state,
                selectedPatient: action.payload
            }
        }
        case MessageActionsTypes.ProviderSearchDialogResult: {
            return {
                ...state,
                selectedProvider: action.payload
            }
        }
        case MessageActionsTypes.Error: {
            return {
                ...state,
                error: action.payload
            };
        }
        case MessageActionsTypes.ResetStore: {
            state = initialState;
            return {
                ...state,
            };
        }
        default: {
            return {
                ...state,
            };
        }
    }
}
