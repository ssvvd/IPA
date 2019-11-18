import { Component, OnInit ,Input} from '@angular/core';
import { MachineService } from 'src/app/services/machine.service' ;
import { Machinespindle } from 'src/app/models/machines/machinespindle';

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
  constructor(private serv: MachineService) {}

  ngOnInit() {       
    if(this.spindle.SpindleType=="M")  this.DescSpindle="Main Spindle";
    if(this.spindle.SpindleType=="T")  this.DescSpindle="Tool Spindle";
    this.serv.getmachineadaptationtype().subscribe((res: any) => {
        this.arrAdapType = JSON.parse(res); 
        this.curAdapType=this.arrAdapType.find(e=> e == this.spindle.AdaptationType );    
                 
      }); 
      this.serv.getmachineadaptationsize().subscribe((res: any) => {
        this.arrAdapSize = JSON.parse(res); 
        this.curAdapSize=this.arrAdapSize.find(e=> e.AdaptationType == this.spindle.AdaptationType && e.AdaptationSize === this.spindle.AdaptationSize);       
        this.arrAdapSizeFilter=this.arrAdapSize.filter(e=> e.AdaptationType == this.spindle.AdaptationType);
      });   
      
      this.spindle.EmultionPressure =25;
      this.spindle.EmultionFlowRate =40;

  }
  
  changeadaptype(adapttype:string)
  {    
    this.arrAdapSizeFilter=this.arrAdapSize.filter(e=> e.AdaptationType == adapttype);    
  }
}
