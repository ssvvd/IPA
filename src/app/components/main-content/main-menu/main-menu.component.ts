import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { StateManagerService } from 'src/app/services/statemanager.service' ;

export class MainTab {
  TabID:number;
  Description: string ="";
  SelectedItemDesc: string ="";
  SelectedItemDesc1: string ="";
  ImageURL:string="";
  ImageDisableURL:string="";
  RouteName:string="";
  IsSelected:boolean=false;
  isDisabled:boolean=false;
  
  constructor(public pTabID: number, public pDescription: string,public pRouteName:string, public pImageURL:string,public pImageDisableURL:string,public pisDisabled:boolean) { 
    this.TabID =pTabID;
    this.Description =pDescription;
    this.RouteName=pRouteName;
    this.ImageURL=pImageURL; 
    this.ImageDisableURL=pImageDisableURL;
    this.ImageURL=pImageURL;    
    this.isDisabled=pisDisabled;
  }
}

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})

export class MainMenuComponent implements OnInit {

  //@Input () RouteSelected :string;
  
  Tabs:MainTab[]=[];

  constructor(private router: Router,private srv_statemanage:StateManagerService) { 
    
    this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationStart) {              
                this.TabSelected(event.url);       
                // Show loading indicator
            }

            if (event instanceof NavigationEnd) {
                // Hide loading indicator
            }

            if (event instanceof NavigationError) {
                // Hide loading indicator

                // Present error to user
                console.log(event.error);
            }
        });
  }

  ngOnInit()
  {    
    this.Tabs.push (new MainTab(1,"Machine","/home/machines", environment.ImagePath + "icon_Machinel.svg","",false));    
    this.Tabs.push (new MainTab(2,"Material","/home/materials",environment.ImagePath + "icon_Material.svg","",false));
    this.Tabs.push (new MainTab(3,"Machining Operation","/home/machining-operation",environment.ImagePath + "icon_MachiningOp.svg","",false));
    this.Tabs.push (new MainTab(4,"Operation Data","/home/operation-data",environment.ImagePath +  "icon_OpData.svg",environment.ImagePath +  "icon_OpData_dis.svg",true));
    this.Tabs.push (new MainTab(5,"Results","/home/results",environment.ImagePath + "icon_Resaults.svg",environment.ImagePath + "icon_Resaults_dis.svg",true)); 

    this.Tabs[0].IsSelected=true;       
    this.srv_statemanage.CurrentMachineSelected.subscribe(arr => this.SelectedMachine(arr));
    this.srv_statemanage.CurrentMaterialSelected.subscribe(arr => this.SelectedMaterial(arr));
    this.srv_statemanage.CurrentSecAppSelected.subscribe(arr => this.SelectedSecApp(arr));
    
    this.srv_statemanage.OperationDataEnable.subscribe(x=>this.OperationDataEnable(x));
    this.srv_statemanage.InputParamSelected.subscribe(x=>this.InputParamSelected(x));
    
  }
 
 OperationDataEnable(isenable:boolean)
 {    
   this.Tabs[3].isDisabled=!isenable;  
 }

 InputParamSelected(s:string)
 {
  this.Tabs[3].SelectedItemDesc=s;
 }
  SelectedMachine(arr:string[])
  {         
    if(arr[0]!==undefined) this.Tabs[0].SelectedItemDesc = arr[0] + ': '; 
    if(arr[0]!==undefined) this.Tabs[0].SelectedItemDesc1 = arr[1];    
  }
  
  SelectedMaterial(arr:string[])
  {       
    this.Tabs[1].SelectedItemDesc = arr[0]; 
  }

  SelectedSecApp(arr:string[])
  {     
    if(arr[0]!==undefined) this.Tabs[2].SelectedItemDesc = arr[0] + ', ';
    if(arr[1]!==undefined) this.Tabs[2].SelectedItemDesc1 = arr[1];    
  }

 TabSelected(RouteName:string) {       
    this.Tabs.forEach( (obj) => { 
       if(obj.RouteName==RouteName)   
        {      
          obj.IsSelected=true;      
          obj.isDisabled =false;
        }
      else
          obj.IsSelected=false;
      if(obj.RouteName=="/home/machines"){
        if(RouteName.indexOf('machine-item')>-1){
          obj.IsSelected=true; 
          obj.isDisabled =false;
        }
      }               
    });
   }    
  
   onClickTab(tab:MainTab)
   {
    // /[routerLink]="tab.isDisabled? null:tab.RouteName"
    if(!tab.isDisabled)
      this.router.navigate([tab.RouteName]);
   }
}
