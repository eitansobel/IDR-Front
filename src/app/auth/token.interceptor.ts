import 'rxjs/add/operator/do';

import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse
} from '@angular/common/http';

import { AppState } from '../redux/app.state';
import { AuthService } from './services/auth.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ResetStore } from '../home/state/actions/home.actions';
import { Router } from '@angular/router';
import { State } from '../home/state/reducers';
import { Store } from '@ngrx/store';
import { TokenGoingToExpire } from '../redux/token-status/token-status.action';
import { environment } from '../../environments/environment';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    private lastRequestTimer;

    constructor(private router: Router,
        private store: Store<AppState>,
        private storeHome: Store<State>,
        private auth: AuthService) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(request).do((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
                this.setTokenGoingToExpireTimeout();
            }

        }, (err: any) => {
            if (err instanceof HttpErrorResponse) {
                if (err.status === 401 || err.status === 403 && err.error && err.error.detail === 'Invalid token') {
                    this.auth.clearStoreOnLogout(true);
                }
            }
        });
    }

    setTokenGoingToExpireTimeout() {
        clearTimeout(this.lastRequestTimer);
        this.lastRequestTimer = setTimeout(() => {
            this.storeHome.dispatch(new ResetStore());
            this.store.dispatch(new TokenGoingToExpire());
        }, environment.logOutAfter - 60 * 1000);
    }
}
