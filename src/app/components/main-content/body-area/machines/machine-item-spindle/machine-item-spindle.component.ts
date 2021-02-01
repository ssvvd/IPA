import { Component, OnInit ,Input,OnChanges, SimpleChanges} from '@angular/core';
import { MachineService } from '../../../../../services/machine.service' ;
import { Machinespindle } from '../../../../../models/machines/machinespindle';
import { AppsettingService} from '../../../../../services/appsetting.service';
import { Subscription ,Subject} from 'rxjs';

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
  eventsSubject: Subject<void> = new Subject<void>();
  private eventsSubscription: Subscription=new Subscription();

  @Input() spindle:Machinespindle;   
  @Input() MachineType:string;
  @Input() exportPDF:boolean=false;
  @Input() machHeader:any;
  DescSpindle:string;  
  arrAdapType:AdaptationType[]=[];
  arrAdapSize:AdaptationSize[]=[];
  arrAdapSizeFilter:AdaptationSize[]=[];

  curAdapType:AdaptationType;
  curAdapSize:AdaptationSize;
  isLoadingAdSize:boolean=false;
  IsSelectedSpindle:boolean;

  public msrv_appsetting:AppsettingService =this.srv_appsetting;

  constructor(private serv: MachineService,public srv_appsetting:AppsettingService) {}

  ngOnInit() 
  {    
    if(this.spindle.SpindleType=="M")  this.DescSpindle="Main Spindle";
    if(this.spindle.SpindleType=="T")  this.DescSpindle="Tool Spindle - ATC";
    if(this.machHeader.SpindleType==this.spindle.SpindleType) 
      this.IsSelectedSpindle=true;
    else
      this.IsSelectedSpindle=false;

    this.eventsSubscription.add(this.serv.getmachineadaptationtype(this.MachineType,this.spindle.SpindleType).subscribe((res: any) => {
        this.arrAdapType = JSON.parse(res); 
        this.curAdapType=this.arrAdapType.find(e=> e.AdaptationType == this.spindle.AdaptationType );                   
        this.eventsSubscription.add(this.serv.getmachineadaptationsize(this.srv_appsetting.Units).subscribe((res: any) => {
        this.arrAdapSize = JSON.parse(res); 
        this.curAdapSize=this.arrAdapSize.find(e=> e.AdaptationType == this.spindle.AdaptationType 
          && e.AdaptationSize === this.spindle.AdaptationSize);  

        //this.arrAdapSizeFilter=this.arrAdapSize.filter(e=> e.AdaptationType == this.spindle.AdaptationType);               
        if(this.MachineType=='Swiss type')
        {
          let maxd:number;
          if(this.srv_appsetting.Units=='M') maxd=20;
          if(this.srv_appsetting.Units=='I') maxd=0.787;
          this.arrAdapSizeFilter=this.arrAdapSize.filter
          (e=> e.AdaptationType == this.curAdapType.AdaptationType && Number(e.AdaptationSize)<=maxd);
        }      
        else
          this.arrAdapSizeFilter=this.arrAdapSize.filter(e=> e.AdaptationType == this.curAdapType.AdaptationType);
        
       

        this.isLoadingAdSize =true;
      }));         
    })); 
    
    if(this.srv_appsetting.Units=='I')
    {
      this.spindle.EmultionPressure = 25 *14.5038;//TODO:
      this.spindle.EmultionFlowRate = 40*0.2642;
    }
    else
    {
      this.spindle.EmultionPressure = 25;//TODO:
      this.spindle.EmultionFlowRate = 40;
    }
    
  }
  
  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }
  
  changeadaptype()
  {     
    this.spindle.AdaptationType = this.curAdapType.AdaptationType;  
    if(this.MachineType=='Swiss type')
      {
        let maxd:number;
        if(this.srv_appsetting.Units=='M') maxd=20;
        if(this.srv_appsetting.Units=='I') maxd=0.787;
        this.arrAdapSizeFilter=this.arrAdapSize.filter
        (e=> e.AdaptationType == this.curAdapType.AdaptationType && Number(e.AdaptationSize)<=maxd);
      }      
    else
      this.arrAdapSizeFilter=this.arrAdapSize.filter(e=> e.AdaptationType == this.curAdapType.AdaptationType);

    this.curAdapSize=this.arrAdapSizeFilter[0];   
  }
  
  filladaptordata(at:string,az:string,st:string)
  {
     this.eventsSubscription.add(this.serv.getmachineadaptationdata(at,az,st,this.srv_appsetting.Units).subscribe((res: any) => {     
       this.spindle =JSON.parse(res)[0];   
       this.spindle.EmultionPressure = 25;//TODO:
       this.spindle.EmultionFlowRate = 40;            
      }));   
  }
  changeadapsize()
  {  
    this.spindle.AdaptationSize = this.curAdapSize.AdaptationSize;        
    //this.filladaptordata(this.curAdapType.AdaptationType, this.curAdapSize.AdaptationSize,this.spindle.SpindleType);    
  }

  onSpindleSpeedChanged($event)
  {      
    this.spindle.SpindleSpeed =$event.value;
  }

  onPowerChanged($event)
  {       
    this.spindle.Power =$event.value; 
  }
  onSpindleChanged($event)
  {
    this.eventsSubject.next();
  }
  onTorqueChanged($event)
  {    
    this.spindle.Torque =$event.value;
  }
  
  onPTChanged($event)
  {    
    this.spindle.Torque =$event.T1;
    this.spindle.Power =$event.P2;
  }
  
  ChangeMachineSpindleType()
  {
    if(this.IsSelectedSpindle)      
        this.machHeader.SpindleType =this.spindle.SpindleType;      
    else
    {
      if(this.spindle.SpindleType=='M')
        this.machHeader.SpindleType ='T';
      else
      this.machHeader.SpindleType ='M';
    } 
  }
  
  

  
}