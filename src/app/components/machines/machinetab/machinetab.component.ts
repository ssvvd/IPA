import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-machinetab',
  templateUrl: './machinetab.component.html',
  styleUrls: ['./machinetab.component.scss']
})
export class MachinetabComponent implements OnInit {
  CurMachineID: number;
   activetab: string;
  constructor() { 
    this.activetab = 'machinelist';
  }

  setactivetab(tabname: string) {
    this.activetab = tabname;
  }
  ngOnInit()
  {

  }
  
  CurMachineSelected(MachineID) {
    this.CurMachineID = MachineID;  
    this.activetab = 'machinedetailed'  
  }
}
