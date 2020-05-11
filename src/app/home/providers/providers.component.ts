import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { HomePatientProviders, SelectedProvider } from 'src/app/redux/home/home.actions';
import { Store, select } from '@ngrx/store';
import { getProviders, getState } from '../state';

import { AppState } from 'src/app/redux/app.state';
import { BaseComponent } from 'src/app/common/base/base.component';
import { PatientProvider } from 'src/app/models/patient-provider';
import { SelectProvider } from '../state/actions/home.actions';
import { StaffService } from '../../staff/service/staff.service';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';

@Component({
    selector: 'idr-providers',
    templateUrl: './providers.component.html',
    styleUrls: ['./providers.component.scss'],
    providers: [StaffService]
})
export class ProvidersComponent extends BaseComponent implements OnInit {
    public summary: any[];
    public imageUrl: string = environment.settings.imageUrl;
    public _summaryOriginal = null;
    public selectedProvider = null;
    routeParams: any;

    providers$ = this.store
        .pipe(
            select(getState),
            map(state => {
                return state.patientProviders;
            })
        );


    constructor(
        private staffService: StaffService,
        private store: Store<AppState>,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {
        super();
    }

    ngOnInit() {
        this.activatedRoute
            .params
            .takeUntil(this.destroyed$)
            .subscribe(q => {
                this.routeParams = q;
            });

        // this.store
        //     .select('homePatientsPage')
        //     .takeUntil(this.destroyed$)
        //     .map(stored => stored)
        //     .subscribe(stored => {
        //         if (stored.selectedPatient) {
        //             if (!stored.patientProviders) {
        //                 this.getProviders(stored.selectedPatient.remote_id);
        //             } else {
        //                 const pt = stored.patientProviders
        //                     .find((q: { patientId: number; }) => {
        //                         return q.patientId === stored.selectedPatient.remote_id;
        //                     });
        //                 if (pt && pt.providers) {
        //                     this.summary = pt.providers;
        //                 }
        //             }
        //         }
        //     });
    }

    // getProviders(patientId: number) {
    //     this.staffService
    //         .getPatientProviders()
    //         .takeUntil(this.destroyed$)
    //         .subscribe((summary: any) => {

    //             const patientProviders: PatientProvider[] = [];

    //             Object.keys(summary).forEach(key => {

    //                 const pid = Number.parseInt(key, 10);

    //                 patientProviders.push({
    //                     patientId: pid,
    //                     providers: summary[key]
    //                 });

    //                 if (key === patientId.toString()) {
    //                     this.summary = summary[key];
    //                 }
    //             });

    //             if (this._summaryOriginal !== JSON.stringify(summary)) {
    //                 this._summaryOriginal = JSON.stringify(summary);
    //                 // TODO: IMPROVE: Setup and convert object into into model array
    //                 this.store.dispatch(new HomePatientProviders(patientProviders));
    //             }

    //         });
    // }

    showUpdates(provider) {
        console.log('provider', provider)
        this.selectedProvider = provider;
        this.store.dispatch(new SelectProvider(provider));
        setTimeout(() => {
            this.router.navigate(
                [
                    'providers',
                    this.routeParams.patientId,
                    provider.id || 0
                ],
                { relativeTo: this.activatedRoute.parent }
            );
        });
    }

}
