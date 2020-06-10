import { Component, OnInit ,Output,EventEmitter} from '@angular/core';
import { Options,ChangeContext } from 'ng5-slider';
import { MachineFilter } from 'src/app/models/machines/machinefilter';
import { StateManagerService } from 'src/app/services/statemanager.service' ;
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-machines-filter',
  templateUrl: './machines-filter.component.html',
  styleUrls: ['./machines-filter.component.scss']
})

export class MachinesFilterComponent implements OnInit {
  
  @Output() MachineFilterChanged = new EventEmitter<{filter: MachineFilter}>();
  @Output() MachineFilterClear = new EventEmitter();
  machFilter:MachineFilter;
  environment=environment;
  options_speed: Options = {
    floor: 0,
    ceil: 19000,
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

  constructor(private srv_statemanage:StateManagerService) { }
 
  ngOnInit() {
    this.InitFilterSliders();      
    let statefilter:MachineFilter;    
    statefilter=this.srv_statemanage.SelectMachineFilter;
    if (typeof(statefilter) !== 'undefined' && statefilter !== null )     
        this.machFilter=statefilter;  
    this.MachineFilterChanged.emit({ filter: this.machFilter});                  
  }   

  InitFilterSliders()
  {
    this.machFilter=new MachineFilter;
    this.machFilter.IsMachiningCenter =true;
    this.machFilter.IsLathe =true;
    this.machFilter.IsMultiTask =true;
    this.machFilter.IsMultiSpindle =true;
    this.machFilter.IsSwissType =true;

    //todo:
    this.machFilter.SpeedMin = 0; 
    this.machFilter.SpeedMax = 19000;
    
    this.machFilter.PowerMin = 0;
    this.machFilter.PowerMax = 200;  
    
    this.machFilter.TorqueMin = 0;
    this.machFilter.TorqueMax = 12000; 
  }

  FilterChange(event: ChangeContext ) {          
    this.MachineFilterChanged.emit({ filter: this.machFilter});   
  }

  ClearFilter ()
  {
    this.MachineFilterClear.emit();
    this.InitFilterSliders();
    this.machFilter.IsMachiningCenter =true;
    this.machFilter.IsLathe =true;
    this.machFilter.IsMultiTask =true;
    this.machFilter.IsMultiSpindle =true;
    this.machFilter.IsSwissType =true; 
  }

}
