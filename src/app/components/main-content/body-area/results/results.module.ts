import { NgModule  } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module'; 
import { Shared1Module } from '../../../../shared/shared1.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule} from '@angular/common/http'
import { HttpClient } from '@angular/common/http';
import { Ng5SliderModule } from 'ng5-slider';
import { NgxSpinnerModule } from "ngx-spinner";
import { LazyLoadImageModule } from 'ng-lazyload-image';

import {NgbModule,NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { NgpSortModule } from "ngp-sort-pipe";

import { ResultsRoutingModule } from './results-routing.module';
import { ResultsComponent } from './results.component';
import { ResultsTableComponent } from './results-table/results-table.component';
import { ResFilterComponent } from './res-filter/res-filter.component';
import { PpSelectColumnsComponent } from './pp-select-columns/pp-select-columns.component';
import { ResFilterListComponent } from './res-filter/res-filter-list/res-filter-list.component';
import { ResFilterScrollComponent } from './res-filter/res-filter-scroll/res-filter-scroll.component';
import { MachiningPrmsComponent } from './machining-prms/machining-prms.component';
import { Mp77Component } from './machining-prms/mp77/mp77.component';
import { ProductInfoComponent } from './product-info/product-info.component';
import { InnerTabsTableComponent } from './inner-tabs-table/inner-tabs-table.component';
import { ResultPpDownloadComponent } from './result-pp-download/result-pp-download.component';
import { Mp760Component } from './machining-prms/mp760/mp760.component';
import { ResultPpInventoryComponent } from './result-pp-inventory/result-pp-inventory.component';
import { MpIsoTurningComponent } from './machining-prms/mp-iso-turning/mp-iso-turning.component';
import { MpIsoTurningAxRaComponent } from './machining-prms/mp-iso-turning-ax-ra/mp-iso-turning-ax-ra.component';
import { MpTurnGrooveComponent } from './machining-prms/mp-turn-groove/mp-turn-groove.component';
import { ResultItemInfoComponent } from './result-item-info/result-item-info.component';
import { PpPromotionComponent } from './pp-promotion/pp-promotion.component';
import { MpThreadingComponent } from './machining-prms/mp-threading/mp-threading.component';
import { DataTablesModule } from 'angular-datatables';
import { PostprocessorComponent } from './postprocessor/postprocessor.component';


@NgModule({
  declarations: [       
    ResultsComponent,
    ResultsTableComponent,
    ResFilterComponent,
    PpSelectColumnsComponent,
    ResFilterListComponent,
    ResFilterScrollComponent,
    MachiningPrmsComponent,
    ProductInfoComponent,
    Mp77Component,
    InnerTabsTableComponent,
    ResultPpDownloadComponent,
    Mp760Component,
    ResultPpInventoryComponent,
    MpIsoTurningComponent,
    MpIsoTurningAxRaComponent,
    MpTurnGrooveComponent,
    //ResultsPdfComponent,
    ResultItemInfoComponent,
    //ResultsPdfComponent,
    PpPromotionComponent,
    MpThreadingComponent,
    PostprocessorComponent
  ],
 
  imports: [
    LazyLoadImageModule,
    SharedModule,Shared1Module,
    DataTablesModule,
    ResultsRoutingModule,    
    NgbModule,
    NgpSortModule,
    CommonModule,
    FormsModule,   
    ReactiveFormsModule,
    HttpClientModule,
    Ng5SliderModule , 
    NgxSpinnerModule,   
    TranslateModule 
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
  exports: [RouterModule,TranslateModule,SharedModule,Shared1Module] ,
  providers: [ NgbActiveModal], 
})
export class ResultsModule { }

export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http,'assets/i18n/', '.json');  
}