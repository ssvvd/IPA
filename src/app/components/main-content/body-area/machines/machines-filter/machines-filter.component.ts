import { Component, OnInit ,Output,EventEmitter,Input} from '@angular/core';
import { Options,ChangeContext } from 'ng5-slider';
import { MachineFilter } from 'src/app/models/machines/machinefilter';
import { StateManagerService } from 'src/app/services/statemanager.service' ;
import { MachineService } from 'src/app/services/machine.service' ;
import { CookiesService } from 'src/app/services/cookies.service';
import { Machineheader } from 'src/app/models/machines/machineheader';
import { AppsettingService} from 'src/app/services/appsetting.service';
import { environment } from 'src/environments/environment';
import { Subscription ,Observable} from 'rxjs';

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
  selector: 'app-machines-filter',
  templateUrl: './machines-filter.component.html',
  styleUrls: ['./machines-filter.component.scss']
})
  
export class MachinesFilterComponent implements OnInit {
  
  @Input() onChangeFavorite: Observable<void>;
  @Input() onChangeMachineList: Observable<number[]>;

 /*  @Input() machineslist:Machineheader[]; */

  private eventsSubscription: Subscription=new Subscription();

  @Output() MachineFilterChanged = new EventEmitter<{filter: MachineFilter}>();
  @Output() MachineFilterClear = new EventEmitter();
  
   minPower:number=0;
   maxPower:number=0;
   minSpeed:number=0;
   maxSpeed:number=0;
   minTorque:number=0;
   maxTorque:number=0;
   isslider:boolean=false;
  machFilter:MachineFilter;
  environment=environment;
 

   options_speed: Options = {
    floor: 0,
    ceil: 30000,
    step: 1000,
    showTicks: false
  };

  options_power: Options = {
    floor: 2,
    ceil: 75,
    step: 1,
    showTicks: false
  };

  options_torque: Options = {
    floor: 0,
    ceil: 12000,
    step: 1000,
    showTicks: false
  };
   
  
  constructor(private serv: MachineService,private srv_statemanage:StateManagerService,private srv_cook:CookiesService,
              public srv_appsetting:AppsettingService) { }
  
  arrAdapType:AdaptationType[]=[];
  arrAdapSize:AdaptationSize[]=[];
  arrAdapSizeFilter:AdaptationSize[]=[];
  arrFavorites:Machineheader[]=[];
  curAdapType:AdaptationType;
  curAdapSize:AdaptationSize;
  arrMachines: Machineheader[] = [];
  isMostRecom:string = '1';

  isLoadingAdSize:boolean=false;  
  
  ngOnInit() {

    this.srv_statemanage.ReloadMachineTab.subscribe(arr => this.Initializedata());  // todo: 
    this.machFilter=new MachineFilter;
    this.Initializedata();
  }

  Initializedata ()
  {        
        this.eventsSubscription.add( this.onChangeMachineList.subscribe((d) => this.ChangeMachineList(d)));                       
        this.eventsSubscription.add(this.serv.getmachineadaptationtype('').subscribe((res: any) => {
          this.arrAdapType = JSON.parse(res); 
          this.arrAdapType.unshift( { AdaptationType:''});      
          this.curAdapType=this.arrAdapType[0];                          
          this.eventsSubscription.add(this.serv.getmachineadaptationsize(this.srv_appsetting.Units).subscribe((res: any) => {
          this.arrAdapSize = JSON.parse(res); 
          this.arrAdapSize.unshift( { AdaptationType:'',AdaptationSize:''});      
                
          this.arrAdapSizeFilter=[];
          
          this.eventsSubscription.add(this.serv.getmachines(this.srv_appsetting.Units,this.srv_appsetting.UserID)
          .subscribe((data: any) => {        
            this.arrMachines = JSON.parse(data);                 
                       
            if(this.arrMachines.length>0)
            {
              this.minPower = Math.min.apply(Math,this.arrMachines.map(a => a['Power']).filter(function(val) { if(typeof val ==='number' || typeof val ==='string'){return val;} }))   
              this.maxPower = Math.max.apply(Math,this.arrMachines.map(a => a['Power']).filter(function(val) { if(typeof val ==='number' || typeof val ==='string'){return val;} }))    
              this.minSpeed = Math.min.apply(Math,this.arrMachines.map(a => a['SpindleSpeed']).filter(function(val) { if(typeof val ==='number' || typeof val ==='string'){return val;} }))    
              this.maxSpeed = Math.max.apply(Math,this.arrMachines.map(a => a['SpindleSpeed']).filter(function(val) { if(typeof val ==='number' || typeof val ==='string'){return val;} }))    
              this.minTorque = Math.min.apply(Math,this.arrMachines.map(a => a['Torque']).filter(function(val) { if(typeof val ==='number' || typeof val ==='string'){return val;} }))    
              this.maxTorque = Math.max.apply(Math,this.arrMachines.map(a => a['Torque']).filter(function(val) { if(typeof val ==='number' || typeof val ==='string'){return val;} }))                                
              
              this.options_power = {
                floor: this.minPower,
                ceil: this.maxPower, 
                step: 1,
                showTicks: false
              };
              //alert(s);
              this.options_speed = {
                floor: this.minSpeed,
                ceil: this.maxSpeed,
                step: 100,
                showTicks: false
              };    
              this.options_torque = {
                floor:this.minTorque,
                ceil: this.maxTorque,
                step: 100,
                showTicks: false
              };
            }        
            this.InitFilter(); 
            
            let statefilter:MachineFilter;    
            statefilter=this.srv_statemanage.SelectMachineFilter;
            if (typeof(statefilter) !== 'undefined' && statefilter !== null ) 
            {    
                this.machFilter=statefilter;           
                this.curAdapType = { AdaptationType:this.machFilter.AdaptationType} ;
                this.curAdapSize = { AdaptationType:this.machFilter.AdaptationType,AdaptationSize:this.machFilter.AdaptationSize} ;
                this.MachineFilterChanged.emit({ filter: this.machFilter});
            }
            
            this.isLoadingAdSize =true;
          }));     
          
        }));         
      }));
  }

  ChangeMachineList(s:number[])
  {
    this.machFilter.PowerMin=s[0];
    //alert(this.machFilter.PowerMin);
    this.machFilter.PowerMax=s[1];
    this.machFilter.SpeedMin=s[2];
    this.machFilter.SpeedMax=s[3];
    this.machFilter.TorqueMin=s[4];
    this.machFilter.TorqueMax=s[5];    
  }

  changeismost()
  {
    if(this.isMostRecom=='1')  
      {this.machFilter.IsMostRecommended =true;}
    else
      {this.machFilter.IsMostRecommended =false;}
  }

  changeadaptype()
  {        
    if(this.curAdapType.AdaptationType=='')
    {
      this.arrAdapSizeFilter=[];
      this.arrAdapSize.forEach((m) => {
       if(this.arrAdapSizeFilter.filter(mm=>mm.AdaptationSize==m.AdaptationSize).length==0)
        this.arrAdapSizeFilter.push(m);     
      });
    }      
    else
      this.arrAdapSizeFilter=this.arrAdapSize.filter(e=> e.AdaptationType == this.curAdapType.AdaptationType);  
      this.arrAdapSizeFilter.unshift( { AdaptationType:'',AdaptationSize:''});
      this.curAdapSize=this.arrAdapSizeFilter[0];
      this.machFilter.AdaptationType =this.curAdapType.AdaptationType;
      this.machFilter.AdaptationSize ='';
      this.FilterChange (null,false,false,false);  
  }
  changeadapsize()
  {  
    this.machFilter.AdaptationSize=this.curAdapSize.AdaptationSize;
    this.FilterChange (null,false,false,false);       
  }
  InitFilter()
  {
    this.machFilter=new MachineFilter;
    this.machFilter.IsMachiningCenter =true;
    this.machFilter.IsLathe =true;
    this.machFilter.IsMultiTask =true;
    this.machFilter.IsMultiSpindle =true;
    this.machFilter.IsSwissType =true;
    this.machFilter.IsMachineTypeStandard=true;
    this.machFilter.IsMachineTypeHeavyDuty=true;
    this.machFilter.IsMachineTypeHighSpeed=true;
    //todo:
    
    this.machFilter.PowerMin = this.minPower;
    this.machFilter.PowerMax = this.maxPower;

    this.machFilter.SpeedMin = this.minSpeed; 
    this.machFilter.SpeedMax = this.maxSpeed;
        
    this.machFilter.TorqueMin = this.minTorque;
    this.machFilter.TorqueMax = this.maxTorque; 

    this.machFilter.AdaptationType ='';
    this.machFilter.AdaptationSize ='';

    this.machFilter.IsMostRecommended=true;
    this.isMostRecom='1';
    this.machFilter.ShowOnlyFavorites=false;    
    this.machFilter.IsSliderPower=false;
    this.machFilter.IsSliderSpeed=false;
    this.machFilter.IsSliderTorque=false;
  }

  FilterChange(event: ChangeContext ,issliderP:boolean,issliderS:boolean,issliderT:boolean) {  
    this.machFilter.IsSliderPower =issliderP;        
    this.machFilter.IsSliderSpeed =issliderS;        
    this.machFilter.IsSliderTorque =issliderT; 
           
    this.MachineFilterChanged.emit({ filter: this.machFilter});   
  }
  
  SetViewAllMachines()
  {
    this.machFilter.IsMostRecommended=false;
    this.isMostRecom ='0';
  }
  ClearFilter ()
  {    
    this.InitFilter();
    this.machFilter.IsMachiningCenter =true;
    this.machFilter.IsLathe =true;
    this.machFilter.IsMultiTask =true;
    this.machFilter.IsMultiSpindle =true;
    this.machFilter.IsSwissType =true; 
    this.machFilter.IsMachineTypeStandard=true;
    this.machFilter.IsMachineTypeHeavyDuty=true;
    this.machFilter.IsMachineTypeHighSpeed=true;
    this.machFilter.ShowOnlyFavorites=false;
    this.machFilter.IsMostRecommended=true;

   
    this.machFilter.IsSliderPower=false;
    this.machFilter.IsSliderSpeed=false;
    this.machFilter.IsSliderTorque=false;
    this.isMostRecom='1';
    this.curAdapType=this.arrAdapType[0]; 
    this.curAdapSize=this.arrAdapSize[0];
    
    //this.MachineFilterClear.emit();
    this.MachineFilterChanged.emit({ filter: this.machFilter});
    
     this.machFilter.PowerMin = this.minPower;
    this.machFilter.PowerMax = this.maxPower;

    this.machFilter.SpeedMin = this.minSpeed; 
    this.machFilter.SpeedMax = this.maxSpeed;
        
    this.machFilter.TorqueMin = this.minTorque;
    this.machFilter.TorqueMax = this.maxTorque; 
    
  }

}
