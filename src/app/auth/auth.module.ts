import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AlertService} from './services/alerts.service';
import {AuthComponent} from './auth.component';
import {AuthService} from './services/auth.service';
import {CommonModule} from '@angular/common';
import {DataColumnsService} from '../data-columns/services/data-columns.service';
import {ForgotPassComponent} from './forgot-pass/forgot-pass.component';
import {HelpPageComponent} from './help-page/help-page.component';
import {HiwPageComponent} from './hiw-page/hiw-page.component';
import {HttpClientModule} from '@angular/common/http';
import {LoginComponent} from './login/login.component';
import {LoginRedirect} from './services/login-redirect.service';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDialogModule} from '@angular/material/dialog';
import {MatStepperModule} from '@angular/material/stepper';
import {NgModule} from '@angular/core';
import {NgSelectModule} from '@ng-select/ng-select';
import {RegistrationComponent} from './registration/registration.component';
import {ResetPassComponent} from './reset-pass/reset-pass.component';
import {RouterModule} from '@angular/router';
import {SharedComponentModule} from '../common/common-share.module';
import {authRouting} from './auth.routing';

@NgModule({
    declarations: [
        AuthComponent,
        LoginComponent,
        RegistrationComponent,
        ForgotPassComponent,
        ResetPassComponent,
        HelpPageComponent,
        HiwPageComponent
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        authRouting,
        SharedComponentModule,
        CommonModule,
        HttpClientModule,
        RouterModule,
        MatStepperModule,
        NgSelectModule,
        MatDialogModule,
        MatCheckboxModule
    ],
    providers: [
        AuthService,
        LoginRedirect,
        AlertService,
        DataColumnsService
    ],
    exports: [
        AuthComponent,
        SharedComponentModule,
        ForgotPassComponent,
        ResetPassComponent
    ]
})
export class AuthModule {
}
