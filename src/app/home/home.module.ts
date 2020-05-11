import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HOME_REDUCER_TOKEN, getReducers } from './state/reducers';
import { MatButtonToggleModule, MatExpansionModule, MatIconModule, MatRadioModule } from '@angular/material';

import { ApiFactory } from '../services/api.factory';
import { CommonModule } from '@angular/common';
import { DataColumnsService } from '../data-columns/services/data-columns.service';
import { DataColumnsUpdateIntervalMapService } from '../data-columns/services/data-columns-update-interval-map.service';
import { EditCellPopupComponent } from './edit-cell-popup/edit-cell-popup.component';
import { FoldersComponent } from './folders/folders.component';
import { FoldersService } from './services/folders.service';
import { HomeComponent } from './home.component';
import { HomeEffectsModules } from './state/effects';
import { HomeRoutingModule } from './home-routing.module';
import { HomeService } from './services/home.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MessageDialogComponent } from '../messages/message-dialog/message-dialog.component';
import { MessagesComponent } from './messages/messages.component';
import { MessagesModule } from '../messages/messages.module';
import { NgModule } from '@angular/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgSelectModule } from '@ng-select/ng-select';
import { PatientsByFolderComponent } from './patients-by-folder/patients-by-folder.component';
import { PatientsComponent } from './patients/patients.component';
import { PatientsModule } from '../patients/patients.module';
import { ProvidersComponent } from './providers/providers.component';
import { SharedComponentModule } from '../common/common-share.module';
import { SortPatientPopupComponent } from './sort-patient-popup/sort-patient-popup.component';
import { SortPatientsByPipe } from '../pipe/sortPatients.pipe';
import { StoreModule } from '@ngrx/store';
import { UpdateDialogComponent } from './update-dialog/update-dialog.component';
import { UpdatesComponent } from './updates/updates.component';
import { UserPermissionService } from '../services/user-permission.service';

@NgModule({
    imports: [
        CommonModule,
        SharedComponentModule,
        HomeRoutingModule,
        MatDialogModule,
        NgSelectModule,
        ReactiveFormsModule,
        FormsModule,
        MatListModule,
        MatCheckboxModule,
        MatIconModule,
        MatButtonToggleModule,
        NgScrollbarModule,
        MatSlideToggleModule,
        MatRadioModule,
        MessagesModule,
        MatTableModule,
        PatientsModule,
        MatExpansionModule,
        StoreModule.forFeature('home', HOME_REDUCER_TOKEN),
        HomeEffectsModules
    ],
    declarations: [
        HomeComponent,
        EditCellPopupComponent,
        SortPatientPopupComponent,
        FoldersComponent,
        UpdatesComponent,
        ProvidersComponent,
        PatientsByFolderComponent,
        PatientsComponent,
        MessagesComponent,
        UpdateDialogComponent,
        SortPatientsByPipe
    ],
    providers: [
        HomeService,
        SortPatientsByPipe,
        FoldersService,
        ApiFactory,
        DataColumnsService,
        UserPermissionService,
        DataColumnsUpdateIntervalMapService,
        {
            provide: HOME_REDUCER_TOKEN,
            useFactory: getReducers,
        },
    ],
    exports: [],
    entryComponents: [
        EditCellPopupComponent,
        SortPatientPopupComponent,
        UpdateDialogComponent,
        MessageDialogComponent,
    ]
})
export class HomeModule {
}
