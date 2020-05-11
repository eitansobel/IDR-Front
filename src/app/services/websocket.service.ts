import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class WebSocketService {
    private subject: Subject<MessageEvent>;
    token = localStorage.getItem('idrToken');
    constructor() {
    }
    //
    // For chat box
    public connect(url: string): Subject<MessageEvent> {
        // TODO: Uncomment once backend done
        return new BehaviorSubject<MessageEvent>(null);
        if (!this.subject) {
            this.subject = this.create(url);
        }
        return this.subject;
    }

    private create(url: string): Subject<MessageEvent> {
        const ws = new WebSocket(url, this.token);

        const observable = Observable.create(
            (obs: Observer<MessageEvent>) => {
                ws.onmessage = obs.next.bind(obs);
                ws.onerror = obs.error.bind(obs);
                ws.onclose = obs.complete.bind(obs);

                return ws.close.bind(ws);
            });
        const observer = {
            next: (data: Object) => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify(data));
                }
            }
        };

        return Subject.create(observer, observable);
    }

}
