import { RouterModule, Routes } from '@angular/router';

import { FoldersComponent } from './folders/folders.component';
import { HomeComponent } from './home.component';
import { MessagesComponent } from './messages/messages.component';
import { NgModule } from '@angular/core';
import { PatientsByFolderComponent } from './patients-by-folder/patients-by-folder.component';
import { ProvidersComponent } from './providers/providers.component';
import { UpdatesComponent } from './updates/updates.component';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        children: [
            {
                path: 'patients/:patientId/:folderId',
                component: FoldersComponent,
                data: {},
            },
            {
                path: 'patients-by-folder/:patientId',
                component: PatientsByFolderComponent,
                data: {},
            },
            {
                path: 'providers/:patientId/:providerId',
                component: ProvidersComponent,
                data: {}
            },
            {
                path: 'messages/:patientId',
                component: MessagesComponent,
                data: {}
            }
        ]
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeRoutingModule { }

