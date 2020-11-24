import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { MachineItemComponent } from './../components/main-content/body-area/machines/machine-item/machine-item.component';
import { MachinesListComponent } from './../components/main-content/body-area/machines/machines-list/machines-list.component';
import { MachineItemSpindleComponent } from './../components/main-content/body-area/machines/machine-item-spindle/machine-item-spindle.component';
import { MachineItemSpindleChartComponent } from './../components/main-content/body-area/machines/machine-item-spindle-chart/machine-item-spindle-chart.component';
import { MachineItemSpindleChartModule } from './../components/main-content/body-area/machines/machine-item-spindle-chart/machine-item-spindle-chart.module';
import { MachinesFilterComponent } from './../components/main-content/body-area/machines/machines-filter/machines-filter.component';
import { Ng5SliderModule } from 'ng5-slider';
import { DataTablesModule } from 'angular-datatables';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

@NgModule({
  declarations: [
    MachineItemComponent,
    MachinesListComponent,
    MachineItemComponent,  
    MachineItemSpindleComponent,
    MachineItemSpindleChartComponent,
    MachinesFilterComponent
    ],
    exports: [
      MachineItemComponent,
      MachinesListComponent,
      MachineItemComponent,  
      MachineItemSpindleComponent,
      MachineItemSpindleChartComponent,
      MachinesFilterComponent
      ],
  imports: [
    LazyLoadImageModule,
    DataTablesModule,
    Ng5SliderModule ,
    CommonModule,
    FormsModule,    
    RouterModule,
    MachineItemSpindleChartModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),
  ]
})
export class SharedModule { }

export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http,'assets/i18n/', '.json');  
} 

