import { Component, OnInit ,Output,EventEmitter} from '@angular/core';
import { environment } from 'src/environments/environment';
import { MachinesComponent } from 'src/app/components/main-content/body-area/machines/machines.component';
import { MaterialsComponent } from 'src/app/components/main-content/body-area/materials/materials.component';

import { Routes } from '@angular/router';

export const routerConfig: Routes = [
  {
      path: 'Machines',
      component: MachinesComponent
  },
  {
      path: 'Materials',
      component: MaterialsComponent
  }    
];

export class MainTab {
  TabID:number;
  Description: string;
  SelectedItemDesc: string;
  ImageURL:string;
  RouteName:string;

  constructor(public pTabID: number, public pDescription: string,public pRouteName:string, public pImageURL:string) { 
    this.TabID =pTabID;
    this.Description =pDescription;
    this.RouteName=pRouteName;
    this.ImageURL=pImageURL;
  }
}

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})

export class MainMenuComponent implements OnInit {

  @Output() TabSelect = new EventEmitter();

  Tabs:MainTab[]=[];
  activetab:string;
  constructor() { }

  ngOnInit()
  {    
    this.Tabs.push (new MainTab(1,"Machine","machines", environment.ImagePath + "icon_Machinel.svg"));
    this.Tabs.push (new MainTab(2,"Material","material",environment.ImagePath + "icon_Material.svg"));
    this.Tabs.push (new MainTab(3,"Machining Operation","machiningoperation",environment.ImagePath + "icon_MachiningOp.svg"));
    this.Tabs.push (new MainTab(4,"Operational Data","operationdata",environment.ImagePath +  "icon_OpData.svg"));
    this.Tabs.push (new MainTab(5,"Results","results",environment.ImagePath + "icon_Resaults.svg")); 
  }

  TabSelected(tabname:string) {         
    this.activetab = tabname;         
    this.TabSelect.emit(tabname);
  }

 
}
