import { Component, OnInit,Output,EventEmitter,Directive,Input,QueryList, ViewChildren} from '@angular/core';
import { Machineheader } from 'src/app/models/machines/machineheader';
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
  listmachines:Machineheader [];
  listmachines_sorted:Machineheader [];
    
  environment = environment;
  //@Output() MachineSelect = new EventEmitter();
  MachineIDSelected = 0;
    
  constructor(private serv: MachineService,private ser_state:StateManagerService) 
  {                 
  }
   
  ngOnInit() {         
      this.serv.getmachines().subscribe((res:any)=>{
      this.listmachines=JSON.parse(res );
      this.listmachines_sorted=this.listmachines_sorted;
    })
  }    
}


