import { Component, OnInit ,Output,EventEmitter} from '@angular/core';
import { Options,ChangeContext } from 'ng5-slider';
import { MachineFilter } from 'src/app/models/machines/machinefilter';
import { StateManagerService } from 'src/app/services/statemanager.service' ;

@Component({
  selector: 'app-machines-filter',
  templateUrl: './machines-filter.component.html',
  styleUrls: ['./machines-filter.component.scss']
})

export class MachinesFilterComponent implements OnInit {
  
  @Output() MachineFilterChanged = new EventEmitter<{filter: MachineFilter}>();
 
  machFilter:MachineFilter;

  options_speed: Options = {
    floor: 0,
    ceil: 19000,
    step: 1000,
    showTicks: true
  };

  options_power: Options = {
    floor: 0,
    ceil: 200,
    step: 10,
    showTicks: true
  };

  options_torque: Options = {
    floor: 0,
    ceil: 12000,
    step: 1000,
    showTicks: true
  };

  constructor(private srv_statemanage:StateManagerService) { }
 
  ngOnInit() {
    this.InitFilterSliders();
    let statefilter:MachineFilter;
    statefilter=this.srv_statemanage.GetMachineFilter();
    if (typeof(statefilter) !== 'undefined' && statefilter !== null )     
        this.machFilter=this.srv_statemanage.GetMachineFilter();                   
  }
  
  InitFilterSliders()
  {
    this.machFilter=new MachineFilter;
    this.machFilter.IsMachiningCenter =true;
    this.machFilter.IsLathe =true;
    this.machFilter.IsMultiTask =true;
    
    //todo:
    this.machFilter.SpeedMin = 1000; 
    this.machFilter.SpeedMax = 18000;
    
    this.machFilter.PowerMin = 0;
    this.machFilter.PowerMax = 200;  
    
    this.machFilter.TorqueMin = 0;
    this.machFilter.TorqueMax = 12000; 
  }

  FilterChange(event: ChangeContext ) {      
    this.MachineFilterChanged.emit({ filter: this.machFilter});   
  }
}