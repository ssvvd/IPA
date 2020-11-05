import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OperationDataRoutingModule } from './operation-data-routing.module';
import { OperationDataComponent } from './operation-data.component';


@NgModule({
  declarations: [OperationDataComponent],
  imports: [
    CommonModule,
    OperationDataRoutingModule
  ]
})
export class OperationDataModule { }
