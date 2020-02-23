import { Component, OnInit ,Input,OnChanges, SimpleChanges} from '@angular/core';
import { MachineService } from 'src/app/services/machine.service' ;
import { Machinespindle } from 'src/app/models/machines/machinespindle';
import { StateManagerService} from 'src/app/services/statemanager.service' ;
import { Observable, Subject } from 'rxjs';

export interface IAdaptationSize
{
  AdaptationType:string;
  AdaptationSize:number;
}

@Component({
  selector: 'app-machine-item-spindle',
  templateUrl: './machine-item-spindle.component.html',
  styleUrls: ['./machine-item-spindle.component.scss']
})

export class MachineItemSpindleComponent implements OnInit 
{  
  @Input() spindle:Machinespindle;   

  DescSpindle:string;
  arrAdapType:string[];
  arrAdapSize:IAdaptationSize[]=[];
  arrAdapSizeFilter:IAdaptationSize[]=[];

  curAdapType:string;
  curAdapSize:IAdaptationSize;
  constructor(private serv: MachineService,private srv_statemanage:StateManagerService) {}

  ngOnInit() 
  {    
    if(this.spindle.SpindleType=="M")  this.DescSpindle="Main Spindle";
    if(this.spindle.SpindleType=="T")  this.DescSpindle="Tool Spindle";
    this.serv.getmachineadaptationtype().subscribe((res: any) => {
        this.arrAdapType = JSON.parse(res); 
        this.curAdapType=this.arrAdapType.find(e=> e == this.spindle.AdaptationType );            
        this.curAdapType= this.spindle.AdaptationType;        
      }); 
      this.serv.getmachineadaptationsize().subscribe((res: any) => {
        this.arrAdapSize = JSON.parse(res); 
        this.curAdapSize=this.arrAdapSize.find(e=> e.AdaptationType == this.spindle.AdaptationType && e.AdaptationSize === this.spindle.AdaptationSize);                      
        this.arrAdapSizeFilter=this.arrAdapSize.filter(e=> e.AdaptationType == this.spindle.AdaptationType);               
      });         
      this.spindle.EmultionPressure = 25;//TODO:
      this.spindle.EmultionFlowRate = 40;
  }
    
  changeadaptype(adapttype:string)
  {  
    this.spindle.AdaptationType = adapttype;  
    this.arrAdapSizeFilter=this.arrAdapSize.filter(e=> e.AdaptationType == adapttype);    
  }
  
  changeadapsize(adaptsize:string)
  {  
    this.spindle.AdaptationSize = adaptsize;        
  }

  onSpindleSpeedChanged($event)
  {      
    this.spindle.SpindleSpeed =$event.value;
  }

  onPowerChanged($event)
  {     
    this.spindle.Power =$event.target.value;
  }

  onTorqueChanged($event)
  {    
    this.spindle.Torque =$event.value;
  }

  ngOnChanges(changes: SimpleChanges) 
  {      
      for (let property in changes) {
          if (property === 'clickedSelect') {   
            if(changes[property].currentValue)
            {                       
              alert(changes[property].currentValue);
            }
          }          
      }
  }
}