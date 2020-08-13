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
      this.eventsSubscription.add(this.srv_DataLayer.getinputparameters(this.SecApp, this.srv_appsetting.Units).subscribe((data: any)=> {
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

  FillMachineData(arrMachineSpindle: Machinespindle[])
  {
      let mainspindletype:string;
      let ms:Machinespindle;
      mainspindletype='M';
      
      this.srv_StMng.IPL.GetItem('MachCostPerHour').value = Math.round(this.msrv_StMng.SelectedMachine.CostPerHour / this.srv_appsetting.CurrRate*100)/100 + "";
      //Math.round(this.msrv_StMng.SelectedMachine.CostPerHour / this.srv_appsetting.CurrRate*100)/100;
      if(this.srv_appsetting.Country!==undefined)
      {
        this.srv_StMng.IPL.GetItem('Country').value =this.srv_appsetting.Country.CountryID.toString();
      }
      else
      {
        this.srv_StMng.IPL.GetItem('Country').value ='35';
      }
     /*  if(this.srv_appsetting.User.country!='')
        this.srv_StMng.IPL.GetItem('Country').value =this.srv_appsetting.User.country;
      else
        this.srv_StMng.IPL.GetItem('Country').value ='35';  //NU */
        
      this.srv_StMng.IPL.GetItem('Currency').value = this.srv_appsetting.Currency;

      if(this.srv_StMng.SelectedMachine.MachineType=='Multi task')
      {
        if(this.srv_StMng.MainAppSelected.MainApp=='ML') mainspindletype='T';
        if(this.srv_StMng.MainAppSelected.MainApp=='TH') mainspindletype='T';
        //todo:drilling
        
        ms = arrMachineSpindle.filter(x=> x.SpindleType ==mainspindletype)[0];
      }
      else 
        ms = arrMachineSpindle[0];
       
      this.srv_StMng.IPL.GetItem('AdaptorType').value =ms.AdaptationType;
      this.srv_StMng.IPL.GetItem('AdaptorSize').value =ms.AdaptationSize;

      this.srv_StMng.IPL.GetItem('PW_AX').value = ms.N1+""; 
      this.srv_StMng.IPL.GetItem('PW_BX').value = ms.N2+"";
      this.srv_StMng.IPL.GetItem('PW_CX').value = ms.N3+"";

      this.srv_StMng.IPL.GetItem('PW_AY').value = ms.P1 +""; 
      this.srv_StMng.IPL.GetItem('PW_BY').value = ms.P2 +"";
      this.srv_StMng.IPL.GetItem('PW_CY').value = ms.P3 + ""; 

      if(ms.FaceContact + ""=='true')
        this.srv_StMng.IPL.GetItem('ADAPTOR_FaceContact').value = "1";
      else
        this.srv_StMng.IPL.GetItem('ADAPTOR_FaceContact').value = "0";
      

           //todo: temp for check results
      /* if(this.srv_StMng.MainAppSelected.MainApp=='IS' || this.srv_StMng.MainAppSelected.MainApp=='TG')
      {
       this.srv_StMng.IPL.GetItem('AdaptorType').value="SQUARE";
       this.srv_StMng.IPL.GetItem('AdaptorSize').value="25";
       
      this.srv_StMng.IPL.GetItem('PW_AX').value = '20'; 
      this.srv_StMng.IPL.GetItem('PW_BX').value = '200';
      this.srv_StMng.IPL.GetItem('PW_CX').value = '7000';

      this.srv_StMng.IPL.GetItem('PW_AY').value = '1'; 
      this.srv_StMng.IPL.GetItem('PW_BY').value = '15';
      this.srv_StMng.IPL.GetItem('PW_CY').value = '15'; 
      } */
  }
  
  FillDataInputParamAndRouteToResult()
  {
    this.srv_StMng.IPL.GetItem('Material').value = String(this.srv_StMng.GetMaterialSelected().id);
    if(this.srv_StMng.GetMaterialSelected().HardnessHBValue!==undefined)
      this.srv_StMng.IPL.GetItem('HardnessHB').value = String(this.srv_StMng.GetMaterialSelected().HardnessHBValue);

    let listparams: { name: string, value: string }[]=[];
    let str:string='';

    if(this.srv_StMng.SecApp=='119' || this.srv_StMng.SecApp=='120')        
    {
      this.srv_StMng.IPL.GetItem('Size').value= this.srv_StMng.IPL.GetItem('Size').value.toString().replace('"', '***');
    }
    
    //if (this.srv_StMng.IPL.items.filter(x=> (x.value==null || x.value=='0' || x.value=='') && x.required).length==0)  
    if (this.srv_StMng.IPL.items.filter(x=> (x.value==null || (x.value=='0' && x.name!='DiameterBoring' )) && x.required).length==0)    
      {
      this.srv_StMng.IPL.items.filter(x=> x.valuedefault!=x.value).forEach(p=> {                                       
        str=str + '"' + p.name + '":"' + p.value +'",';
        listparams.push(
        {  
          "name": p.name,
          "value": p.value
        })
      });
      str=str.substr (0,str.length-1);
      str="{" + str + "}";     
      this.srv_StMng.IPLChanged = str;            
      this.router.navigate(['/home/results']);
      }    
  }

  GetResult()
  {        
    //this.parentSubject.next('some value');
        
    this.srv_StMng.IPL.GetItem('MainApplication').value = this.srv_StMng.MainAppSelected.MainApp;
    this.srv_StMng.IPL.GetItem('SecondaryApplication').value = this.srv_StMng.SecAppSelected.ApplicationITAID;
    this.srv_StMng.IPL.GetItem('Units').value = this.srv_appsetting.Units;

    let arrMachineSpindle: Machinespindle[];     
    if(this.srv_StMng.arrMachineSpindle != null && typeof(this.srv_StMng.arrMachineSpindle) !== 'undefined') 
    {   
      this.FillMachineData(this.srv_StMng.arrMachineSpindle);        
      this.FillDataInputParamAndRouteToResult();
    }
    else
    {
      this.eventsSubscription.add( this.srv_machine.getmachinedetailed(this.srv_StMng.SelectedMachine.MachineID,this.srv_appsetting.Units).subscribe((res: any) => 
       { 
        arrMachineSpindle = JSON.parse(res);         
        this.FillMachineData(arrMachineSpindle); 
        this.FillDataInputParamAndRouteToResult();
      }));     
    }            
  } 
  
 
}