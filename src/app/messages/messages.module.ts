import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MESSAGE_REDUCER_TOKEN, getReducers } from './state/reducers';
import { MatCheckboxModule, MatExpansionModule, MatRadioModule } from '@angular/material';

import { ChatComponent } from './chat/chat.component';
import { ChatService } from './services/chat.service';
import { CommonModule } from '@angular/common';
import { CreateMessageComponent } from './create-message/create-message.component';
import { MatListModule } from '@angular/material/list';
import { MessageDialogComponent } from './message-dialog/message-dialog.component';
import { MessageEffectsModules } from './state/effects';
import { MessagesComponent } from './messages.component';
import { MessagesLogComponent } from './messages-log/messages-log.component';
import { MessagesRoutingModule } from './messages-routing.module';
import { NgModule } from '@angular/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgSelectModule } from '@ng-select/ng-select';
import { PatientSearchDialogComponent } from './patient-search-dialog/patient-search-dialog.component';
import { ProviderSearchDialogComponent } from './provider-search-dialog/provider-search-dialog.component';
import { SharedComponentModule } from '../common/common-share.module';
import { SingleMessageComponent } from './chat/single-message/single-message.component';
import { SortPatientsByPipe } from '../pipe/sortPatients.pipe';
import { StoreModule } from '@ngrx/store';
import { WebSocketService } from '../services/websocket.service';
import { MessageService } from './services/message.service';

@NgModule({
    declarations: [
        MessagesComponent,
        ChatComponent,
        CreateMessageComponent,
        SingleMessageComponent,
        MessagesLogComponent,
        MessageDialogComponent,
        PatientSearchDialogComponent,
        ProviderSearchDialogComponent,
    ],
    imports: [
        FormsModule,
        MessagesRoutingModule,
        ReactiveFormsModule,
        CommonModule,
        NgSelectModule,
        NgScrollbarModule,
        MatListModule,
        SharedComponentModule,
        StoreModule.forFeature('message', MESSAGE_REDUCER_TOKEN),
        MessageEffectsModules,
        MatCheckboxModule,
        MatRadioModule,
        MatExpansionModule
    ],
    providers: [
        ChatService,
        MessageService,
        SortPatientsByPipe,
        WebSocketService,
        {
            provide: MESSAGE_REDUCER_TOKEN,
            useFactory: getReducers,
        }
    ],
    exports: [
        MessagesComponent,
        ChatComponent,
        CreateMessageComponent,
        SingleMessageComponent,
        MessagesLogComponent
    ],
    entryComponents: [
        MessageDialogComponent,
        PatientSearchDialogComponent,
        ProviderSearchDialogComponent,
    ]
})
export class MessagesModule { }

