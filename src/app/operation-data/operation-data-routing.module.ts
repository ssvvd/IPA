import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OperationDataComponent } from './operation-data.component';

const routes: Routes = [{ path: '', component: OperationDataComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperationDataRoutingModule { }
