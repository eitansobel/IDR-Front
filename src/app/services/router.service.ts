import { ActivatedRoute, NavigationEnd, Router, RoutesRecognized } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, mergeMap, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';

@Injectable()
export class RouterService {
    private _data = new BehaviorSubject<any>(null);
    private _params = new BehaviorSubject<any>(null);
    private _route = new BehaviorSubject<any>(null);

    get params() {
        return this._params.getValue();
    }

    get paramsChanged() {
        return this._params;
    }

    get data() {
        return this._data.getValue();
    }

    get dataChanged(): BehaviorSubject<any> {
        return this._data;
    }

    get route(): ActivatedRoute {
        return this._route.getValue();
    }

    get routeChanged(): BehaviorSubject<any> {
        return this._route;
    }

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {
        this.getCurrentRoute().subscribe(route => {
            this._route.next(route);

            if (!route || !route.data) return;

            const routeData = (route.data as BehaviorSubject<any>).getValue();
            this._data.next(routeData);

            const routeParams = (route.params as BehaviorSubject<any>).getValue();
            this._params.next(routeParams);
        });
    }

    private getCurrentRoute(): Observable<ActivatedRoute> {
        return this.router.events
            .pipe(
                filter(event => event instanceof NavigationEnd),
                map(() => {
                    let route = this.activatedRoute.firstChild;
                    let child = route;
                    while (child) {
                        if (child.firstChild) {
                            child = child.firstChild;
                            route = child;
                        } else {
                            child = null;
                        }
                    }
                    return route;
                }),
            );
    }
}
