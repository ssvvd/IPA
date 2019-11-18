import { Component, OnInit,Output,EventEmitter} from '@angular/core';
import { Machineheader } from 'src/app/models/machines/machineheader';
import { MachineService } from 'src/app/services/machine.service' ;
import { Router, Event, NavigationStart, NavigationEnd, NavigationError ,ActivatedRoute} from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-machines-list',
  templateUrl: './machines-list.component.html',
  styleUrls: ['./machines-list.component.scss']  
})

export class MachinesListComponent implements OnInit 
{
  dtOptions: DataTables.Settings = {};  
  listmachines:Machineheader []
  environment = environment;
  @Output() MachineSelect = new EventEmitter();
    MachineIDSelected = 0;
    
  constructor(private serv: MachineService) 
  {                 
  }
   
  ngOnInit() {         
      this.serv.getmachines().subscribe((res:any)=>{
      this.listmachines=JSON.parse(res )        
    })
  }

  MachineSelected(MachineID) { // You can give any function name             
    this.MachineIDSelected = MachineID ;        
    this.MachineSelect.emit(MachineID);
  }
}
