import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';

import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';

import {ApiFactory} from '../../services/api.factory';
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {WebSocketService} from '../../services/websocket.service';
import {environment} from '../../../environments/environment';

const CHAT_URL = environment.settings.ws;

export interface Message {
    author: string;
    message: string;
    newDate?: string;
}

@Injectable()
export class ChatService {
    private BASE_URL: string = environment.settings.backend1 + 'api/';

    public messages: Subject<any> = new Subject<any>();
    public newMessage: Subject<any> = new Subject<any>();
    public notifications: Subject<any> = new Subject<any>();

    messagesObservable$ = this.messages.asObservable();

    public socket;

    constructor(private wsService: WebSocketService, private af: ApiFactory, private http: HttpClient) {

        // TODO: Uncomment once sockets ready on server
        // this.notifications = <Subject<Message>> this.wsService
        //     .connect(CHAT_URL)
        //     .map((response: MessageEvent): Message => {
        //         return JSON.parse(response.data);
        //     });
    }

    public updateMessage(data: any) {
        if (data) {
            this.messages.next(data);
        }
    }

    public updateMessagesLog(data: any) {
        if (data) {
            this.newMessage.next(data);
        }
    }

    createMessage(data) {
        return this.af.sendPost(`${this.BASE_URL}v1/message/`, data);
    }

    createMessageAttached(data) {
        return this.af.sendFilePost(`${this.BASE_URL}v1/message/`, data);
    }

    getMessages(id, page) {
        // const params = {'page': page, 'chat': id};
        return this.af.sendGet(`${this.BASE_URL}v1/message/?page=${page}&chat=${id}`);
    }

    getUnreadMessages() {
        return this.af.sendGet(`${this.BASE_URL}v1/message/get_unread_messages/`);
    }

    getChats() {
        return this.af.sendGet(`${this.BASE_URL}v1/chat/`);
    }

    updateChat(id, data) {
        return this.af.sendPatch(`${this.BASE_URL}v1/chat/${id}/`, data);
    }

    getChatSearch(search) {
        return this.af.sendGet(`${this.BASE_URL}v1/chat/?search=${search}`).debounceTime(1000);
    }

    createChat(data) {
        return this.af.sendPost(`${this.BASE_URL}v1/chat/`, data);
    }

    getChat(id) {
        return this.af.sendGet(`${this.BASE_URL}v1/chat/${id}/`);
    }

    deleteChat(id) {
        return this.af.sendDelete(`${this.BASE_URL}v1/chat/${id}/`);
    }

}
