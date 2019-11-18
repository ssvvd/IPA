import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    ChartsModule
  ],
  imports: [
    CommonModule,
    ChartsModule // <- HERE
  ]
})
export class MachineItemSpindleChartModule { }
