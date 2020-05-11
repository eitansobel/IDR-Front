import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { STAFF_REDUCER_TOKEN, getReducers } from './state/reducers';

import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MultyUploadComponent } from './multyupload/multyupload.component';
import { NewMemberComponent } from './new-member/new-member.component';
import { NewStaffListComponent } from './new-staff-list/new-staff-list.component';
import { Ng4FilesModule } from './../ng4-files';
import { NgModule } from '@angular/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgSelectModule } from '@ng-select/ng-select';
import { OrderPipe } from '../pipe/orderBy.pipe';
import { ProfileModule } from '../profile/profile.module';
import { SharedComponentModule } from '../common/common-share.module';
import { StaffComponent } from './staff.component';
import { StaffEffectsModules } from './state/effects';
import { StaffRoutingModule } from './staff-routing.module';
import { StaffService } from './service/staff.service';
import { StoreModule } from '@ngrx/store';
import { ViewProfileComponent } from './view-profile/view-profile.component';

@NgModule({
    declarations: [
        StaffComponent,
        NewMemberComponent,
        NewStaffListComponent,
        ViewProfileComponent,
        MultyUploadComponent
    ],
    imports: [
        CommonModule,
        StaffRoutingModule,
        SharedComponentModule,
        MatDialogModule,
        NgSelectModule,
        ReactiveFormsModule,
        FormsModule,
        MatListModule,
        MatCheckboxModule,
        NgScrollbarModule,
        Ng4FilesModule,
        MatStepperModule,
        MatTableModule,
        MatSortModule,
        MatFormFieldModule,
        MatMenuModule,
        StoreModule.forFeature('staff', STAFF_REDUCER_TOKEN),
        StaffEffectsModules,
        ProfileModule
    ],
    providers: [
        {
            provide: STAFF_REDUCER_TOKEN,
            useFactory: getReducers,
        },
        StaffService
    ],
    exports: [],
    entryComponents: [
        NewMemberComponent,
        NewStaffListComponent,
        ViewProfileComponent,
        MultyUploadComponent
    ]
})
export class StaffModule { }


