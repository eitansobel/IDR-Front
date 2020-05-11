import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HasIdPipe, PatientsComponent } from '../patients/patients.component';
import { MatMenuModule, MatSlideToggleModule } from '@angular/material';
import { PATIENTS_REDUCER_TOKEN, getReducers } from './state/reducers';

import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MultyUploadComponent } from './multyupload/multyupload.component';
import { NewMemberComponent } from './new-member/new-member.component';
import { NewPatListComponent } from './new-pat-list/new-pat-list.component';
import { Ng4FilesModule } from './../ng4-files';
import { NgModule } from '@angular/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgSelectModule } from '@ng-select/ng-select';
import { OrderPipe } from '../pipe/orderBy.pipe';
import { PatientsEffectsModules } from './state/effects';
import { PatientsRoutingModule } from './patients-routing.module';
import { PatientsService } from './services/patients.service';
import { SharedComponentModule } from '../common/common-share.module';
import { StoreModule } from '@ngrx/store';
import { ViewPatientProfileComponent } from './view-profile/view-profile.component';

@NgModule({
    declarations: [
        PatientsComponent,
        NewMemberComponent,
        NewPatListComponent,
        ViewPatientProfileComponent,
        MultyUploadComponent,
        HasIdPipe,
        OrderPipe
    ],
    imports: [
        CommonModule,
        PatientsRoutingModule,
        SharedComponentModule,
        NgScrollbarModule,
        Ng4FilesModule,
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule,
        MatListModule,
        NgSelectModule,
        MatCheckboxModule,
        MatStepperModule,
        MatTableModule,
        MatSortModule,
        MatSlideToggleModule,
        MatMenuModule,
        StoreModule.forFeature('patients', PATIENTS_REDUCER_TOKEN),
        PatientsEffectsModules
    ],
    providers: [
        {
            provide: PATIENTS_REDUCER_TOKEN,
            useFactory: getReducers,
        },
        PatientsService
    ],
    exports: [ViewPatientProfileComponent],
    entryComponents: [
        NewMemberComponent,
        NewPatListComponent,
        ViewPatientProfileComponent,
        MultyUploadComponent
    ]
})
export class PatientsModule { }
