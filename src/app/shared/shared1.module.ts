import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Appdetails59Component } from './../components/main-content/body-area/operation-data/input-data-components/appdetails59/appdetails59.component';
import { Appdetails780Component } from './../components/main-content/body-area/operation-data/input-data-components/appdetails780/appdetails780.component';
import { Appdetails790Component } from './../components/main-content/body-area/operation-data/input-data-components/appdetails790/appdetails790.component';
import { Appdetails77Component } from './../components/main-content/body-area/operation-data/input-data-components/appdetails77/appdetails77.component';
import { Appdetails120Component } from './../components/main-content/body-area/operation-data/input-data-components/appdetails120/appdetails120.component';
import { Appdetails990Component } from './../components/main-content/body-area/operation-data/input-data-components/appdetails990/appdetails990.component';
import { Appdetails890Component } from './../components/main-content/body-area/operation-data/input-data-components/appdetails890/appdetails890.component';
import { Appdetails52Component } from './../components/main-content/body-area/operation-data/input-data-components/appdetails52/appdetails52.component';
import { Appdetails1Component } from './../components/main-content/body-area/operation-data/input-data-components/appdetails1/appdetails1.component';
import { Appdetails51Component } from './../components/main-content/body-area/operation-data/input-data-components/appdetails51/appdetails51.component';
import { Appdetails54Component } from './../components/main-content/body-area/operation-data/input-data-components/appdetails54/appdetails54.component';

import { Ng5SliderModule } from 'ng5-slider';
import { DataTablesModule } from 'angular-datatables';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
@NgModule({
  declarations: [
    Appdetails59Component,     
     Appdetails780Component,
     Appdetails790Component,
     Appdetails77Component,
     Appdetails120Component,
     Appdetails990Component,
     Appdetails890Component,
     Appdetails52Component,
     Appdetails1Component,
     Appdetails51Component,
     Appdetails54Component
    ],
    exports: [
      Appdetails59Component,     
     Appdetails780Component,
     Appdetails790Component,
     Appdetails77Component,
     Appdetails120Component,
     Appdetails990Component,
     Appdetails890Component,
     Appdetails52Component,
     Appdetails1Component,
     Appdetails51Component,
     Appdetails54Component
      ],
  imports: [  
    DataTablesModule,
    Ng5SliderModule ,
    CommonModule,
    FormsModule,    
    RouterModule,
   
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),
  ]
})
export class Shared1Module { }

export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http,'assets/i18n/', '.json');  
} 

