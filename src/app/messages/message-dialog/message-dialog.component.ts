import * as fromMessages from '../state/';

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { MessageDialogData, MessageDialogResult, MessageDialogType } from '../models/message-dialog-data';
import { PatientSearchDialog, ProviderSearchDialog } from '../state/actions/message.actions';
import { Store, select } from '@ngrx/store';
import { map, tap } from 'rxjs/operators';

import { ChatMessage } from 'src/app/models/chat';
import { NgOption } from '@ng-select/ng-select';
import { Patient } from 'src/app/models/patient';
import { Profile } from 'src/app/models/profile';
import { State } from '../state/reducers';

@Component({
    selector: 'idr-message-dialog',
    templateUrl: './message-dialog.component.html',
    styleUrls: ['./message-dialog.component.scss']
})
export class MessageDialogComponent implements OnInit {
    public form: FormGroup;
    public headerText = '';
    providers: NgOption[] = [];
    patients: NgOption[] = [];
    formSubmitted = false;

    public providers$ = this.store.pipe(
        select(fromMessages.getProviders),
        map((people: Profile[]) => {
            return people.map(person => ({
                id: person.id,
                name: person.first_name + ' ' + person.last_name
            }));
        })
    );

    public patients$ = this.store.pipe(
        select(fromMessages.getPatients),
        map((people: Patient[]) => {
            return people.map(person => ({
                id: person.remote_id, // remote_id
                name: person.first_name + ' ' + person.last_name
            }));
        })
    );

    public selectedPatient$ = this.store.pipe(
        select(fromMessages.getSelectedPatient)
    );

    public selectedProvider$ = this.store.pipe(
        select(fromMessages.getSelectedProvider)
    );

    public important = false;
    public notify_unseen = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: MessageDialogData,
        public dialogRef: MatDialogRef<MessageDialogComponent>,
        private fb: FormBuilder,
        private store: Store<State>,
    ) {
        this.headerText = data.headerText;
    }

    ngOnInit() {
        this.form = this.fb.group({
            provider: [null, [Validators.required]],
            patient: [null, [Validators.required]],
            subject: [null, [Validators.required]],
            message: [null, [Validators.required]],
            flagged: [false],
            notify_unseen: [false] // TODO: Determine usage
        });

        if (this.data.chat) {
            this.form.get('patient').patchValue(this.data.chat.patient);
        }

        if (this.data.message) {
            if (this.data.messageType === MessageDialogType.Reply) {
                this.form.get('provider').patchValue(this.data.message.sender);
                this.form.get('subject').patchValue('RE: ' + this.data.message.subject);
            }
            if (this.data.messageType === MessageDialogType.Forward) {
                this.form.get('subject').patchValue('FW: ' + this.data.message.subject);
            }
            this.form.get('message').patchValue(this.data.message.text);
            this.form.get('flagged').patchValue(this.data.message.flagged);
            this.form.get('notify_unseen').patchValue(false); // TODO: Determine usage
        }
        // this.selectedPatient$.subscribe(person => {
        //     this.form.get('patient').patchValue(person ? person.id : null);
        // });

        // this.selectedProvider$.subscribe(person => {
        //     this.form.get('provider').patchValue(person ? person.id : null);
        // });
    }

    addToArray(event) {
    }

    update(event) {

    }

    removeFromArray() {

    }

    public searchProvider() {
        this.store.dispatch(new ProviderSearchDialog({}));
    }

    public searchPatient() {
        this.store.dispatch(new PatientSearchDialog({}));
    }

    public ok() {
        if (this.form.valid) {

            const result = new MessageDialogResult();

            result.patient = this.form.value.patient;
            result.provider = this.form.value.provider;
            result.participants = [this.form.value.provider];
            result.subject = this.form.value.subject;
            result.text = this.form.value.message;
            result.flagged = this.form.value.flagged;
            result.messageType = this.data.messageType;

            if (this.data.messageType === MessageDialogType.Reply ||
                this.data.messageType === MessageDialogType.Forward) {
                if (this.data.chat) {
                    result.chat = this.data.chat.id;
                }
                result.reply_for = this.data.message.id;
            }

            this.dialogRef.close(result);
        }
    }
    public close() {
        this.dialogRef.close();
    }
}
