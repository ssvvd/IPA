import { Component, OnInit,Input,HostListener } from '@angular/core';
import { DatalayerService} from 'src/app/services/datalayer.service' ;
import { InputParameterItem } from 'src/app/models/operational-data/inputparameteritem';
import { InputParameterlist } from 'src/app/models/operational-data/inputparameterlist';
import { StateManagerService} from 'src/app/services/statemanager.service' ;
import { MachineService } from 'src/app/services/machine.service' ;
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
  Ipl:InputParameterlist =new InputParameterlist;
 
  SecAppName:string;
  opendetails:boolean =false;
  showistoodata:boolean=false;
  router:Router;
  isLoaded:boolean=false;
  
  parentSubject:Subject<any> = new Subject();

  constructor(private srv_machine: MachineService,router:Router,private srv_DataLayer:DatalayerService,private srv_StMng:StateManagerService) 
  {
    this.router=router;
   }
  
  ngOnInit() {   
    if(typeof(this.srv_StMng.SecAppSelected)!== 'undefined' && this.srv_StMng.SecAppSelected !== null)
        {
          this.SecApp = this.srv_StMng.SecAppSelected.ApplicationITAID;
          this.SecAppName = this.srv_StMng.SecAppSelected.MenuName;
        } 

   if (this.srv_StMng.IPL!= null)
    {
     this.Ipl=this.srv_StMng.IPL;
     this.isLoaded=true;  
    }
   else
      this.srv_DataLayer.getinputparameters(this.SecApp,'M').subscribe((data: any)=> {
        for (const d of JSON.parse(data)) {                                       
              this.Ipl.items.push({
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
        this.isLoaded=true;  
    }
)
};

  @HostListener('window:resize', ['$event'])
  onResize(event) {  
    if(event.target.innerWidth<900)
      this.showistoodata=false;  
    else
      this.showistoodata=true;
  }

  showtooldata()
  {
    this.showistoodata =!this.showistoodata;
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
       
      this.Ipl.GetItem('AdaptorType').value =ms.AdaptationType;
      this.Ipl.GetItem('AdaptorSize').value =ms.AdaptationSize;

      this.Ipl.GetItem('PW_AX').value = ms.N1+""; 
      this.Ipl.GetItem('PW_BX').value = ms.N2+"";
      this.Ipl.GetItem('PW_CX').value = ms.N3+"";

      this.Ipl.GetItem('PW_AY').value = ms.P1 +""; 
      this.Ipl.GetItem('PW_BY').value = ms.P2 +"";
      this.Ipl.GetItem('PW_CY').value = ms.P3 + ""; 
  }
  
  FillDataInputParamAndRouteToResult()
  {
    this.Ipl.GetItem('Material').value =String(this.srv_StMng.GetMaterialSelected().id);
    // this.Ipl.GetItem('HardnessHB').value =this.srv_StMng.GetMaterialSelected().Hardness;

    this.srv_StMng.IPL=this.Ipl; 
    let listparams: { name: string, value: string }[]=[];
    let JSONParams:string; 
    let str:string='';

    if (this.Ipl.items.filter(x=> x.value==null && x.required).length==0)    
      {
      this.Ipl.items.filter(x=> x.valuedefault!=x.value).forEach(p=> {   
        str=str + '"' + p.name + '":"' + p.value +'",';
        listparams.push(
        {
          "name": p.name,
          "value": p.value
        })
      });
      str=str.substr (0,str.length-1);
      str="{" + str + "}"; 
      //this.srv_StMng.IPL_ListChanged = listparams;
      this.srv_StMng.IPLChanged = str;
      //JSONParams = JSON.stringify(listparams); 
      //this.srv_StMng.IPLChanged=JSONParams;      
      this.router.navigate(['/home/results']);
      }    
  }

  GetResult()
  {        
    this.parentSubject.next('some value');
        
    this.Ipl.GetItem('MainApplication').value = this.srv_StMng.MainAppSelected.MainApp;
    this.Ipl.GetItem('SecondaryApplication').value = this.srv_StMng.SecAppSelected.ApplicationITAID;

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