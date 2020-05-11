import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { homePatientReducer, homePatientsReducer, nestedColumnsReducer } from './redux/home/home.reducer';

import { AddAlertComponent } from './auth/method-alert/add-alert/add-alert.component';
import { ApiFactory } from './services/api.factory';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthService } from './auth/services/auth.service';
import { AvatarService } from './services/avatar.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { ChatService } from './messages/services/chat.service';
import { EffectsModule } from '@ngrx/effects';
import { EnsureAuthenticated } from './auth/services/ensure-authenticated.service';
import { HelpService } from './services/help.service';
import { HospitalDepartmentService } from './services/hospital.structure.service';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { LoginRedirect } from './auth/services/login-redirect.service';
import { MatCheckboxModule } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { MethodAlertComponent } from './auth/method-alert/method-alert.component';
import { NgModule } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { NotifyService } from './services/notify.service';
import { PapaParseModule } from 'ngx-papaparse';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from './common/common-share.module';
import { StaffService } from './staff/service/staff.service';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { TokenInterceptor } from './auth/token.interceptor';
import { UpdatesService } from './home/services/updates.service';
import { WebSocketService } from './services/websocket.service';
import { alertsReducer } from './redux/alerts/alerts.reducer';
import { dataColumnsReducer } from './redux/dataColumns/data-column.reducer';
import { departmentReducer } from './redux/departments/department.reducer';
import { environment } from 'src/environments/environment';
import { hospitalReducer } from './redux/hospitals/hospital.reducer';
import { memberPhotoReducer } from './redux/memberPhoto/memberPhoto.reducer';
import { membersReducer } from './redux/members/members.reducer';
import { patReducer } from './redux/patientsList/patientsList.reducer';
import { patientsReducer } from './redux/patients/patients.reducer';
import { profileReducer } from './redux/profile/profile.reducer';
import { roleReducer } from './redux/roles/role.reducer';
import { staffReducer } from './redux/staff/staff.reducer';
import { tokenStatusReducer } from './redux/token-status/token-status.reducer';

const customNotifierOptions: NotifierOptions = {
    position: {
        horizontal: {
            position: 'middle',
            distance: 12
        },
        vertical: {
            position: 'top',
            distance: 12,
            gap: 10
        }
    },
    theme: 'material',
    behaviour: {
        autoHide: 8000,
        onClick: false,
        onMouseover: 'pauseAutoHide',
        showDismissButton: true,
        stacking: 4
    },
    animations: {
        enabled: true,
        show: {
            preset: 'slide',
            speed: 300,
            easing: 'ease'
        },
        hide: {
            preset: 'fade',
            speed: 300,
            easing: 'ease',
            offset: 50
        },
        shift: {
            speed: 300,
            easing: 'ease'
        },
        overlap: 150
    }
};

@NgModule({
    declarations: [
        AppComponent,
        MethodAlertComponent,
        AddAlertComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        SharedComponentModule,
        ReactiveFormsModule,
        FormsModule,
        MatCheckboxModule,
        MatDialogModule,
        HttpClientModule,
        RouterModule,
        NgSelectModule,
        PapaParseModule,
        LoadingBarModule,
        LoadingBarHttpClientModule,
        LoadingBarRouterModule,
        NotifierModule.withConfig(customNotifierOptions),
        StoreModule.forRoot(
            {
                alertPage: alertsReducer,
                alertSingle: alertsReducer,
                departmentPage: departmentReducer,
                rolesPage: roleReducer,
                hospitalsPage: hospitalReducer,
                profilePage: profileReducer,
                staffPage: staffReducer,
                membersPage: membersReducer,
                membersPhoto: memberPhotoReducer,
                patientsPage: patientsReducer,
                patListPage: patReducer,
                dataColumnPage: dataColumnsReducer,
                nestedColumnsPage: nestedColumnsReducer,
                tokenStatus: tokenStatusReducer,
                // homePatientsPage: homePatientReducer, TODO: OBSOLETE: Check dependencies and remove
                homePatientsPage: homePatientsReducer,
            }
        ),
        !environment.production ? StoreDevtoolsModule.instrument() : [],
        EffectsModule.forRoot([]),
        StoreDevtoolsModule,
    ],
    providers: [
        AuthService,
        EnsureAuthenticated,
        UpdatesService,
        HospitalDepartmentService,
        ApiFactory,
        AvatarService,
        LoginRedirect,
        TokenInterceptor,
        HelpService,
        NotifyService,
        ChatService,
        WebSocketService,
        StaffService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        },
    ],
    bootstrap: [AppComponent],
    exports: [RouterModule, MethodAlertComponent],
    entryComponents: [
        AddAlertComponent
    ]
})
export class AppModule { }
