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
//import { MachineItemHeaderComponent } from './components/main-content/body-area/machines/machine-item-header/machine-item-header.component';
import { MachineItemSpindleComponent } from './components/main-content/body-area/machines/machine-item-spindle/machine-item-spindle.component';
import { FormsModule } from '@angular/forms'; import { ReactiveFormsModule } from '@angular/forms';
import { MachineItemSpindleChartComponent } from './components/main-content/body-area/machines/machine-item-spindle-chart/machine-item-spindle-chart.component';
import { MachinesTestComponent } from './components/main-content/body-area/machines/machines-test/machines-test.component';
import { MatFilterComponent } from './components/main-content/body-area/materials/mat-filter/mat-filter.component';
import { MatResultsComponent } from './components/main-content/body-area/materials/mat-results/mat-results.component';


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
    //MachineItemHeaderComponent,
    MachineItemSpindleComponent,
    MachineItemSpindleChartComponent,
    MachinesTestComponent,
    MatFilterComponent,
    MatResultsComponent
   
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    DataTablesModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
