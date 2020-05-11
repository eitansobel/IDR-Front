import 'rxjs/add/operator/switchMap';

import * as moment from 'moment';

import {Component, HostBinding, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';

import { environment } from 'src/environments/environment.prod';

@Component({
    selector: 'idr-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

    constructor(private router: Router) {
        this.router.events.subscribe((event: any) => {

            if (event instanceof NavigationEnd) {
                if ((event.url === '/auth' || event.urlAfterRedirects === '/auth') && event.url !== '/auth/set-alerts') {
                    this.router.navigateByUrl('/auth/login');
                }
            }
        });
    }

    ngOnInit() { }

    getVersion() {
        const timestamp = moment.utc(parseInt(environment.timestamp, 10)).format('YYYY-MM-DD hh:mm A');
        return 'version: ' + environment.version + ' - ' + timestamp + ' UTC';
    }
}
