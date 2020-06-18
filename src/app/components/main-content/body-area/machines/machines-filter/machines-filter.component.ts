import { Component, OnInit ,Output,EventEmitter} from '@angular/core';
import { Options,ChangeContext } from 'ng5-slider';
import { MachineFilter } from 'src/app/models/machines/machinefilter';
import { StateManagerService } from 'src/app/services/statemanager.service' ;
import { MachineService } from 'src/app/services/machine.service' ;
import { CookiesService } from 'src/app/services/cookies.service';
import { Machineheader } from 'src/app/models/machines/machineheader';
import { AppsettingService} from 'src/app/services/appsetting.service';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';

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
  
  private eventsSubscription: Subscription=new Subscription();

  @Output() MachineFilterChanged = new EventEmitter<{filter: MachineFilter}>();
  @Output() MachineFilterClear = new EventEmitter();

  machFilter:MachineFilter;
  environment=environment;
  options_speed: Options = {
    floor: 0,
    ceil: 30000,
    step: 1000,
    showTicks: false
  };

  options_power: Options = {
    floor: 0,
    ceil: 200,
    step: 10,
    showTicks: false
  };

  options_torque: Options = {
    floor: 0,
    ceil: 12000,
    step: 1000,
    showTicks: false
  };
  
  
  constructor(private serv: MachineService,private srv_statemanage:StateManagerService,private srv_cook:CookiesService,
              private srv_appsetting:AppsettingService) { }
  
  arrAdapType:AdaptationType[]=[];
  arrAdapSize:AdaptationSize[]=[];
  arrAdapSizeFilter:AdaptationSize[]=[];
  arrFavorites:Machineheader[]=[];
  curAdapType:AdaptationType;
  curAdapSize:AdaptationSize;
  arrMachines: Machineheader[] = [];
  isLoadingAdSize:boolean=false;
  
  ngOnInit() {
    this.srv_cook.MachineFavorite.subscribe(fav => this.SetFavorites(fav));
    this.InitFilter();                    
    this.eventsSubscription.add(this.serv.getmachineadaptationtype().subscribe((res: any) => {
      this.arrAdapType = JSON.parse(res); 
      this.arrAdapType.unshift( { AdaptationType:''});      
      this.curAdapType=this.arrAdapType[0];                          
      this.eventsSubscription.add(this.serv.getmachineadaptationsize().subscribe((res: any) => {
      this.arrAdapSize = JSON.parse(res); 
      this.arrAdapSize.unshift( { AdaptationType:'',AdaptationSize:''});      
      
      let statefilter:MachineFilter;    
      statefilter=this.srv_statemanage.SelectMachineFilter;
      if (typeof(statefilter) !== 'undefined' && statefilter !== null ) 
      {    
          this.machFilter=statefilter;  
          this.curAdapType = { AdaptationType:this.machFilter.AdaptationType} ;
          this.curAdapSize = { AdaptationType:this.machFilter.AdaptationType,AdaptationSize:this.machFilter.AdaptationSize} ;
      }
      //this.MachineFilterChanged.emit({ filter: this.machFilter});
      this.eventsSubscription.add(this.serv.getmachines(this.srv_appsetting.Units)
      .subscribe((data: any) => {        
        this.arrMachines = JSON.parse(data); 
        this.SetFavorites(this.srv_cook.get_cookielist("fav_machines"));  
           
        this.isLoadingAdSize =true;
      }));     
      
    }));         
  }));    
  }   
  
  SetFavorites(arr_fav:string[])
  {     
    //fav=' ' + fav + ' ';
    this.arrFavorites=[];
    if(arr_fav.length>0)                   
        this.arrMachines.forEach(m=>{if(arr_fav.indexOf( m.MachineID.toString() )>-1) this.arrFavorites.push(m)} );               
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
      this.FilterChange (null);  
  }
  changeadapsize()
  {  
    this.machFilter.AdaptationSize=this.curAdapSize.AdaptationSize;
    this.FilterChange (null);       
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
    this.machFilter.SpeedMin = 0; 
    this.machFilter.SpeedMax = 30000;
    
    this.machFilter.PowerMin = 0;
    this.machFilter.PowerMax = 200;  
    
    this.machFilter.TorqueMin = 0;
    this.machFilter.TorqueMax = 12000; 

    this.machFilter.AdaptationType ='';
    this.machFilter.AdaptationSize ='';
  }

  FilterChange(event: ChangeContext ) {          
    this.MachineFilterChanged.emit({ filter: this.machFilter});   
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
    this.MachineFilterClear.emit();
  }

}
