import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ApiFactory } from './api.factory';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

// import { State } from '../state/reducer';

@Injectable({
    providedIn: 'root'
})
export class AvatarService {
    public patientID: string;
    private BASE_URL: string = environment.settings.backend2 + 'api/v2/';

    constructor(private http: HttpClient, private apiFactory: ApiFactory) {
    }

    public uploadFile(event, patientID) {
        this.patientID = patientID;
        if (event.target.files && event.target.files.length > 0) {
            const files = event.target.files;

            const token = localStorage.getItem('idrToken');
            // this.headers = new HttpHeaders({
            //     'Content-Type': 'application/json', 'Authorization': `Token ${this.token}`
            // });
            // const headers = new HttpHeaders({
            //     'Authorization': `Token ${this.token}`
            // });
            const header2 = new HttpHeaders({'Authorization': `Token ${token}`});

            const formData = new FormData();
            formData.append('photo', files[0]);

            this.http
                .post(`${this.BASE_URL}patient/${this.patientID}/set_photo/`, formData, {headers: header2})
                .subscribe(result => {
                    console.log('AVATAR UPLOADED', result);
                });

            // for (let i = 0; i < files.length; i++) {
            //     this.setupReader(files[i]);
            // }
        }
    }

    public setupReader(file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e: any) => {
            const b64Content = e.target.result;
            const block = b64Content.split(';');
            const contentType = block[0].split(':')[1] || '';
            const b64Data = block[1].split(',')[1];
            this.createFiles(b64Data);
        };
    }

    public createFiles(b64Data: string) {
        const formData = new FormData();
        formData.append('photo', b64Data);

        const token = localStorage.getItem('idrToken');
        // this.headers = new HttpHeaders({
        //     'Content-Type': 'application/json', 'Authorization': `Token ${this.token}`
        // });
        // const headers = new HttpHeaders({
        //     'Authorization': `Token ${this.token}`
        // });
        const header2 = new HttpHeaders({'Authorization': `Token ${token}`});

        this.http
            .post(`${this.BASE_URL}patient/${this.patientID}/set_photo/`, {photo: b64Data}, {headers: header2})
            .subscribe(result => {
                console.log('AVATAR UPLOADED', result);
            });
    }

    // public deleteFile(fileId: number): any {
    //     return this.http
    //         .delete(`${this.BASE_URL}formtemplatefiles/${fileId}/`)
    //         .pipe(tap(t => console.log('Form file deleted: ', t)));
    // }

    // getTemplate() {
    //     this.store.dispatch(
    //         new formActions.LoadSelectedTemplate(this.template.id)
    //     );
    // }
}
