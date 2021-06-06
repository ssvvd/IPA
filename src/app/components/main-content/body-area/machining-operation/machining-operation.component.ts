import { Component, OnInit } from '@angular/core';
import { MainApp,SecondaryApp } from '../../../../models/applications/applications';
import { ApplicationsService } from '../../../../services/applications.service' ;
import { StateManagerService} from '../../../../services/statemanager.service' ;
import { AppsettingService} from '../../../../services/appsetting.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

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
  ShowLevel:number=0;
  DescAppMobile1:string="";
  DescAppMobile2:string="";
  DescAppMobile3:string="";
  private eventsSubscription: Subscription=new Subscription();

  constructor(private srv_app: ApplicationsService,private srv_statemanage:StateManagerService,
              public srv_appsetting:AppsettingService,private router:Router) { }
  
  ngOnInit() {
    this.isToOperationData =this.srv_statemanage.CheckToOperationData();  
    let MachineType:string;
    MachineType=  this.srv_statemanage.SelectedMachine.MachineType;
    this.eventsSubscription.add(this.srv_app.getmainapp(this.srv_appsetting.Lang,MachineType,this.srv_statemanage.SelectedMachine.SpindleType)
      .subscribe((res: any)=> {
          for (const d of JSON.parse(res)) {                     
          if(d.ParentMenuID==0)
            { 
              let additem_mainapp:boolean;
              if(!this.srv_appsetting.isMobileResolution)  additem_mainapp=true;   
              if(this.srv_appsetting.isMobileResolution)  additem_mainapp=d.IsActive;   
              if(additem_mainapp)     
                  this.arrMainApps.push({
                    MenuID: d.MenuID,
                    MenuName: d.MenuName,
                    MainApp:d.MainApp,
                    MenuImage: environment.ImageApplicationsPath + d.MenuImage  + ".png"  ,
                    IsActive:d.IsActive,
                    SpindleSelected:d.SpindleType                          
                });
               
          }
        }
        if(this.srv_appsetting.isMobileResolution)  
        {
          if(this.arrMainApps.find(m=> m.MenuName=='Milling') ==undefined )
          {
            this.arrMainApps = this.arrMainApps.filter(ma=>ma.MenuID!='110');                    
          }
        }
    this.eventsSubscription.add(this.srv_app.getmenu(this.srv_appsetting.Lang,'user') //todo:user
    .subscribe((data: any)=> {
        for (const d of JSON.parse(data)) {                          
          if(d.ParentMenuID!=0 && d.IsNewITA) 
            { 
              let isadditem:boolean =true;
              let isactive:boolean=true;
              if(d.ParentMenuID=='61') //drilling
              {
                if(d.MenuID==71)  isadditem =false;
                if( MachineType=='Swiss type' || MachineType=='Multi spindle')
                {         
                  if(this.srv_statemanage.SelectedMachine.SpindleType=='M' ) {
                    if(d.MenuID==111) isadditem =false;
                    if(d.MenuID==112) isadditem =true;
                  }
                  if(this.srv_statemanage.SelectedMachine.SpindleType=='T' ) {
                    if(d.MenuID==111) isadditem =true;
                    if(d.MenuID==112) isadditem =false;
                  }                  
                }                
                { 
                  if(MachineType=='Lathe')
                  {
                    if(d.MenuID==111)  isadditem =false;
                    if(d.MenuID==112)  isadditem =true;                    
                  }
                  if(MachineType=='Machining center')
                  {
                    if(d.MenuID==111)  isadditem =true;
                    if(d.MenuID==112)  isadditem =false;                    
                  }                  
                }
                if(MachineType=='Multi task' )
                {
                  if(this.srv_statemanage.SelectedMachine.SpindleType=='T')
                  {
                    if(d.MenuID==111)  isadditem =true;
                    if(d.MenuID==112)  isadditem =false; 
                  }
                  if(this.srv_statemanage.SelectedMachine.SpindleType=='M')
                  {
                    if(d.MenuID==111)  isadditem =false;
                    if(d.MenuID==112)  isadditem =true;  
                  }
                }
              } 
              if(d.ParentMenuID=='110') //threading
              {
                if(MachineType=='Lathe' ) if(d.ApplicationITAID==119 || d.ApplicationITAID==120 )  isactive =false;               
                if(MachineType=='Machining center' ) if(d.ApplicationITAID==810 || d.ApplicationITAID==820 )  isactive =false;         
                if(MachineType=='Swiss type' || MachineType=='Multi spindle')
                {
                  if(this.srv_statemanage.SelectedMachine.SpindleType=='M')
                  {
                    if(d.ApplicationITAID==119 || d.ApplicationITAID==120 )  isactive =false;  
                    if(d.ApplicationITAID==810 || d.ApplicationITAID==820 )  isactive =false;
                    if(this.srv_appsetting.isMobileResolution) 
                    {
                      if(d.ApplicationITAID==119 || d.ApplicationITAID==120 )  isadditem =false;  
                    }
                  }
                  if(this.srv_statemanage.SelectedMachine.SpindleType=='T')
                  {
                    if(d.ApplicationITAID==119 || d.ApplicationITAID==120 )  isactive =true;  
                    if(d.ApplicationITAID==810 || d.ApplicationITAID==820 )  isactive =false;
                  }
                }
                if(MachineType=='Multi task' )
                {
                  if(this.srv_statemanage.SelectedMachine.SpindleType=='T')
                  {
                    if(d.ApplicationITAID==119 || d.ApplicationITAID==120 )  isactive =true;  
                    if(d.ApplicationITAID==810 || d.ApplicationITAID==820 )  isactive =false;
                  }
                  if(this.srv_statemanage.SelectedMachine.SpindleType=='M')
                  {
                    if(d.ApplicationITAID==119 || d.ApplicationITAID==120 )  isactive =false;  
                    if(d.ApplicationITAID==810 || d.ApplicationITAID==820 )  isactive =true;
                    if(this.srv_appsetting.isMobileResolution) 
                    {
                      if(d.ApplicationITAID==119 || d.ApplicationITAID==120 )  isadditem =false;  
                    }
                  }
                }
              } 
              if(this.srv_appsetting.isMobileResolution)  isadditem=(isadditem && isactive);            
              if(isadditem)
                {
                  this.arrSecApps.push({
                  MainApp:d.MainApp,
                  MenuID: d.MenuID,
                  MenuName: d.MenuName,
                  MenuImage: (d.ApplicationITAID ==810 || d.ApplicationITAID ==820) ? environment.ImageApplicationsPath + d.MenuImage  + "_inprogress.png": environment.ImageApplicationsPath + d.MenuImage  + ".png",
                  ParentMenuID:d.ParentMenuID ,
                  ApplicationITAID: d.ApplicationITAID,
                  IsActive:isactive 
                })
              }
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
          {
            this.ApplyFilter2(sa.ParentMenuID);                  
            this.ShowLevel =2;
            this.DescAppMobile1=ma.MenuName;
            this.DescAppMobile2=sa.MenuName;
          }              
          else
          {
            this.SelectedSecApp = sa;           
            this.SelectedSecAppID = sa.ApplicationITAID;
            this.ShowLevel =1;
            this.DescAppMobile1=ma.MenuName;
            this.DescAppMobile2=sa.MenuName;
          }          
        }              
        this.SelectedMenuID1=this.srv_statemanage.MenuIDLevel1 ;
        this.SelectedMenuID2=this.srv_statemanage.MenuIDLevel2 ;   
        
      
    }
    ));
     }));
  }
  
  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }
  
  SetLevel(level:number)
  {
    this.ShowLevel =level;
  }
  onSelectMainApp(obj:MainApp) {
    
    if (obj.IsActive)
      {
        //if(this.srv_appsetting.isMobileResolution && obj.MenuID=='110') return;
        
        this.ShowLevel =1;
        this.DescAppMobile1=obj.MenuName;
        this.arrSelectedSecApp1=[];
        this.arrSelectedSecApp2=[];
        this.SelectedMainApp=obj;     
        this.SelectedMainAppID=obj.MenuID; 
        this.SelectedSecApp=null;
        this.SelectedSecAppID=""; 

        this.SelectedMenuID1='';
        this.SelectedMenuID2='';
      
        this.srv_statemanage.IPL =null;
        this.ApplyFilter1(obj.MenuID);  
      }
   }  
  
   onFilterSecApp (obj:SecondaryApp)
   {
    this.ShowLevel=2;
    this.DescAppMobile2 =obj.MenuName;
     if(obj.ApplicationITAID!='0')
      {
        this.OnSelectSecApp(obj,1);
       
        return;
      }
     this.SelectedMenuID1 =obj.MenuID;
     this.srv_statemanage.MenuIDLevel1 =obj.MenuID;
     if(obj.ApplicationITAID=='0')
      {       
      this.SelectedSecApp=obj; 
      this.SelectedSecAppID=obj.MenuID;            
      }       
    this.ApplyFilter2(obj.MenuID);
   }
   
   onFilterSecApp1(obj:SecondaryApp)
   {
     if(obj.ApplicationITAID!='0')
      {  
        this.ShowLevel=2;    
        this.DescAppMobile2 =obj.MenuName;
        this.OnSelectSecApp(obj,2);
        return;
      }
     
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

  ToOperationData(secapp:SecondaryApp)
  { 
    if(this.isToOperationData && secapp.ApplicationITAID!='0' && secapp.IsActive && secapp.ApplicationITAID!='810' && secapp.ApplicationITAID!='820')
      this.router.navigate(['/home/operation-data']);
  }

  BackMobile(level)
  {
    if(this.ShowLevel>0 && level<this.ShowLevel) this.ShowLevel =this.ShowLevel-1;
    
  }


}
