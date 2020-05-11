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
export class MessageService {
    private BASE_URL: string = environment.settings.backend1 + 'api/';

    public messages: Subject<any> = new Subject<any>();
    public newMessage: Subject<any> = new Subject<any>();
    public notifications: Subject<any> = new Subject<any>();

    messagesObservable$ = this.messages.asObservable();

    public socket;

    constructor(
        private wsService: WebSocketService,
        private apiFactory: ApiFactory, private http: HttpClient) {

        // TODO: Uncomment once sockets ready on server
        // this.notifications = <Subject<Message>> this.wsService
        //     .connect(CHAT_URL)
        //     .map((response: MessageEvent): Message => {
        //         return JSON.parse(response.data);
        //     });
    }

    getMessages(chatId: number, page: number = 1) {
        // const params = {'page': page, 'chat': id};
        return this.apiFactory.sendGet(`${this.BASE_URL}v1/message/?chat=${chatId}&page=${page}`);
    }

    getUnreadMessages() {
        return this.apiFactory.sendGet(`${this.BASE_URL}v1/message/get_unread_messages/`);
    }
}
