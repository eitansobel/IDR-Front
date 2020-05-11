import {CopyColumn, CreateColumn, DeleteColumn, UpdateColumn} from '../../redux/dataColumns/data-column.action';

import {ApiFactory} from '../../services/api.factory';
import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';

@Injectable()
export class FoldersService {
    private BASE_URL: string = environment.settings.backend1 + 'api/';
    private userId = Number(localStorage.getItem('idrUserId'));

    constructor(private af: ApiFactory) {
    }

    getFolders(): any {
        return this.af.sendGet(`${this.BASE_URL}v1/folders/`);
    }

    // webSocketActionManager(wsEvent, existedData, store) {
    //     switch (wsEvent.action) {
    //         case 'column_created':
    //             if (wsEvent.doctor_remote_id !== this.userId) {
    //                 if (existedData.some(item => item.author.id === wsEvent.doctor_remote_id)) {
    //                     store.dispatch(new CreateColumn(wsEvent.update));
    //                 }
    //             }
    //             break;

    //         case 'column_copied':
    //             if (wsEvent.doctor_remote_id !== this.userId) {
    //                 const copiedColumnGroup = existedData.find(item => {
    //                     return item.group_id === wsEvent.update.group_id;
    //                 });
    //                 if (copiedColumnGroup) {
    //                     store.dispatch(new CopyColumn(wsEvent.update));
    //                 }
    //             }
    //             break;

    //         case 'column_updated':
    //             if (wsEvent.doctor_remote_id !== this.userId) {
    //                 if (existedData.some(item => item.id === wsEvent.update.id)) {
    //                     store.dispatch(new UpdateColumn(wsEvent.update));
    //                 }
    //             }
    //             break;

    //         case 'column_deleted':
    //             if (wsEvent.doctor_remote_id !== this.userId) {
    //                 const columnToDelete = existedData.find(item => item.id === wsEvent.update);
    //                 if (columnToDelete) {
    //                     store.dispatch(new DeleteColumn(columnToDelete));
    //                 }
    //             }
    //             break;
    //     }
    // }
}
