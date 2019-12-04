import { Component, OnInit} from '@angular/core';
import { Machineheader } from 'src/app/models/machines/machineheader';
import { MachineFilter } from 'src/app/models/machines/machinefilter';
import { MachineService } from 'src/app/services/machine.service' ;
import { StateManagerService } from 'src/app/services/statemanager.service' ;
import { environment } from 'src/environments/environment';
import * as $ from 'jquery';

@Component({
  selector: 'app-machines-list',
  templateUrl: './machines-list.component.html',
  styleUrls: ['./machines-list.component.scss']  
})

export class MachinesListComponent implements OnInit 
{
  dtOptions: DataTables.Settings = {};
  listmachines:Machineheader []=[];
  listmachines_sorted:Machineheader []=[];
    
  environment = environment;
  MachineIDSelected = 0;

  constructor(private srv_machine: MachineService,private srv_statemanage:StateManagerService) 
  {                 
  }  
   
  ngOnInit() {     
      this.srv_machine.getmachines().subscribe((res:any)=>{
      this.listmachines=JSON.parse(res ); 
      this.listmachines_sorted=this.listmachines;  
      this.listmachines_sorted.forEach((m) => {        
          m.IsSelected=false;       
          m.DescSelect="Select";
          if (this.srv_statemanage.GetMachineSelected()!= null) 
            if(m.MachineID==this.srv_statemanage.GetMachineSelected().MachineID) 
            {            
              m.IsSelected=true;
              m.DescSelect="Selected";            
            }
      });    
    })

     this.dtOptions = {
      pagingType: 'full_numbers',
       "searching": false,
       "lengthChange": false ,
       "paging":false,          
    };  
  }  
  
   OnSelectMachine(mach:Machineheader)
  {           
     this.listmachines.forEach((m) => {
        if(mach.MachineID==m.MachineID)
          {
           m.IsSelected=true;
           m.DescSelect="Selected";
          }
        else
          {
          m.IsSelected=false;       
          m.DescSelect="Select";
          }
    });
    this.srv_statemanage.change_machine(mach);
  }

  onMachineFilterChanged($event)
  {
    let filter:MachineFilter;
    filter =$event.filter;            
    this.listmachines_sorted=this.listmachines.filter(
      m => m.SpindleSpeed >= filter.SpeedMin && m.SpindleSpeed <= filter.SpeedMax && 
           m.Power >= filter.PowerMin && m.Power <= filter.PowerMax &&
           m.Torque >= filter.TorqueMin && m.Torque <= filter.TorqueMax &&
           ((!filter.IsMachiningCenter && m.MachineType!="Machining center") || filter.IsMachiningCenter) && 
           ((!filter.IsLathe && m.MachineType!="Lathe") || filter.IsLathe) &&
           ((!filter.IsMultiTask && m.MachineType!="Multi task") || filter.IsMultiTask));     
  }
}


