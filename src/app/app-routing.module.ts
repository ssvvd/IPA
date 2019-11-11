import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MachinesComponent } from './components/main-content/body-area/machines/machines.component';
import { MachiningOperationComponent } from './components/main-content/body-area/machining-operation/machining-operation.component';
import { MaterialsComponent } from './components/main-content/body-area/materials/materials.component';
import { OperationDataComponent } from './components/main-content/body-area/operation-data/operation-data.component';
import { ResultsComponent } from './components/main-content/body-area/results/results.component';


const routes: Routes = [
  {path:"machines",component:MachinesComponent},
  {path:"material",component:MaterialsComponent},
  {path:"machining-operation",component:MachiningOperationComponent},
  {path:"operation-data",component:OperationDataComponent},
  {path:"resuls",component:ResultsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
