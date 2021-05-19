import { Component, OnInit,HostListener} from '@angular/core';
import { DatalayerService} from '../../../../services/datalayer.service' ;
import { StateManagerService} from '../../../../services/statemanager.service' ;
import { AppsettingService} from '../../../../services/appsetting.service';
import { InputParameterlist } from '../../../../models/operational-data/inputparameterlist';

import { Router } from '@angular/router';
import { Subject ,Subscription} from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-operation-data',  templateUrl: './operation-data.component.html',
  styleUrls: ['./operation-data.component.scss']
})

export class OperationDataComponent implements OnInit {
  
  SecApp:string;  
  SecAppName:string;
  MainApp:string;
  router:Router;
  isLoaded:boolean=false;

   eventsSubject: Subject<void> = new Subject<void>();
   evGetResult: Subject<void> = new Subject<void>();
  private eventsSubscription: Subscription=new Subscription();
  TabActive:number=1;
  public msrv_StMng:StateManagerService =this.srv_StMng;
  
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {    
    if (event.key == 'Enter') this.GoToResult();        
  }

  constructor(router:Router,private srv_DataLayer:DatalayerService,
              private srv_StMng:StateManagerService,public srv_appsetting:AppsettingService,
              public translate:TranslateService) 
  {
    this.router=router;
   }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }

  ngOnInit() {  
    if(this.srv_appsetting.issmallscreen) this.srv_StMng.IsTabToolDataOpen=false;
    if(this.srv_appsetting.isMobileResolution) this.srv_StMng.IsTabToolDataOpen=true;
    //this.translate.use(this.srv_appsetting.Lang);
    this.srv_appsetting.LangChanged.subscribe(l=>this.translate.use(l));
    if(typeof(this.srv_StMng.SecAppSelected)!== 'undefined' && this.srv_StMng.SecAppSelected !== null)
        {
          this.SecApp = this.srv_StMng.SecAppSelected.ApplicationITAID;
          this.SecAppName = this.srv_StMng.SecAppSelected.MenuName;
          this.MainApp=this.srv_StMng.SecAppSelected.MainApp;
        } 
    
    
    if (this.srv_StMng.IPL== null)    
    {
      this.FillParameters();
      return;
      let Ipl:InputParameterlist =new InputParameterlist;
      this.eventsSubscription.add(this.srv_DataLayer.getinputparameters(this.SecApp, this.srv_appsetting.Units,this.srv_StMng.SelectedMachine.MachineType).subscribe((data: any)=> {
        for (const d of JSON.parse(data)) {                                       
              Ipl.items.push({
                name:d.name,
                value:  d.valuedefault==null?'':d.valuedefault,
                type:d.type,
                valuedefault: d.valuedefault==null?'':d.valuedefault,              
                valuemin:d.valuemin ,
                valuemax: d.valuemax ,
                image:d.image ,
                image1:d.image1==null?'':d.image1,
                description: d.description==null?'':d.description, 
                required:d.required,
                units:d.units==null?'':d.units,
                istooldetails:d.istooldetails==null?'':d.istooldetails, 
                valueall:d.valueall==null?'':d.valueall
            })                                                                       
        }
        this.srv_StMng.IPL =Ipl;
        this.isLoaded=true;  
    }   
      
));
}
else
      this.isLoaded=true;
}

FillParameters()
{
  let Ipl:InputParameterlist =new InputParameterlist;      
  this.eventsSubscription.add(this.srv_DataLayer.getinputparameters(this.SecApp, this.srv_appsetting.Units,this.srv_StMng.SelectedMachine.MachineType).subscribe((data: any)=> {
    for (const d of JSON.parse(data)) {                                       
          Ipl.items.push({
            name:d.name,
            value:  d.valuedefault==null?'':d.valuedefault,
            type:d.type,
            valuedefault: d.valuedefault==null?'':d.valuedefault,              
            valuemin:d.valuemin ,
            valuemax: d.valuemax ,
            image:d.image ,
            image1:d.image1==null?'':d.image1,
            description: d.description==null?'':d.description, 
            required:d.required,
            units:d.units==null?'':d.units,
            istooldetails:d.istooldetails==null?'':d.istooldetails, 
            valueall:d.valueall==null?'':d.valueall
        })                                                                       
    }
    this.srv_StMng.IPL =Ipl;
    this.isLoaded=true;  
}));
}
 onReset()
 {
  this.FillParameters();
}

  showtooldata()
  {
    this.srv_StMng.IsTabToolDataOpen =!this.srv_StMng.IsTabToolDataOpen;     
  }
  
  ClearDataChild()
  {
    //this.eventsSubject.next();
    this.onReset();
  }

  GoToResult()
  {
    this.evGetResult.next();
    let r:any;
    r=this.srv_StMng.IPL.items.filter(x=> (x.value==null || (x.value=='0' && x.name!='DiameterBoring' ) || x.value.toString()=='') && x.required);
    
    if (this.srv_StMng.IPL.items.filter(x=> (x.value==null || (x.value=='0' && x.name!='DiameterBoring' ) || x.value.toString()=='') && x.required).length==0)    
      this.router.navigate(['/home/results']);
  }
 
  
  OpenOperationData()
  {
    this.TabActive=1;
  }

  OpenToolData()
  {
    this.TabActive=2;
  }
}