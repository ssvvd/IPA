import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MachiningOperationComponent } from './components/main-content/body-area/machining-operation/machining-operation.component';
//import { MaterialsComponent } from './components/main-content/body-area/materials/materials.component';
//import { OperationDataComponent } from './components/main-content/body-area/operation-data/operation-data.component';
//import { ResultsComponent } from './components/main-content/body-area/results/results.component';
import { HomeComponent } from './components/home/home.component';
import { MachinesListComponent } from './components/main-content/body-area/machines/machines-list/machines-list.component';
import { MachineItemComponent } from './components/main-content/body-area/machines/machine-item/machine-item.component';
import { ContactusComponent } from './components/maintenance/contactus/contactus.component';
import { MachinesComponent } from './components/main-content/body-area/machines/machines/machines.component';

const routes: Routes = [
	/* {path:"materials",component:MaterialsComponent},
	{path:"materials/:lang",component:MaterialsComponent}, */
	{path:"materials",loadChildren: () => import('./components/main-content/body-area/materials/materials.module').then(m => m.MaterialsModule)},
	{path:"materials/:lang",loadChildren: () => import('./components/main-content/body-area/materials/materials.module').then(m => m.MaterialsModule)}, 

	{path:"",component:HomeComponent},
	{path:"home",component:HomeComponent,
	children:[
		{path:"",component:MachinesListComponent},
		/* {path:"machines",component:MachinesListComponent},	 */
		{path:"machines",component:MachinesComponent},	
		{path:"machine-item/:id/:name", component: MachineItemComponent},

		/* {path:"materials",component:MaterialsComponent}, */
		{path:"materials",loadChildren: () => import('./components/main-content/body-area/materials/materials.module').then(m => m.MaterialsModule)},

		/* {path:"materials/:lang",component:MaterialsComponent}, */
		{path:"materials/:lang",loadChildren: () => import('./components/main-content/body-area/materials/materials.module').then(m => m.MaterialsModule)}, 

		{path:"machining-operation",component:MachiningOperationComponent},				
		{path:"operation-data",loadChildren: () => import('./components/main-content/body-area/operation-data/operation-data.module').then(m => m.OperationDataModule)},		
		/* {path:"results",component:ResultsComponent}	, */
		{path:"results",loadChildren: () => import('./components/main-content/body-area/results/results.module').then(m => m.ResultsModule)},
		{path:"contactus",component:ContactusComponent}		
	],runGuardsAndResolvers: "always",},
	
/* 	{ path: 'operation-data', loadChildren: () => import('./operation-data/operation-data.module').then(m => m.OperationDataModule) } */
	];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: "reload"})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
