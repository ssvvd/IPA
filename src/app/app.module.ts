import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {HttpClientModule} from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClient } from '@angular/common/http';
import { DataTablesModule } from 'angular-datatables';

import { MachinedetailedComponent } from './components/machines/machinedetailed/machinedetailed.component';
import { MachineListComponent } from './components/machines/machinelist/machinelist.component';
import { MachinetabComponent } from './components/machines/machinetab/machinetab.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { GlobalMenuComponent } from './components/header/global-menu/global-menu.component';
import { SubMenuComponent } from './components/header/sub-menu/sub-menu.component';
import { BodyAreaComponent } from './components/body-area/body-area.component';
import { MachinesComponent } from './components/body-area/machines/machines.component';
import { MaterialsComponent } from './components/body-area/materials/materials.component';
import { MachiningOperationComponent } from './components/body-area/machining-operation/machining-operation.component';
import { OperationDataComponent } from './components/body-area/operation-data/operation-data.component';
import { ResultsComponent } from './components/body-area/results/results.component';

@NgModule({
  declarations: [
    AppComponent,
    MachinedetailedComponent,
    MachineListComponent,
    MachinetabComponent,
    HeaderComponent,
    FooterComponent,
    GlobalMenuComponent,
    SubMenuComponent,
    BodyAreaComponent,
    MachinesComponent,
    MaterialsComponent,
    MachiningOperationComponent,
    OperationDataComponent,
    ResultsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    DataTablesModule
      
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
