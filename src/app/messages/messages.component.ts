import 'rxjs/add/operator/debounceTime';

import * as fromMessages from './state';
import * as moment from 'moment';

import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { LoadChats, LoadMessages, LoadPatients, MessageDialog } from './state/actions/message.actions';
import { MessageDialogData, MessageDialogType } from './models/message-dialog-data';
import { Store, select } from '@ngrx/store';
import { filter, map, take, tap } from 'rxjs/operators';

import { AppState } from '../redux/app.state';
import { BehaviorSubject } from 'rxjs';
import { Chat } from '../models/chat';
import { ChatService } from './services/chat.service';
import { Message } from '../models/message';
import { MessageService } from './services/message.service';
import { MessageState } from './state/reducers/message.reducer';
import { MyPatient } from '../models/my-patients';
import { NgScrollbar } from 'ngx-scrollbar';
import { NotifyService } from '../services/notify.service';
import { Patient } from '../models/patient';
import { PatientsService } from '../patients/services/patients.service';
import { Router } from '@angular/router';
import { State } from './state/reducers';
import { Subject } from 'rxjs/Subject';
import { UpdateUserParticipantList } from '../redux/profile/profile.action';
import { orderBy } from 'lodash';

@Component({
    selector: 'idr-socket',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.scss'],

})
export class MessagesComponent implements OnInit { // TODO: Code left incomplete. AfterViewInit?
    public chatsLog: Chat[] = [];
    public choosedChat: Chat;
    public messages: Message[] = [];
    public patient: Patient;
    public title: string;
    public patients: Patient[];
    public newChatShow = false;
    public search: string;
    public myPatients: MyPatient[] = [];
    private modelChanged: Subject<string> = new Subject<string>();

    public chats$ = this.store.pipe(
        select(fromMessages.getChats),
        map((data: any[]) => {
            const sorted = orderBy(data, [
                (item) => {
                    if (item['preview'].last_message_time &&
                        moment(item['preview'].last_message_time).format('X'))
                    {
                        return moment(item['preview'].last_message_time).format('MM-DD-YYYY HH:mm');
                    }

                }
            ], ['desc']);
            return sorted;
        })
    );

    public messages$ = this.store.pipe(select(fromMessages.getMessages));

    public allPatients = [];
    public allPatients$ = this.store.pipe(
        select(fromMessages.getPatients),
        map((people: Patient[]) => {
            return people.map(person => ({
                id: person.remote_id, // remote_id
                name: person.first_name + ' ' + person.last_name
            }));
        })
    );

    public itemToSelect = null;
    // @ViewChild(NgScrollbar) scrollRef: NgScrollbar;

    public selectedSender: Subject<Chat> = new Subject<Chat>();
    selectedChat: Chat;

    constructor(private chatService: ChatService,
        private router: Router,
        private patService: PatientsService,
        private notify: NotifyService,
        private store: Store<State>,
        private storeMessages: Store<MessageState>,
        private messageService: MessageService
    ) {

        // Load chats
        this.store.dispatch(new LoadChats());
        this.store.dispatch(new LoadPatients());

        // TEMP: Load all patients
        this.allPatients$
            .subscribe((data: any) => {
                this.allPatients = data;
            });

        this.store.select('patientsPage')
            .map(x => x['patients'])
            .subscribe((_allpatients: Patient[]) => {

                if (_allpatients && !_allpatients.length) {
                    return;
                }
                this.patients = _allpatients;
        });

        // this.chatService.getChats().subscribe((_chats: Chat[]) => {
        //     if (!_chats.length) {
        //         this.newChatShow = true;
        //         return;
        //     }

        //     this.chatsLog = orderBy(_chats, [
        //         (item) => {
        //             if (item['preview'].last_message_time &&
        //                 moment(item['preview'].last_message_time).format('X'))
        //             {
        //                 return moment(item['preview'].last_message_time).format('MM-DD-YYYY HH:mm');
        //             }

        //         }
        //     ], ['desc']);

        //     this.choosedChat = this.chatsLog[0];

        //     this.selectChat(this.chatsLog[0]);

        //     // setTimeout(() => {
        //     //     this.scrollRef.update();
        //     // }, 0);
        // }, err => {
        //     this.notify.notifyError(err);
        // });

        this.store.select('profilePage').map(data => data.profile).subscribe((_profile) => {
            this.myPatients = _profile.my_patients_list_participants;
        });

        // Search
        this.modelChanged
            .debounceTime(300)
            .subscribe(model => {
                this.chatService.getChatSearch(model).subscribe((_chats: Chat[]) => {
                    this.chatsLog = _chats;
                }, err => {
                    this.notify.notifyError(err);
                });
            });
    }

    ngOnInit() {
        this.selectedSender
            .debounceTime(300)
            .subscribe(chat => {

            });
    }

    selectChat(chat: Chat) {
        this.selectedChat = chat;
        this.store.dispatch(new LoadMessages(chat));
    }

    ngAfterViewInit() {
        this.chatService.messages.subscribe((data) => {
            this.patient = null;
            this.title = '';
            this.messages = data;
            this.choosedChat = undefined;
            this.newChatShow = true;
        });

        this.chatService.notifications.subscribe(notif => {

            this.updateReadCounter(notif.update.chat);
            switch (notif.action) {

                case 'chat_created':
                    this.chatService.getChats().subscribe((_chats: Chat[]) => {
                        this.chatsLog = _chats;
                        this.choosedChat = notif.update;

                    });
                    this.newChatShow = false;

                    break;

                case 'message_created':
                    this.updateChat(notif.update);
                    break;
            }

        });
    }

    newPatient(index) {

        if (this.myPatients.length) {

            let newPat = this.myPatients.find(x => {
                if (x['patient'].remote_id !== index) return index
            });

            if (index) {

                return index;
            } else {
                return false;
            }
        } else {
            return true;
        }

    }

    changeMyPatient(id) {
        let patients = this.myPatients.map(x => x['patient'].remote_id);
        patients.push(id);
        this.patService.setMyPatientList(patients).subscribe((_resp) => {
            this.store.dispatch(new UpdateUserParticipantList(_resp['my_patients_list_participants']));

        });
    }

    updateReadCounter(id) {
        if (this.choosedChat && id === this.choosedChat.id) {
            this.chatService.getChat(id).subscribe(() => {
            });
        }
    }

    changeSearch(evt) {
        this.modelChanged.next(evt);
    }

    createdChat(chat: Chat) {
        this.choosedChat = chat;
    }

    updateChat(mess) {
        if (this.choosedChat.id === mess.chat) {
            this.chatService.updateMessagesLog(mess);
        }

        this.chatService.getChats().subscribe((_chats: Chat[]) => {
            this.chatsLog = _chats;
        }, err => {
            this.notify.notifyError(err);
        });
    }

    removeChat(evt: number) {
        this.chatsLog = this.chatsLog.filter(x => x.id !== evt);
        if (!this.chatsLog.length) {
            this.choosedChat = undefined;
            this.newChatShow = true;
            return;
        }
        this.choosedChat = this.chatsLog[0];
    }

    trackByFn(index: number, item: any) {
        return item.id;
    }

    // NEW FUNCTIONALITY

    createMessage() {
        this.openMessage('New Message', MessageDialogType.New);
    }

    replyMessage(message) {
        this.openMessage('Reply', MessageDialogType.Reply, message);
    }

    forwardMessage(message) {
        this.openMessage('Forward', MessageDialogType.Forward, message);
    }

    openMessage(header: string, type: MessageDialogType, message: any = null) {
        const data = new MessageDialogData(header, type, this.selectedChat, message)
        this.storeMessages.dispatch(new MessageDialog(data));
    }

    public isExpanded(item: any) {
        return this.itemToSelect && this.itemToSelect.id === item.id;
    }
    public closeOtherPanels(msg: any) {

    }
    public folderOpened(msg: any) {

    }
    public folderClosed(msg: any) {

    }
    public folderClicked(item: any, event: Event) {
        event.preventDefault();
        event.stopPropagation();
        if (this.itemToSelect && this.itemToSelect.id === item.id) {
            this.itemToSelect = null;
            //this.store.dispatch(new SelectFolder(null));
        } else {
            this.itemToSelect = item; // new DataColumn(
            //this.store.dispatch(new SelectFolder(item));
            //this.navigateToFolderId(item ? item.id : 0);
        }
    }
    public getIconByType(direction) {
        switch (direction) {
            case 'sender':
                return 'icon-message-arrow-up';
            default:
                return 'icon-message-arrow-down';
        }
    }

    public flaggedClicked() {

    }

    public seenClicked() {

    }
}

