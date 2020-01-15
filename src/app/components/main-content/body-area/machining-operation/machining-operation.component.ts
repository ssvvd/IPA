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
    
  SelectedMenuID1:string="";
  SelectedMenuID2:string="";
  isToOperationData:boolean=false;
  constructor(private srv_app: ApplicationsService,private srv_statemanage:StateManagerService) { }
  
  ngOnInit() {

    this.isToOperationData =this.srv_statemanage.CheckToOperationData();

    this.srv_app.getmenu('en','user')
    .subscribe((data: any)=> {
      for (const d of JSON.parse(data)) {                     
        if(d.ParentMenuID==0)
          {          
            this.arrMainApps.push({
              MenuID: d.MenuID,
              MenuName: d.MenuName,
              MainApp:d.MainApp,
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
        };
      }
       let ma:MainApp =this.srv_statemanage.MainAppSelected;
       if (ma!= null)
         {
           this.SelectedMainApp=ma;     
           this.SelectedMainAppID=ma.MenuID;
           this.ApplyFilter1(ma.MenuID);
         }
       let sa:SecondaryApp=this.srv_statemanage.SecAppSelected;  
       if(sa!=null)
        {          
          if(this.arrSelectedSecApp1.filter(e=>e.MenuID==sa.MenuID).length==0)          
              this.ApplyFilter2(sa.ParentMenuID);                  
          else
          {
            this.SelectedSecApp = sa;
            this.SelectedSecAppID = sa.ApplicationITAID;
          }
        }        
        this.SelectedMenuID1=this.srv_statemanage.MenuIDLevel1 ;
        this.SelectedMenuID2=this.srv_statemanage.MenuIDLevel2 ;        
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
     this.SelectedMenuID1 =obj.MenuID;
     this.srv_statemanage.MenuIDLevel1 =obj.MenuID;
     if(obj.ApplicationITAID=="0")
      {       
      this.SelectedSecApp=obj; 
      this.SelectedSecAppID=obj.MenuID;            
      }       
    this.ApplyFilter2(obj.MenuID);
   }
   
   onFilterSecApp1(obj:SecondaryApp)
   {
      this.SelectedMenuID2 =obj.MenuID;
      this.srv_statemanage.MenuIDLevel2 =obj.MenuID;
   }

  ApplyFilter1(ParentMenuID:string)
  {
    this.arrSelectedSecApp1=this.arrSecApps.filter(m => m.ParentMenuID ==ParentMenuID);        
  }

  ApplyFilter2(ParentMenuID:string)
  {
    this.arrSelectedSecApp2=this.arrSecApps.filter(m => m.ParentMenuID ==ParentMenuID);         
  }

  OnSelectSecApp(sa:SecondaryApp,l:number)
  {
    this.srv_statemanage.IPL=null;
    this.srv_statemanage.MainAppSelected=this.SelectedMainApp;
    this.srv_statemanage.SecAppSelected=sa; 
    if(l==1) this.srv_statemanage.MenuIDLevel1=sa.MenuID;
    if(l==2) this.srv_statemanage.MenuIDLevel2=sa.MenuID;
    
  }
}
