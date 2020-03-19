import { Component, OnInit,Input,HostListener } from '@angular/core';
import { DatalayerService} from 'src/app/services/datalayer.service' ;
import { InputParameterItem } from 'src/app/models/operational-data/inputparameteritem';
import { InputParameterlist } from 'src/app/models/operational-data/inputparameterlist';
import { StateManagerService} from 'src/app/services/statemanager.service' ;
import { MachineService } from 'src/app/services/machine.service' ;
import { AppsettingService} from 'src/app/services/appsetting.service';
import { Machinespindle } from 'src/app/models/machines/machinespindle';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-operation-data',
  templateUrl: './operation-data.component.html',
  styleUrls: ['./operation-data.component.scss']
})

export class OperationDataComponent implements OnInit {
  
  SecApp:string;
  //Ipl:InputParameterlist =new InputParameterlist;
 
  SecAppName:string;
  //opendetails:boolean =false;
  //showistoodata:boolean=false;
  router:Router;
  isLoaded:boolean=false;
  
   eventsSubject: Subject<void> = new Subject<void>();

  constructor(private srv_machine: MachineService,router:Router,private srv_DataLayer:DatalayerService,
              private srv_StMng:StateManagerService,private srv_appsetting:AppsettingService) 
  {
    this.router=router;
   }
  
  ngOnInit() {   
    if(typeof(this.srv_StMng.SecAppSelected)!== 'undefined' && this.srv_StMng.SecAppSelected !== null)
        {
          this.SecApp = this.srv_StMng.SecAppSelected.ApplicationITAID;
          this.SecAppName = this.srv_StMng.SecAppSelected.MenuName;
        } 
    let Ipl:InputParameterlist =new InputParameterlist;

    if (this.srv_StMng.IPL== null)    
    {
      this.srv_DataLayer.getinputparameters(this.SecApp,'M').subscribe((data: any)=> {
        for (const d of JSON.parse(data)) {                                       
              Ipl.items.push({
                name:d.name,
                value:  d.valuedefault==null?'':d.valuedefault,
                type:d.type,
                valuedefault: d.valuedefault==null?'':d.valuedefault,              
                valuemin:d.valuemin ,
                valuemax: d.valuemax ,
                image:d.image ,
                required:d.required     
            })                            
              // alert(this.isLoaded);                                  
        }
        this.srv_StMng.IPL =Ipl;
        this.isLoaded=true;  
    }   
      
)
}
else
      this.isLoaded=true;
}
 
  @HostListener('window:resize', ['$event'])
  onResize(event) {  
    if(event.target.innerWidth<900)
      this.srv_StMng.IsTabToolDataOpen=false;  
    else
      this.srv_StMng.IsTabToolDataOpen=true;
  }

  showtooldata()
  {
    this.srv_StMng.IsTabToolDataOpen =!this.srv_StMng.IsTabToolDataOpen;
    //alert(this.srv_StMng.IsTabToolDataOpen);
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
  }
  
  FillDataInputParamAndRouteToResult()
  {
    this.srv_StMng.IPL.GetItem('Material').value = String(this.srv_StMng.GetMaterialSelected().id);
    this.srv_StMng.IPL.GetItem('HardnessHB').value = String(this.srv_StMng.GetMaterialSelected().HardnessHBValue);

    //this.srv_StMng.IPL=this.Ipl; 
    let listparams: { name: string, value: string }[]=[];
    let JSONParams:string; 
    let str:string='';

    if (this.srv_StMng.IPL.items.filter(x=> (x.value==null || x.value=='0') && x.required).length==0)    
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
      this.srv_machine.getmachinedetailed(this.srv_StMng.SelectedMachine.MachineID).subscribe((res: any) => 
       { 
        arrMachineSpindle = JSON.parse(res);         
        this.FillMachineData(arrMachineSpindle); 
        this.FillDataInputParamAndRouteToResult();
      });     
    }            
  }    
}