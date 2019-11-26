import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts';
//import { ChartsModule } from 'angular-bootstrap-md';

@NgModule({
  imports: [
    CommonModule,
    ChartsModule // <- HERE
  ]
})
export class MachineItemSpindleChartModule { }
