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
  isMostRecom:string = '1';
 
  isLoadingAdSize:boolean=false;
  
  
  ngOnInit() {
    this.srv_cook.MachineFavorite.subscribe(fav => this.ChangeFavorite());
    this.InitFilter();  
    this.eventsSubscription.add( this.onChangeFavorite.subscribe(() => this.ChangeFavorite()));                        
    this.eventsSubscription.add(this.serv.getmachineadaptationtype().subscribe((res: any) => {
      this.arrAdapType = JSON.parse(res); 
      this.arrAdapType.unshift( { AdaptationType:''});      
      this.curAdapType=this.arrAdapType[0];                          
      this.eventsSubscription.add(this.serv.getmachineadaptationsize(this.srv_appsetting.Units).subscribe((res: any) => {
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
      this.MachineFilterChanged.emit({ filter: this.machFilter});
      this.eventsSubscription.add(this.serv.getmachines(this.srv_appsetting.Units,this.srv_appsetting.UserID)
      .subscribe((data: any) => {        
        this.arrMachines = JSON.parse(data); 
           this.SetFavorites();  
        //this.SetFavorites();   
        this.isLoadingAdSize =true;
      }));     
      
    }));         
  }));    
  }   
  
  changeismost()
  {
    if(this.isMostRecom=='1')  
      {this.machFilter.IsMostRecommended =true;}
    else
      {this.machFilter.IsMostRecommended =false;}
  }
  SetFavorites()
  {       
    this.arrFavorites=[];
    this.arrMachines.forEach(m=>{if(m.isFavorite) this.arrFavorites.push(m)} );                    
  } 
  
  ChangeFavorite()
  { 
    this.eventsSubscription.add(this.serv.getmachines(this.srv_appsetting.Units,this.srv_appsetting.UserID)
    .subscribe((data: any) => {        
      this.arrMachines = JSON.parse(data); 
      this.arrFavorites=[];
      this.arrMachines.forEach(m=>{if(m.isFavorite) this.arrFavorites.push(m)} );           
      this.isLoadingAdSize =true;
    }));     
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

    this.machFilter.IsMostRecommended=true;
    this.machFilter.ShowOnlyFavorites=false;
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
    this.machFilter.ShowOnlyFavorites=false;
    this.curAdapType=this.arrAdapType[0]; 
    this.curAdapSize=this.arrAdapSize[0];
    
    //this.MachineFilterClear.emit();
    this.MachineFilterChanged.emit({ filter: this.machFilter});   
  }

}
