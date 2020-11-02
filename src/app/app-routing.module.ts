import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MachiningOperationComponent } from './components/main-content/body-area/machining-operation/machining-operation.component';
import { MaterialsComponent } from './components/main-content/body-area/materials/materials.component';
import { OperationDataComponent } from './components/main-content/body-area/operation-data/operation-data.component';
import { ResultsComponent } from './components/main-content/body-area/results/results.component';
import { HomeComponent } from './components/home/home.component';
import { MachinesListComponent } from './components/main-content/body-area/machines/machines-list/machines-list.component';
import { MachineItemComponent } from './components/main-content/body-area/machines/machine-item/machine-item.component';
import { ContactusComponent } from './components/maintenance/contactus/contactus.component';
const routes: Routes = [
	{path:"materials",component:MaterialsComponent},
	{path:"materials/:lang",component:MaterialsComponent},
	{path:"",component:HomeComponent},
	{path:"home",component:HomeComponent,
	children:[
		{path:"",component:MachinesListComponent},
		{path:"machines",component:MachinesListComponent},	
		{path:"machine-item/:id/:name", component: MachineItemComponent},
		{path:"materials",component:MaterialsComponent},
		{path:"materials/:lang",component:MaterialsComponent},
		{path:"machining-operation",component:MachiningOperationComponent},		
		{path:"operation-data",component:OperationDataComponent},
		{path:"results",component:ResultsComponent}	,
		{path:"contactus",component:ContactusComponent}		
	],runGuardsAndResolvers: "always",}
	];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: "reload"})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
