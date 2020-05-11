import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { DataColumnListComponent } from './data-column-list/data-column-list.component';
import { DataColumnPopupComponent } from './data-column-popup/data-column-popup.component';
import { DataColumnsComponent } from './data-columns.component';
import { DataColumnsRoutingModule } from './data-columns-routing.module';
import { DataColumnsService } from './services/data-columns.service';
import { DataColumnsUpdateIntervalMapService } from './services/data-columns-update-interval-map.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgModule } from '@angular/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDnDModule } from '@swimlane/ngx-dnd';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { SharedComponentModule } from '../common/common-share.module';
import { UserPermissionService } from '../services/user-permission.service';

@NgModule({
    imports: [
        CommonModule,
        DataColumnsRoutingModule,
        SharedComponentModule,
        MatDialogModule,
        NgSelectModule,
        ReactiveFormsModule,
        FormsModule,
        MatListModule,
        MatCheckboxModule,
        MatRadioModule,
        NgScrollbarModule,
        MatSlideToggleModule,
        NgxDnDModule,
        ScrollingModule
    ],
    declarations: [DataColumnsComponent, DataColumnListComponent, DataColumnPopupComponent],
    providers: [
        DataColumnsService, DataColumnsUpdateIntervalMapService, UserPermissionService
    ],
    entryComponents: [DataColumnPopupComponent]
})
export class DataColumnsModule {
}


