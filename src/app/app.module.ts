import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {HttpClientModule} from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClient } from '@angular/common/http';
import { DataTablesModule } from 'angular-datatables';
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
    PpSelectColumnsComponent
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
    BrowserAnimationsModule
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
export class AppModule { }
