import { Component, OnInit } from '@angular/core';
import { MainApp,SecondaryApp } from 'src/app/models/applications/applications';
import { ApplicationsService } from 'src/app/services/applications.service' ;
import { StateManagerService} from 'src/app/services/statemanager.service' ;
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-machining-operation',
  templateUrl: './machining-operation.component.html',
  styleUrls: ['./machining-operation.component.scss']
})
export class MachiningOperationComponent implements OnInit {

  environment = environment;

  arrMainApps:MainApp[]=[];
  arrSecApps:SecondaryApp[]=[];
  arrSelectedSecApp1:SecondaryApp[]=[];
  arrSelectedSecApp2:SecondaryApp[]=[];  
  SelectedMainApp:MainApp;
  SelectedMainAppID:string="";

  SelectedSecApp:SecondaryApp;
  SelectedSecAppID:string="";

  constructor(private srv_app: ApplicationsService,private srv_statemanage:StateManagerService) { }
  
  ngOnInit() {
  
    this.srv_app.getmenu('en','user')
    .subscribe((data: any)=> {
      for (const d of JSON.parse(data)) {                     
        if(d.ParentMenuID==0)
          {          
            this.arrMainApps.push({
              MenuID: d.MenuID,
              MenuName: d.MenuName,
              MenuImage: environment.ImageApplicationsPath + d.MenuImage  + ".png"              
          })
        }
        else if(d.IsNewITA) 
           {          
            this.arrSecApps.push({
              MainApp:d.MainApp,
              MenuID: d.MenuID,
              MenuName: d.MenuName,
              MenuImage: environment.ImageApplicationsPath + d.MenuImage  + ".png" ,
              ParentMenuID:d.ParentMenuID ,
              ApplicationITAID: d.ApplicationITAID       
          })
        }
          ;
      }                   
    });
  }
  
  onSelectMainApp(obj:MainApp) { 
    this.arrSelectedSecApp1=[];
    this.arrSelectedSecApp2=[];
    this.SelectedMainApp=obj;     
    this.SelectedMainAppID=obj.MenuID; 
    this.SelectedSecApp=null;
    this.SelectedSecAppID=""; 
    this.ApplyFilter1(obj.MenuID);  
   }  
  
   onFilterSecApp (obj:SecondaryApp)
   {
     if(obj.ApplicationITAID=="0")
      {       
      this.SelectedSecApp=obj; 
      this.SelectedSecAppID=obj.MenuID;          
      }
    //else
    
    this.ApplyFilter2(obj.MenuID);
   }

  ApplyFilter1(ParentMenuID:string)
  {
    this.arrSelectedSecApp1=this.arrSecApps.filter(m => m.ParentMenuID ==ParentMenuID);         
  }
  ApplyFilter2(ParentMenuID:string)
  {
    this.arrSelectedSecApp2=this.arrSecApps.filter(m => m.ParentMenuID ==ParentMenuID);         
  }

  OnSelectSecApp(sa:SecondaryApp)
  {
    this.srv_statemanage.SetSecondaryApp(this.SelectedMainApp, sa); 
  }
}
