import {RouterModule, Routes} from '@angular/router';

import {DashboardComponent} from './dashboard.component';
import {MessagesComponent} from '../messages/messages.component';
import {ProfileComponent} from '../profile/profile.component';

// import {DataColumnsComponent} from '../data-columns/data-columns.component';
// import {StaffComponent} from '../staff/staff.component';
// import {HomeComponent} from '../home/home.component';
// import {PatientsComponent} from '../patients/patients.component';

const dashboardRoutes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        children: [
            {
                path: 'home',
                loadChildren: '../home/home.module#HomeModule',
            },
            {
                path: 'messages',
                loadChildren: '../messages/messages.module#MessagesModule',
            },
            {
                // TODO: Rename to update-folders
                path: 'data-columns',
                loadChildren: '../data-columns/data-columns.module#DataColumnsModule',
            },
            {
                path: 'profile',
                loadChildren: '../profile/profile.module#ProfileModule',
            },
            {
                path: 'staff',
                loadChildren: '../staff/staff.module#StaffModule',
            },
            {
                path: 'patients',
                loadChildren: '../patients/patients.module#PatientsModule',
            },
        ]
    },

];

export const dashboardRouting = RouterModule.forChild(dashboardRoutes);
