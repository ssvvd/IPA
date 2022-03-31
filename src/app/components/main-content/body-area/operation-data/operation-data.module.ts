import { NgModule  } from '@angular/core';
import {  RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http'
import { HttpClient } from '@angular/common/http';
import { Ng5SliderModule } from 'ng5-slider';
import { NgxSpinnerModule } from "ngx-spinner"; 
import { OperationDataRoutingModule } from './operation-data-routing.module';
import { OperationDataComponent } from './operation-data.component';
import { Shared1Module } from '../../../../shared/shared1.module'; 

/* import { Appdetails59Component } from './input-data-components/appdetails59/appdetails59.component';
import { Appdetails780Component } from './input-data-components/appdetails780/appdetails780.component';
import { Appdetails790Component } from './input-data-components/appdetails790/appdetails790.component';
import { Appdetails77Component } from './input-data-components/appdetails77/appdetails77.component';
import { Appdetails120Component } from './input-data-components/appdetails120/appdetails120.component';
import { Appdetails990Component } from './input-data-components/appdetails990/appdetails990.component';
import { Appdetails890Component } from './input-data-components/appdetails890/appdetails890.component';
import { Appdetails52Component } from './input-data-components/appdetails52/appdetails52.component';
import { Appdetails1Component } from './input-data-components/appdetails1/appdetails1.component';
import { Appdetails51Component } from './input-data-components/appdetails51/appdetails51.component';
import { Appdetails54Component } from './input-data-components/appdetails54/appdetails54.component'; */

import { OptimizetoolFilterExtComponent } from './input-data-components/optimizetool-filter-ext/optimizetool-filter-ext.component';
import { Optimizetool120Component } from './input-data-components/optimizetool120/optimizetool120.component';
import { Optimizetool990Component } from './input-data-components/optimizetool990/optimizetool990.component';
import { Optimizetool52Component } from './input-data-components/optimizetool52/optimizetool52.component';
import { OptimizetoolAdaptortypeComponent } from './input-data-components/optimizetool-adaptortype/optimizetool-adaptortype.component';
import { OptimizetoolComponent } from './input-data-components/optimizetool/optimizetool.component';
import { Optimizetool59Component } from './input-data-components/optimizetool59/optimizetool59.component';
import { OptimizetoolFilterComponent } from './input-data-components/optimizetool-filter/optimizetool-filter.component';
import { Optimizetool800Component } from './input-data-components/optimizetool800/optimizetool800.component';

//const routes: Routes = [{ path: '', component: OperationDataComponent }];

@NgModule({
  declarations: [     
    OperationDataComponent,
    Optimizetool990Component,
     /* Appdetails59Component,     
     Appdetails780Component,
     Appdetails790Component,
     Appdetails77Component,
     Appdetails120Component,
     Appdetails990Component,
     Appdetails890Component,
     Appdetails52Component,
     Appdetails1Component,
     Appdetails51Component,
     Appdetails54Component, */
     Optimizetool52Component,
     OptimizetoolAdaptortypeComponent,
     OptimizetoolComponent,
     Optimizetool59Component,
     OptimizetoolFilterComponent,
  
     OptimizetoolFilterExtComponent,
     Optimizetool120Component,
     Optimizetool800Component
    ],
  imports: [
    Shared1Module,
    OperationDataRoutingModule,
    CommonModule,
    FormsModule,   
    HttpClientModule,
    Ng5SliderModule ,   
    NgxSpinnerModule,
    TranslateModule
    //,
    //,
    //RouterModule.forChild(routes),
    ,TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      },
      extend:true
    }) 
     ,TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }) 
  ]
    ,  
  exports: [RouterModule,TranslateModule,Shared1Module]
})
export class OperationDataModule { }

export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http,'assets/i18n/', '.json');  
}