import { Component, OnInit} from '@angular/core';
import { DatalayerService} from 'src/app/services/datalayer.service' ;
import { InputParameterlist } from 'src/app/models/operational-data/inputparameterlist';
import { StateManagerService} from 'src/app/services/statemanager.service' ;
import { MachineService } from 'src/app/services/machine.service' ;
import { AppsettingService} from 'src/app/services/appsetting.service';
import { Machinespindle } from 'src/app/models/machines/machinespindle';
import { Router } from '@angular/router';
import { Subject ,Subscription} from 'rxjs';

@Component({
  selector: 'app-operation-data',
  templateUrl: './operation-data.component.html',
  styleUrls: ['./operation-data.component.scss']
})

export class OperationDataComponent implements OnInit {
  
  SecApp:string;  
  SecAppName:string;
  MainApp:string;
  router:Router;
  isLoaded:boolean=false;

   eventsSubject: Subject<void> = new Subject<void>();
  private eventsSubscription: Subscription=new Subscription();
  
  public msrv_StMng:StateManagerService =this.srv_StMng;

  constructor(private srv_machine: MachineService,router:Router,private srv_DataLayer:DatalayerService,
              private srv_StMng:StateManagerService,private srv_appsetting:AppsettingService) 
  {
    this.router=router;
   }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }

  ngOnInit() {  
    
    if(typeof(this.srv_StMng.SecAppSelected)!== 'undefined' && this.srv_StMng.SecAppSelected !== null)
        {
          this.SecApp = this.srv_StMng.SecAppSelected.ApplicationITAID;
          this.SecAppName = this.srv_StMng.SecAppSelected.MenuName;
          this.MainApp=this.srv_StMng.SecAppSelected.MainApp;
        } 
    let Ipl:InputParameterlist =new InputParameterlist;
    
    if (this.srv_StMng.IPL== null)    
    {
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
              // alert(this.isLoaded);                                  
        }
        this.srv_StMng.IPL =Ipl;
        this.isLoaded=true;  
    }   
      
));
}
else
      this.isLoaded=true;
}

  showtooldata()
  {
    this.srv_StMng.IsTabToolDataOpen =!this.srv_StMng.IsTabToolDataOpen;    
  }
  
  ClearDataChild()
  {
    this.eventsSubject.next();
  }

  GoToResult()
  {
    let r:any;
    r=this.srv_StMng.IPL.items.filter(x=> (x.value==null || (x.value=='0' && x.name!='DiameterBoring' ) || x.value.toString()=='') && x.required);
    
    if (this.srv_StMng.IPL.items.filter(x=> (x.value==null || (x.value=='0' && x.name!='DiameterBoring' ) || x.value.toString()=='') && x.required).length==0)    
      this.router.navigate(['/home/results']);
  }
 
}