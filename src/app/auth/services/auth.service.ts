import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';

import {ApiFactory} from '../../services/api.factory';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Router} from "@angular/router";
import {User} from '../../models/user';
import {environment} from '../../../environments/environment';

@Injectable()
export class AuthService {
    private BASE_URL: string = environment.settings.backend1 + 'api/';
    private headers: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

    constructor(private http: HttpClient, private af: ApiFactory,
                private router: Router,) {
    }

    private handleError(error: HttpErrorResponse) {
        return Observable.throw(error.error || 'Server error'); // Observable.throw() is undefined at runtime using Webpack
    }

    login(user: User): Observable<any> {
        const url: string = `${this.BASE_URL}v1/authenticate/doctor/`;
        return this.http
            .post(url, user, {headers: this.headers})
            .catch(this.handleError);
    }

    register(user: User): Observable<any> {
        const url: string = `${this.BASE_URL}v1/doctor/`;
        return this.http
            .post(url, user, {headers: this.headers})
            .catch(this.handleError);
    }

    forgotPass(email: object): Observable<any> {
        const url: string = `${this.BASE_URL}v1/authenticate/forgot_password/`;

        return this.http
            .post(url,
                {
                    ...email
                },
                {headers: this.headers})
            .catch(this.handleError);
    }

    resetPass(data: object): Observable<any> {
        const url = `${this.BASE_URL}v1/authenticate/reset_password/`;
        return this.http
            .post(url,
                data,
                {headers: this.headers})
            .catch(this.handleError);
    }

    logout(): Observable<any> {
        return this.af.sendPost(`${this.BASE_URL}v1/authenticate/logout/`, null);
    }


    changePass(data, token) {
        this.headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': `Token ${token}`});
        return this.http
            .post('${this.BASE_URL}v1/authenticate/set_password/',
                data,
                {headers: this.headers})
            .catch(this.handleError);
    }

    clearStoreOnLogout(setLogoutPage: boolean = false) {
        localStorage.removeItem('idrToken');
        localStorage.removeItem('idrId');
        localStorage.removeItem('lock');
        localStorage.removeItem('username');
        localStorage.removeItem('alerts');
        localStorage.removeItem('logoutTimerId');
        localStorage.removeItem('idrUserId');
        if (setLogoutPage) {
            localStorage.setItem('logoutPage', this.router.url);
        } else {
            localStorage.removeItem('logoutPage');
        }
        this.router.navigateByUrl('auth/login');
    }
}
