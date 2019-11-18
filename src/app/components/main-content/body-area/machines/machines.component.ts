import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-machines',
  templateUrl: './machines.component.html',
  styleUrls: ['./machines.component.scss']
})
export class MachinesComponent implements OnInit {
  activetab:string;
  CurMachineID:string;
  
  constructor() {
    this.activetab ="machinelist";
   }
  
  ngOnInit() {
    
  }

  CurMachineSelected(MachineID) {
    //alert(MachineID);
    this.CurMachineID = MachineID;  
    this.activetab = 'machineitem'  
  }
}
