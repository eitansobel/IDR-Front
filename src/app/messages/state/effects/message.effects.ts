import * as fromActions from '../actions/message.actions';

import { Action, Store, select } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { EMPTY, Observable, merge, of } from 'rxjs';
import { MessageDialogData, MessageDialogResult, MessageDialogType } from '../../models/message-dialog-data';
import { catchError, exhaustMap, filter, find, map, mergeMap, startWith, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import { ChatMessage } from 'src/app/models/chat';
import { ChatService } from '../../services/chat.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MessageDialogComponent } from '../../message-dialog/message-dialog.component';
import { MessageService } from '../../services/message.service';
import { Patient } from 'src/app/models/patient';
import { PatientSearchDialogComponent } from '../../patient-search-dialog/patient-search-dialog.component';
import { PatientsService } from 'src/app/patients/services/patients.service';
import { Profile } from 'src/app/models/profile';
import { ProviderSearchDialogComponent } from '../../provider-search-dialog/provider-search-dialog.component';
import { StaffService } from 'src/app/staff/service/staff.service';
import { State } from '../reducers';

// Required Fields:
// * `chat` (int) id of chat
// * `subject` (str) message subject
// * `text` (str) message text

// Optional Fields:

// * `flagged` (boolean) Default False
// * `urgency` (int) 1 - 'Immediate', 2 - '30 minutes', 3 - '1hr', 4 - '2hr', 5 - 'FYI - No Alert'. Default 5
// ---

@Injectable()
export class MessageEffects {

    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private store: Store<State>,
        public dialog: MatDialog,
        public patientsService: PatientsService,
        public staffService: StaffService,
        public chatService: ChatService,
        public messageService: MessageService
    ) { }

    @Effect()
    loadChats$: Observable<Action> = this.actions$.pipe(
        ofType(fromActions.MessageActionsTypes.LoadChats),
        mergeMap(() => {
            return this.chatService.getChats()
                .pipe(
                    map((chats: any) => {
                        console.log('[CHATS LOADED]: ', chats);
                        return new fromActions.LoadChatsSuccess(chats);
                    }),
                    catchError(err => of(new fromActions.Error(err)))
                );
        })
    );

    @Effect()
    messageDialog$: Observable<Action> = this.actions$.pipe(
        ofType(fromActions.MessageActionsTypes.MessageDialog),
        map((action: any) => action.payload),
        exhaustMap((data: MessageDialogData) => {
            const dialogRef = this.dialog.open(MessageDialogComponent, {
                width: '440px',
                data: data
            });
            return dialogRef.afterClosed();
        }),
        mergeMap((res: MessageDialogResult) => {
            if (res) {

                if (res.messageType === MessageDialogType.Reply ||
                    res.messageType === MessageDialogType.Forward) {

                    console.log('REPLY || FORWARD: ', res);
                    return EMPTY;

                } else {
                    return this.processNewChat(res)
                        .pipe(
                            switchMap((chat: any) => {
                                console.log('[CHAT CREATED]: ', chat)
                                res.chat = chat.id;
                                return this.processNewMessage(res)
                                    .pipe(
                                        map((msg: any) => {
                                            console.log('[CHAT MESSAGE CREATED]: ', msg)
                                            return new fromActions.LoadChats();
                                        }),
                                        catchError(err => of(new fromActions.Error(err)))
                                    );
                            }),
                            catchError(err => of(new fromActions.Error(err)))
                        );
                }
            }
            return EMPTY;
        })
    );

    @Effect()
    searchPatientDialog$: Observable<Action> = this.actions$.pipe(
        ofType(fromActions.MessageActionsTypes.PatientSearchDialog),
        map((action: any) => action.payload),
        exhaustMap((data: any) => {
            const dialogRef = this.dialog.open(PatientSearchDialogComponent, {
                width: '768px',
                data: {
                    headerText: data.headerText || 'Search Patient',
                }
            });
            return dialogRef.afterClosed();
        }),
        map((result: any) => {
            if (result === undefined) {
                return new fromActions.PatientSearchDialogClose();
            }
            return new fromActions.PatientSearchDialogResult(result);
        })
    );

    @Effect()
    searchProviderDialog$: Observable<Action> = this.actions$.pipe(
        ofType(fromActions.MessageActionsTypes.ProviderSearchDialog),
        map((action: any) => action.payload),
        exhaustMap((data: any) => {
            const dialogRef = this.dialog.open(ProviderSearchDialogComponent, {
                width: '768px',
                data: {
                    headerText: data.headerText || 'Search Provider',
                }
            });
            return dialogRef.afterClosed();
        }),
        map((result: any) => {
            if (result === undefined) {
                return new fromActions.ProviderSearchDialogClose();
            }
            return new fromActions.ProviderSearchDialogResult(result);
        })
    );

    @Effect()
    loadPatients$: Observable<Action> = this.actions$.pipe(
        ofType(
            fromActions.MessageActionsTypes.LoadPatients,
            fromActions.MessageActionsTypes.MessageDialog
        ),
        mergeMap(action => {
            return this.patientsService
                .getAllPatients()
                .pipe(
                    map((patients: Patient[]) => {
                        return new fromActions.LoadPatientsSuccess(patients);
                    }),
                    catchError(err => of(new fromActions.Error(err)))
                );
        })
    );

    @Effect()
    loadProviders$: Observable<Action> = this.actions$.pipe(
        ofType(
            fromActions.MessageActionsTypes.LoadProviders,
            fromActions.MessageActionsTypes.MessageDialog
        ),
        mergeMap(action => {

            return this.staffService
                .getAllMembers2()
                .pipe(
                    map((providers: Profile[]) => {
                        return new fromActions.LoadProvidersSuccess(providers);
                    }),
                    catchError(err => of(new fromActions.Error(err)))
                );
        })
    );

    @Effect()
    loadMessages$: Observable<Action> = this.actions$.pipe(
        ofType(fromActions.MessageActionsTypes.LoadMessages),
        mergeMap((action: any) => {
            return this.messageService
                .getMessages(action.payload.id)
                .pipe(
                    map((messages: any) => {
                        console.log('messages', messages)
                        return new fromActions.LoadMessagesSuccess(messages);
                    }),
                    catchError(err => of(new fromActions.Error(err)))
                );
        })
    );

    processReplyForwardMessage(data: MessageDialogResult) {

        return this.chatService.createMessage(data);
    }

    processNewMessage(data: MessageDialogResult) {
        const message = {
            subject: data.subject,
            text: data.text,
            chat: data.chat,
            flagged: data.flagged || false
            // urgency	=
            // reply_for =
            // attachment
        };
        return this.chatService.createMessage(message);
    }

    processNewChat(data: MessageDialogResult) {
        const chat = {
            patient: data.patient,
            participants: data.participants,
            patient_name: '-'
        };
        return this.chatService.createChat(chat);
    }
}

