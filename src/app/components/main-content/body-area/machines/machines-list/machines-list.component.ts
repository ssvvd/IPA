import { Component, OnInit} from '@angular/core';
import { Machineheader } from 'src/app/models/machines/machineheader';
import { MachineFilter } from 'src/app/models/machines/machinefilter';
import { MachineService } from 'src/app/services/machine.service' ;
import { StateManagerService } from 'src/app/services/statemanager.service' ;
import { environment } from 'src/environments/environment';
import * as $ from 'jquery';
import { DataTableDirective } from 'angular-datatables';

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
  MachineFilter:MachineFilter;  
  environment = environment;
  MachineIDSelected = 0;

  datatableElement: DataTableDirective;

  constructor(private srv_machine: MachineService,private srv_statemanage:StateManagerService) 
  {                 
  }  
   
  ngOnInit() {     
      this.dtOptions = {
        pagingType: 'full_numbers',
       "searching": false,
       "lengthChange": false ,
       "paging":false,          
      };  

      this.srv_machine.getmachines().subscribe((res:any)=>{
      this.listmachines=JSON.parse(res); 
      this.listmachines_sorted=this.listmachines; 
      let stfilter:MachineFilter;
      stfilter=this.srv_statemanage.GetMachineFilter();
      if (typeof(stfilter)!== 'undefined' && stfilter !== null ) 
      {
        this.MachineFilter=stfilter;
        this.ApplyFilter(this.MachineFilter);
      }
       if (this.srv_statemanage.GetMachineSelected()== null)
          this.UpdateStateSelectedMachine(-1);
       else
          this.UpdateStateSelectedMachine(this.srv_statemanage.GetMachineSelected().MachineID);              
    })    
  }  
  
  OnViewMachine(mach:Machineheader)
  {
    this.srv_statemanage.ViewMachine(mach);
  }

  UpdateStateSelectedMachine(MachineID:number)
  {
     this.listmachines_sorted.forEach((m) => {
       m.DescSelect="Select";
       if(MachineID==m.MachineID)          
           m.IsSelected=true;                    
        else          
          m.IsSelected=false;                           
    });
  } 

  OnSelectMachine(mach:Machineheader)
  {   
    this.UpdateStateSelectedMachine(mach.MachineID)   ;       
    this.srv_statemanage.SelectMachine(mach);
    this.srv_statemanage.SetMachineFilter (this.MachineFilter);
  }

  onMachineFilterChanged($event)
  {
    this.MachineFilter =$event.filter; 
    this.ApplyFilter($event.filter); 
     if (this.srv_statemanage.GetMachineSelected()== null)
        this.UpdateStateSelectedMachine(-1);
     else
        this.UpdateStateSelectedMachine(this.srv_statemanage.GetMachineSelected().MachineID);           
  }
  
  onMachineFilterClear()
  {
    this.listmachines_sorted=this.listmachines;
  }

  ApplyFilter(filter:MachineFilter)
  {
    this.listmachines_sorted=this.listmachines.filter(
      m => m.SpindleSpeed >= filter.SpeedMin && m.SpindleSpeed <= filter.SpeedMax && 
           m.Power >= filter.PowerMin && m.Power <= filter.PowerMax &&
           m.Torque >= filter.TorqueMin && m.Torque <= filter.TorqueMax &&
           ((!filter.IsMachiningCenter && m.MachineType!="Machining center") || filter.IsMachiningCenter) && 
           ((!filter.IsLathe && m.MachineType!="Lathe") || filter.IsLathe) &&
           ((!filter.IsMultiTask && m.MachineType!="Multi task") || filter.IsMultiTask)   
           && (m.MachineName.toUpperCase().indexOf(filter.SearchText.toUpperCase())>-1        
          ));         
  }
}


