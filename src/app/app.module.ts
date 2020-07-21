import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {HttpClientModule} from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClient } from '@angular/common/http';
import { DataTablesModule } from 'angular-datatables';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
//import { SafePipeModule } from 'safe-pipe';
import * as $ from "jquery";

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { GlobalMenuComponent } from './components/header/global-menu/global-menu.component';
import { SubMenuComponent } from './components/header/sub-menu/sub-menu.component';
import { MaterialsComponent } from './components/main-content/body-area/materials/materials.component';
import { MachiningOperationComponent } from './components/main-content/body-area/machining-operation/machining-operation.component';
import { OperationDataComponent } from './components/main-content/body-area/operation-data/operation-data.component' //./components/main-content/body-area/operation-data/operation-data.component';
import { ResultsComponent } from './components/main-content/body-area/results/results.component';
import { MainContentComponent } from './components/main-content/main-content.component';
import { MachinesListComponent } from './components/main-content/body-area/machines/machines-list/machines-list.component';
import { MachineItemComponent } from './components/main-content/body-area/machines/machine-item/machine-item.component';
import { MainMenuComponent } from './components/main-content/main-menu/main-menu.component';
import { MachineItemSpindleComponent } from './components/main-content/body-area/machines/machine-item-spindle/machine-item-spindle.component';
import { FormsModule } from '@angular/forms'; 
import { ReactiveFormsModule } from '@angular/forms';
import { MachineItemSpindleChartComponent } from './components/main-content/body-area/machines/machine-item-spindle-chart/machine-item-spindle-chart.component';
import { MatFilterComponent } from './components/main-content/body-area/materials/mat-filter/mat-filter.component';

import { MachineItemSpindleChartModule } from './components/main-content/body-area/machines/machine-item-spindle-chart/machine-item-spindle-chart.module';
import { Ng5SliderModule } from 'ng5-slider';
import { MachinesFilterComponent } from './components/main-content/body-area/machines/machines-filter/machines-filter.component';
import { MatMainTableComponent } from './components/main-content/body-area/materials/mat-main-table/mat-main-table.component';
import { MatDetailsComponent } from './components/main-content/body-area/materials/mat-details/mat-details.component';
import { MatStandardTableComponent } from './components/main-content/body-area/materials/mat-standard-table/mat-standard-table.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { PpAddFavoritComponent } from './components/main-content/body-area/materials/pp-add-favorit/pp-add-favorit.component';
import { PpRequestMaterialComponent } from './components/main-content/body-area/materials/pp-request-material/pp-request-material.component';
import { PpEditParamsComponent } from './components/main-content/body-area/materials/pp-edit-params/pp-edit-params.component';
import { PpSetDefaultComponent } from './components/main-content/body-area/materials/pp-set-default/pp-set-default.component';
import { Appdetails59Component } from './components/main-content/body-area/operation-data/input-data-components/appdetails59/appdetails59.component';
import { OptimizetoolComponent } from './components/main-content/body-area/operation-data/input-data-components/optimizetool/optimizetool.component';
import { HardnessSliderComponent } from './components/main-content/body-area/materials/hardness-slider/hardness-slider.component';
import { HomeComponent } from './components/home/home.component';
import { Optimizetool59Component } from './components/main-content/body-area/operation-data/input-data-components/optimizetool59/optimizetool59.component';
import { OptimizetoolFilterComponent } from './components/main-content/body-area/operation-data/input-data-components/optimizetool-filter/optimizetool-filter.component';
import { NgxSpinnerModule } from "ngx-spinner"; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSearchComponent } from './components/main-content/body-area/materials/mat-search/mat-search.component';
import { ResultsTableComponent } from './components/main-content/body-area/results/results-table/results-table.component';
import { ResFilterComponent } from './components/main-content/body-area/results/res-filter/res-filter.component';
import { OptimizetoolAdaptortypeComponent } from './components/main-content/body-area/operation-data/input-data-components/optimizetool-adaptortype/optimizetool-adaptortype.component';
import { PpSelectColumnsComponent } from './components/main-content/body-area/results/pp-select-columns/pp-select-columns.component';
import { Appdetails780Component } from './components/main-content/body-area/operation-data/input-data-components/appdetails780/appdetails780.component';
import { Appdetails790Component } from './components/main-content/body-area/operation-data/input-data-components/appdetails790/appdetails790.component';
import { NgpSortModule } from "ngp-sort-pipe";
import { ResFilterListComponent } from './components/main-content/body-area/results/res-filter/res-filter-list/res-filter-list.component';
import { ResFilterScrollComponent } from './components/main-content/body-area/results/res-filter/res-filter-scroll/res-filter-scroll.component';
import { Appdetails77Component } from './components/main-content/body-area/operation-data/input-data-components/appdetails77/appdetails77.component';
import { Appdetails120Component } from './components/main-content/body-area/operation-data/input-data-components/appdetails120/appdetails120.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { OptimizetoolFilterExtComponent } from './components/main-content/body-area/operation-data/input-data-components/optimizetool-filter-ext/optimizetool-filter-ext.component';
import { Optimizetool120Component } from './components/main-content/body-area/operation-data/input-data-components/optimizetool120/optimizetool120.component';
import { Appdetails990Component } from './components/main-content/body-area/operation-data/input-data-components/appdetails990/appdetails990.component';
import { Optimizetool990Component } from './components/main-content/body-area/operation-data/input-data-components/optimizetool990/optimizetool990.component';
import { MachiningPrmsComponent } from './components/main-content/body-area/results/machining-prms/machining-prms.component';
import { Mp77Component } from './components/main-content/body-area/results/machining-prms/mp77/mp77.component';
import { ProductInfoComponent } from './components/main-content/body-area/results/product-info/product-info.component';
import { Appdetails890Component } from './components/main-content/body-area/operation-data/input-data-components/appdetails890/appdetails890.component';
import { Appdetails52Component } from './components/main-content/body-area/operation-data/input-data-components/appdetails52/appdetails52.component';
import { Optimizetool52Component } from './components/main-content/body-area/operation-data/input-data-components/optimizetool52/optimizetool52.component';
import { Appdetails1Component } from './components/main-content/body-area/operation-data/input-data-components/appdetails1/appdetails1.component';
import { Appdetails51Component } from './components/main-content/body-area/operation-data/input-data-components/appdetails51/appdetails51.component';
import { Appdetails54Component } from './components/main-content/body-area/operation-data/input-data-components/appdetails54/appdetails54.component';
import { MachinePpAddFavoriteComponent } from './components/main-content/body-area/machines/machine-pp-add-favorite/machine-pp-add-favorite.component';
import { InnerTabsTableComponent } from './components/main-content/body-area/results/inner-tabs-table/inner-tabs-table.component';
import { ResultPpDownloadComponent } from './components/main-content/body-area/results/result-pp-download/result-pp-download.component';
import { Mp760Component } from './components/main-content/body-area/results/machining-prms/mp760/mp760.component';
import { MachinesPpLoginComponent } from './components/main-content/body-area/machines/machines-pp-login/machines-pp-login.component';

@NgModule({
  declarations: [   
    AppComponent,   
    MachinesListComponent, 
    HeaderComponent,
    FooterComponent,
    GlobalMenuComponent,
    SubMenuComponent,
    MaterialsComponent,
    MachiningOperationComponent,
    OperationDataComponent,
    ResultsComponent,
    MainContentComponent,
    MachinesListComponent,
    MachineItemComponent,
    MainMenuComponent,    
    MachineItemSpindleComponent,
    MachineItemSpindleChartComponent,
    MatFilterComponent,
    MachinesFilterComponent,
    MatMainTableComponent,
    MatDetailsComponent,
    MatStandardTableComponent,
    PpAddFavoritComponent,
    PpRequestMaterialComponent,
    PpEditParamsComponent,
    PpSetDefaultComponent,
    Appdetails59Component,
    OptimizetoolComponent,
    HardnessSliderComponent,
    HomeComponent,
    Optimizetool59Component,
    OptimizetoolFilterComponent,
    MatSearchComponent,
    ResultsTableComponent,
    ResFilterComponent,
    OptimizetoolAdaptortypeComponent,
    PpSelectColumnsComponent,
    Appdetails780Component,
    Appdetails790Component,
    ResFilterListComponent,
    ResFilterScrollComponent,
    Appdetails77Component,
    Appdetails120Component,
    OptimizetoolFilterExtComponent,
    Optimizetool120Component,
    Appdetails990Component,
    Optimizetool990Component,
    MachiningPrmsComponent,
    ProductInfoComponent,
    Appdetails890Component,
    Appdetails52Component,
    Optimizetool52Component,
    Appdetails1Component,
    Appdetails51Component,
    Appdetails54Component,  
    MachinePpAddFavoriteComponent,
    Mp77Component,
    InnerTabsTableComponent,
    ResultPpDownloadComponent,
    Mp760Component,
    MachinesPpLoginComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    DataTablesModule,
    MachineItemSpindleChartModule ,
    Ng5SliderModule ,
    NgbModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    NgpSortModule,
    NgSelectModule,
  //  SafePipeModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  entryComponents:[
    PpAddFavoritComponent,
    PpRequestMaterialComponent,
    PpEditParamsComponent,
    PpSetDefaultComponent,
    PpSelectColumnsComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 
  
}

export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http,'assets/i18n/', '.json');  
}
