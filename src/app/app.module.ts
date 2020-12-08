import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule} from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClient } from '@angular/common/http';
import { DataTablesModule } from 'angular-datatables';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';



import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MachiningOperationComponent } from './components/main-content/body-area/machining-operation/machining-operation.component';
import { MainContentComponent } from './components/main-content/main-content.component';

//import { SafePipeModule } from 'safe-pipe';
/* import * as $ from "jquery"; */
//import { OperationDataComponent } from './components/main-content/body-area/operation-data/operation-data.component' //./components/main-content/body-area/operation-data/operation-data.component';
/* import { MachinesListComponent } from './components/main-content/body-area/machines/machines-list/machines-list.component';
import { MachineItemComponent } from './components/main-content/body-area/machines/machine-item/machine-item.component';
import { MachineItemSpindleComponent } from './components/main-content/body-area/machines/machine-item-spindle/machine-item-spindle.component';
import { MachineItemSpindleChartComponent } from './components/main-content/body-area/machines/machine-item-spindle-chart/machine-item-spindle-chart.component';
import { MachineItemSpindleChartModule } from './components/main-content/body-area/machines/machine-item-spindle-chart/machine-item-spindle-chart.module';
import { MachinesFilterComponent } from './components/main-content/body-area/machines/machines-filter/machines-filter.component';
 */

import { MainMenuComponent } from './components/main-content/main-menu/main-menu.component';
import { FormsModule } from '@angular/forms'; 
import { ReactiveFormsModule } from '@angular/forms';
import { Ng5SliderModule } from 'ng5-slider';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

/* import { MaterialsComponent } from './components/main-content/body-area/materials/materials.component';
import { MatMainTableComponent } from './components/main-content/body-area/materials/mat-main-table/mat-main-table.component';
import { MatDetailsComponent } from './components/main-content/body-area/materials/mat-details/mat-details.component';
import { MatStandardTableComponent } from './components/main-content/body-area/materials/mat-standard-table/mat-standard-table.component';
import { PpAddFavoritComponent } from './components/main-content/body-area/materials/pp-add-favorit/pp-add-favorit.component';
import { PpRequestMaterialComponent } from './components/main-content/body-area/materials/pp-request-material/pp-request-material.component';
import { PpEditParamsComponent } from './components/main-content/body-area/materials/pp-edit-params/pp-edit-params.component';
import { PpSetDefaultComponent } from './components/main-content/body-area/materials/pp-set-default/pp-set-default.component';
import { HardnessSliderComponent } from './components/main-content/body-area/materials/hardness-slider/hardness-slider.component';
import { MatSearchComponent } from './components/main-content/body-area/materials/mat-search/mat-search.component';
import { MyMaterialsComponent } from './components/main-content/body-area/materials/my-materials/my-materials.component';
import { MatFilterComponent } from './components/main-content/body-area/materials/mat-filter/mat-filter.component'; */

/* import { Appdetails59Component } from './components/main-content/body-area/operation-data/input-data-components/appdetails59/appdetails59.component';
import { Appdetails780Component } from './components/main-content/body-area/operation-data/input-data-components/appdetails780/appdetails780.component';
import { Appdetails790Component } from './components/main-content/body-area/operation-data/input-data-components/appdetails790/appdetails790.component';
import { Appdetails77Component } from './components/main-content/body-area/operation-data/input-data-components/appdetails77/appdetails77.component';
import { Appdetails120Component } from './components/main-content/body-area/operation-data/input-data-components/appdetails120/appdetails120.component';
import { Appdetails990Component } from './components/main-content/body-area/operation-data/input-data-components/appdetails990/appdetails990.component';
import { Appdetails890Component } from './components/main-content/body-area/operation-data/input-data-components/appdetails890/appdetails890.component';
import { Appdetails52Component } from './components/main-content/body-area/operation-data/input-data-components/appdetails52/appdetails52.component';
import { Appdetails1Component } from './components/main-content/body-area/operation-data/input-data-components/appdetails1/appdetails1.component';
import { Appdetails51Component } from './components/main-content/body-area/operation-data/input-data-components/appdetails51/appdetails51.component';
import { Appdetails54Component } from './components/main-content/body-area/operation-data/input-data-components/appdetails54/appdetails54.component';
import { OptimizetoolFilterExtComponent } from './components/main-content/body-area/operation-data/input-data-components/optimizetool-filter-ext/optimizetool-filter-ext.component';
import { Optimizetool120Component } from './components/main-content/body-area/operation-data/input-data-components/optimizetool120/optimizetool120.component';
import { Optimizetool990Component } from './components/main-content/body-area/operation-data/input-data-components/optimizetool990/optimizetool990.component';
import { Optimizetool52Component } from './components/main-content/body-area/operation-data/input-data-components/optimizetool52/optimizetool52.component';
import { OptimizetoolAdaptortypeComponent } from './components/main-content/body-area/operation-data/input-data-components/optimizetool-adaptortype/optimizetool-adaptortype.component';
import { OptimizetoolComponent } from './components/main-content/body-area/operation-data/input-data-components/optimizetool/optimizetool.component';
import { Optimizetool59Component } from './components/main-content/body-area/operation-data/input-data-components/optimizetool59/optimizetool59.component';
import { OptimizetoolFilterComponent } from './components/main-content/body-area/operation-data/input-data-components/optimizetool-filter/optimizetool-filter.component';
 */

import { HomeComponent } from './components/home/home.component';
import { NgxSpinnerModule } from "ngx-spinner"; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgpSortModule } from "ngp-sort-pipe";
import { MachinePpAddFavoriteComponent } from './components/main-content/body-area/machines/machine-pp-add-favorite/machine-pp-add-favorite.component';
import { MachinesPpLoginComponent } from './components/main-content/body-area/machines/machines-pp-login/machines-pp-login.component';

/*import { ResultsComponent } from './components/main-content/body-area/results/results.component';
import { ResultsTableComponent } from './components/main-content/body-area/results/results-table/results-table.component';
import { ResFilterComponent } from './components/main-content/body-area/results/res-filter/res-filter.component';
import { PpSelectColumnsComponent } from './components/main-content/body-area/results/pp-select-columns/pp-select-columns.component';
import { ResFilterListComponent } from './components/main-content/body-area/results/res-filter/res-filter-list/res-filter-list.component';
import { ResFilterScrollComponent } from './components/main-content/body-area/results/res-filter/res-filter-scroll/res-filter-scroll.component';
import { MachiningPrmsComponent } from './components/main-content/body-area/results/machining-prms/machining-prms.component';
import { Mp77Component } from './components/main-content/body-area/results/machining-prms/mp77/mp77.component';
import { ProductInfoComponent } from './components/main-content/body-area/results/product-info/product-info.component';
import { InnerTabsTableComponent } from './components/main-content/body-area/results/inner-tabs-table/inner-tabs-table.component';
import { ResultPpDownloadComponent } from './components/main-content/body-area/results/result-pp-download/result-pp-download.component';
import { Mp760Component } from './components/main-content/body-area/results/machining-prms/mp760/mp760.component';
import { ResultPpInventoryComponent } from './components/main-content/body-area/results/result-pp-inventory/result-pp-inventory.component';
import { MpIsoTurningComponent } from './components/main-content/body-area/results/machining-prms/mp-iso-turning/mp-iso-turning.component';
import { MpIsoTurningAxRaComponent } from './components/main-content/body-area/results/machining-prms/mp-iso-turning-ax-ra/mp-iso-turning-ax-ra.component';
import { MpTurnGrooveComponent } from './components/main-content/body-area/results/machining-prms/mp-turn-groove/mp-turn-groove.component';
import { ResultsPdfComponent } from './components/main-content/body-area/results/results-pdf/results-pdf.component';
import { ResultItemInfoComponent } from './components/main-content/body-area/results/result-item-info/result-item-info.component';
import { PpPromotionComponent } from './components/main-content/body-area/results/pp-promotion/pp-promotion.component';
import { MpThreadingComponent } from './components/main-content/body-area/results/machining-prms/mp-threading/mp-threading.component';
 */

import { HeaderPpUnitsComponent } from './components/header/header-pp-units/header-pp-units.component';
import { PpSuccessfullyComponent } from './components/maintenance/pp-successfully/pp-successfully.component';
import { ContactusComponent } from './components/maintenance/contactus/contactus.component';
import { FeedbackComponent } from './components/maintenance/feedback/feedback.component';


@NgModule({
  declarations: [   
    AppComponent,   
    
    HeaderComponent,
    FooterComponent,

   /*  GlobalMenuComponent,
    SubMenuComponent, */

/*     MaterialsComponent,
    MatFilterComponent,
    MatMainTableComponent,
    MatDetailsComponent,
    MatStandardTableComponent,
    PpAddFavoritComponent,
    PpRequestMaterialComponent,
    PpEditParamsComponent,
    PpSetDefaultComponent,    
    HardnessSliderComponent,
    MatSearchComponent,
    MyMaterialsComponent, */

    //OperationDataComponent,

    MachiningOperationComponent,
    MainContentComponent,
/*  MachinesListComponent,
    MachineItemComponent,
        
    MachineItemSpindleComponent,
    MachineItemSpindleChartComponent,
    MachinesFilterComponent, */
    HomeComponent,
    MachinePpAddFavoriteComponent,
    MainMenuComponent,
 /*    ResultsComponent,
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
    ResultsPdfComponent,
    ResultItemInfoComponent,
    ResultsPdfComponent,
    PpPromotionComponent,
    MpThreadingComponent, */

    
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
    Appdetails54Component,  
    OptimizetoolComponent,
    OptimizetoolFilterExtComponent,
    Optimizetool120Component,    
    Optimizetool990Component,
    Optimizetool52Component,
    OptimizetoolAdaptortypeComponent,
    Optimizetool59Component,
    OptimizetoolFilterComponent, */
   
    MachinesPpLoginComponent,    
    HeaderPpUnitsComponent,
    PpSuccessfullyComponent,
    ContactusComponent,
    FeedbackComponent,
    
  ],
  exports:[SharedModule],
  imports: [
  
    SharedModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    DataTablesModule,
    //MachineItemSpindleChartModule ,
    Ng5SliderModule ,
    NgbModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    NgpSortModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),
  ],
  entryComponents:[

    /* PpAddFavoritComponent,
    PpRequestMaterialComponent,
    PpEditParamsComponent,
    PpSetDefaultComponent, */
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 
  
}

export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http,'assets/i18n/', '.json');  
} 


