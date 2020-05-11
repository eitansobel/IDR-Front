import { CanActivate, Router } from '@angular/router';

import { AddProfile } from '../../redux/profile/profile.action';
import { ApiFactory } from '../../services/api.factory';
import { AppState } from '../../redux/app.state';
import { Injectable } from '@angular/core';
import { MyPatient } from 'src/app/models/my-patients';
import { MyPatients } from '../../redux/home/home.actions';
import { NotifyService } from '../../services/notify.service';
import { Profile } from '../../models/profile';
import { Sort } from 'src/app/models/sort';
import { SortPatients } from '../../home/state/actions/home.actions';
import { State } from 'src/app/home/state/reducers';
import { Store } from '@ngrx/store';
import { Update } from 'src/app/models/update';
import { UpdatesService } from 'src/app/home/services/updates.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class EnsureAuthenticated implements CanActivate {
    private BASE_URL: string = environment.settings.backend1 + 'api/';
    constructor(
        private store: Store<AppState>,
        private store2: Store<State>,
        private af: ApiFactory,
        private notify: NotifyService,
        private router: Router,
        private updatesService: UpdatesService
    ) { }

    canActivate(): boolean {
        const token = localStorage.getItem('idrToken');

        // TODO: Refactor this.

        // Get doctor profile with associated patients
        this.getProfile().subscribe(
            (profile: Profile) => {

                this.store.dispatch(new AddProfile(profile));

                if (profile && profile.patient_sort_by && profile.patient_order) {
                    const sort = new Sort({sortBy: profile.patient_sort_by, order: profile.patient_order});
                    this.store2.dispatch(new SortPatients(sort));
                }

                // Merge patient updates
                // this.getUpdates().subscribe(
                //     (updates: Update[]) => {

                //         const mergedProfile = this.mergeUpdates(profile, updates);
                //         this.store.dispatch(new AddProfile(mergedProfile));

                //     },
                //     err => {
                //         this.notify.notifyError(err);
                //     }
                // );

            },
            err => {
                this.notify.notifyError(err);
            });

        if (token) {
            return true;
        } else {
            console.log('--- redirect to login ---');
            this.router.navigateByUrl('/auth/login');
            return false;
        }
    }

    getProfile() {
        const id = localStorage.getItem('idrUserId');
        return this.af.sendGet(`${this.BASE_URL}v1/doctor/${id}/`);
    }

    // getUpdates() {
    //     return this.updatesService.getUpdates();
    // }

    // mergeUpdates(profile: Profile, updates: Update[]): Profile {
    //     profile.my_patients_list_participants.forEach((_myPatient: MyPatient) => {
    //         updates.forEach(_update => {
    //             if (_myPatient.patient.id === _update.patient) {
    //                 if (!_myPatient.updates) {
    //                     _myPatient.updates = [];
    //                 }
    //                 _myPatient.updates.push(_update);
    //             }
    //         });
    //     });
    //     return profile;
    // }
}
