import { AuthService } from '../auth/services/auth.service';
import { ChatService } from '../messages/services/chat.service';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { FormsModule } from '@angular/forms';
import { LogoutComponent } from './logout/logout.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgModule } from '@angular/core';
import { PatientsService } from '../patients/services/patients.service';
import { ProfileService } from '../profile/service/profile.service';
import { SharedComponentModule } from '../common/common-share.module';
import { dashboardRouting } from './dashboard.routing';

// import { DataColumnsModule } from '../data-columns/data-columns.module';
// import { HomeModule } from '../home/home.module';
// import { MessagesModule } from '../messages/messages.module';
// import { PatientsModule } from '../patients/patients.module';
// import { ProfileModule } from '../profile/profile.module';
// import { StaffModule } from '../staff/staff.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        dashboardRouting,
        // ProfileModule,
        MatSlideToggleModule,
        // StaffModule,
        SharedComponentModule,
        MatDialogModule,
        MatIconModule,
        // PatientsModule,
        // MessagesModule,
        // DataColumnsModule,
    ],
    declarations: [
        DashboardComponent,
        LogoutComponent,
    ],

    providers: [
        AuthService,
        ProfileService,
        ChatService,
        PatientsService
    ],
    exports: [],
    entryComponents: [LogoutComponent]
})
export class DashboardModule {
}
