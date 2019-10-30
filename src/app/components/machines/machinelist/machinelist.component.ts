import { Component, OnInit,Output,EventEmitter} from '@angular/core';

import {machine} from './machine';
import { MachineService } from '../../../services/machine.service'

@Component({
  selector: 'app-machinelist',
  templateUrl: './machinelist.component.html',
  styleUrls: ['./machinelist.component.scss']  
})

export class MachineListComponent implements OnInit 
{
  dtOptions: DataTables.Settings = {};  
  listmachines:machine []
 
  @Output() MachineSelect = new EventEmitter();
    MachineIDSelected = 0;
    
  constructor(private serv: MachineService) {                 
  }
   
  ngOnInit() {         
      this.serv.getmachines().subscribe((res:any)=>{
      this.listmachines=JSON.parse(res )        
    })
  }

MachineSelected(MachineID) { // You can give any function name       
        this.MachineIDSelected = MachineID         
        this.MachineSelect.emit(MachineID)
    }
}
