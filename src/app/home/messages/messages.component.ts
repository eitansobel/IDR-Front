import * as fromHome from '../state';

import { Component, OnInit } from '@angular/core';
import { LoadMessages, MessageDialog } from '../state/actions/home.actions';
import { MessageDialogData, MessageDialogType } from 'src/app/messages/models/message-dialog-data';
import { Store, select } from '@ngrx/store';

import { State } from '../state/reducers';

@Component({
    selector: 'idr-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
    public title: string;
    public search: string;
    public messages$ = this.store.pipe(select(fromHome.getMessages));
    public itemToSelect = null;
    constructor(
        private store: Store<State>,
    ) {
    }

    ngOnInit() {
        this.store.dispatch(new LoadMessages());
    }
    // NEW FUNCTIONALITY

    createMessage() {
        this.openMessage('New Message', MessageDialogType.New);
    }

    replyMessage() {
        this.openMessage('Reply', MessageDialogType.Reply);
    }

    forwardMessage() {
        this.openMessage('Forward', MessageDialogType.Forward);
    }

    openMessage(header: string, type: MessageDialogType, message: any = null) {
        const data = new MessageDialogData(header, type, message)
        this.store.dispatch(new MessageDialog(data));
    }

    public isExpanded(item: any) {
        return this.itemToSelect && this.itemToSelect.id === item.id;
    }
    public closeOtherPanels(msg: any) {

    }
    public folderOpened(msg: any) {

    }
    public folderClosed(msg: any) {

    }
    public folderClicked(item: any, event: Event) {
        event.preventDefault();
        event.stopPropagation();
        if (this.itemToSelect && this.itemToSelect.id === item.id) {
            this.itemToSelect = null;
            //this.store.dispatch(new SelectFolder(null));
        } else {
            this.itemToSelect = item; // new DataColumn(
            //this.store.dispatch(new SelectFolder(item));
            //this.navigateToFolderId(item ? item.id : 0);
        }
    }
    public getIconByType(type) {
        switch (type) {
            case 1:
                return 'icon-message-arrow-down';
            case 2:
                return 'icon-message-arrow-up';
            default:
                return 'icon-message-arrow-down';
        }
    }
}
