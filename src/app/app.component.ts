import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'IscarToolAdvisor';
  CurMachineID: number;
  
  constructor() {
    
  }

 
  // CurMachineSelected(MachineID) {
  //   this.CurMachineID = MachineID
  //   this.activetab = 'machinedetailed'
  // }
}

