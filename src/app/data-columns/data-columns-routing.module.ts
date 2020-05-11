import { RouterModule, Routes } from '@angular/router';

import { DataColumnsComponent } from './data-columns.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
        path: '',
        component: DataColumnsComponent
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataColumnsRoutingModule { }
