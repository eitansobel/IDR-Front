import { ApiFactory } from '../../services/api.factory';
import { Injectable } from '@angular/core';
import { PatientBase } from 'src/app/models/patient-base';
import { Update } from 'src/app/models/update';
import { environment } from '../../../environments/environment';

@Injectable()
export class UpdatesService {
    private BASE_URL: string = environment.settings.backend1 + 'api/';
    private updatesUrl = `${this.BASE_URL}v1/updates/`;
    private userId = Number(localStorage.getItem('idrUserId'));

    constructor(private apiFactory: ApiFactory) {
    }

    createUpdate(data) {
        return this.apiFactory.sendPost(`${this.BASE_URL}v1/updates/`, data);
    }

    getUpdates(folderId?: number, patientId?: number, doctorId?: number, generalUpdates?: boolean) {
        const params = [];
        let path = this.updatesUrl;

        if (patientId) {
            params.push('patient=' + patientId);
        }
        if (doctorId) {
            params.push('doctor=' + doctorId);
        }
        if (folderId) {
            params.push('folder=' + folderId);
        }
        if(generalUpdates){
            params.push('nofolder');
        }
        if (params.length > 0) {
            path += '?' + params.join('&');
        }
        return this.apiFactory.sendGet(path);
    }

    setSeen(update: Update, seen: boolean) {
        const url = `${this.BASE_URL}v1/updates/${update.id}/seen/`;
        if (seen) {
            return this.apiFactory.sendPost(url, {});
        } else {
            return this.apiFactory.sendDelete(url);
        }
    }

    setSeenBulk(patient: PatientBase, excludeList: number[]) {
        let url = `${this.BASE_URL}v1/updates/seen/`;
        if (patient && patient.remote_id > 0) {
            url += '?patient=' + patient.remote_id;
        }
        return this.apiFactory.sendPost(url, { exclude: excludeList });
    }

    setFlagged(update: Update, flag: boolean) {
        const url = `${this.BASE_URL}v1/updates/${update.id}/`;
        if (flag) {
            return this.apiFactory.sendPost(`${url}flag/`, {});
        } else {
            return this.apiFactory.sendDelete(`${url}flag/`);
        }
    }

    getUpdatesSample(folderId?: number, doctorId?: number) {
        return this.apiFactory.sendGet(`/assets/data/updates.sample.json`);
    }
}
