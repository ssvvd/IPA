import { Component, OnInit ,Input,OnChanges, SimpleChanges} from '@angular/core';
import { MachineService } from 'src/app/services/machine.service' ;
import { Machinespindle } from 'src/app/models/machines/machinespindle';
import { StateManagerService} from 'src/app/services/statemanager.service' ;
import { Observable, Subject,Subscription } from 'rxjs';

export class AdaptationType
{
  AdaptationType:string;  
}

export class AdaptationSize
{
  AdaptationType:string;
  AdaptationSize:string;
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
  arrAdapType:AdaptationType[]=[];
  arrAdapSize:AdaptationSize[]=[];
  arrAdapSizeFilter:AdaptationSize[]=[];

  curAdapType:AdaptationType;
  curAdapSize:AdaptationSize;
  isLoadingAdSize:boolean=false;
  private eventsSubscription: Subscription=new Subscription();

  constructor(private serv: MachineService,private srv_statemanage:StateManagerService) {}

  ngOnInit() 
  {    
    if(this.spindle.SpindleType=="M")  this.DescSpindle="Main Spindle";
    if(this.spindle.SpindleType=="T")  this.DescSpindle="Tool Spindle";
    this.eventsSubscription.add(this.serv.getmachineadaptationtype().subscribe((res: any) => {
        this.arrAdapType = JSON.parse(res); 
        this.curAdapType=this.arrAdapType.find(e=> e.AdaptationType == this.spindle.AdaptationType );            
        //this.curAdapType= this.spindle.AdaptationType;
        this.eventsSubscription.add(this.serv.getmachineadaptationsize().subscribe((res: any) => {
        this.arrAdapSize = JSON.parse(res); 
        this.curAdapSize=this.arrAdapSize.find(e=> e.AdaptationType == this.spindle.AdaptationType && e.AdaptationSize === this.spindle.AdaptationSize);                      
        this.arrAdapSizeFilter=this.arrAdapSize.filter(e=> e.AdaptationType == this.spindle.AdaptationType);               
        this.isLoadingAdSize =true;
      }));         
    })); 
              
      this.spindle.EmultionPressure = 25;//TODO:
      this.spindle.EmultionFlowRate = 40;
  }
  
  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }
  
  changeadaptype()
  {     
    this.spindle.AdaptationType = this.curAdapType.AdaptationType;  
    this.arrAdapSizeFilter=this.arrAdapSize.filter(e=> e.AdaptationType == this.curAdapType.AdaptationType);    
    this.curAdapSize=this.arrAdapSizeFilter[0];
    this.spindle.AdaptationSize = this.curAdapSize.AdaptationSize;
  }
  
  changeadapsize()
  {  
    this.spindle.AdaptationSize = this.curAdapSize.AdaptationSize;        
  }

  onSpindleSpeedChanged($event)
  {      
    this.spindle.SpindleSpeed =$event.value;
  }

  onPowerChanged($event)
  {     
    this.spindle.Power =$event.value;
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
              //alert(changes[property].currentValue);
            }
          }          
      }
  }
}