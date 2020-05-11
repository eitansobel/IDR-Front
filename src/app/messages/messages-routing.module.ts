import { RouterModule, Routes } from '@angular/router';

import { MessagesComponent } from './messages.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
        path: '',
        component: MessagesComponent
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MessagesRoutingModule { }
