import { RouterModule, Routes } from '@angular/router';

import { EnsureAuthenticated } from './auth/services/ensure-authenticated.service';
import { LoginRedirect } from './auth/services/login-redirect.service';
import { MethodAlertComponent } from './auth/method-alert/method-alert.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
        path: 'auth/set-alerts',
        component: MethodAlertComponent,
        canActivate: [EnsureAuthenticated],
    },
    {
        path: 'auth',
        canActivate: [LoginRedirect],
        loadChildren: './auth/auth.module#AuthModule',

    },
    {
        path: 'dashboard',
        canActivate: [EnsureAuthenticated],
        loadChildren: './dashboard/dashboard.module#DashboardModule',
    },
    {
        path: '**',
        redirectTo: 'dashboard/home',
        canActivate: [EnsureAuthenticated]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
