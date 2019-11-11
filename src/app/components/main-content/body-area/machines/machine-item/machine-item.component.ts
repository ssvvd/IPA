import { Component, OnInit, Input } from '@angular/core';
import { MachineService } from 'src/app/services/machine.service' ;
import { Machineheader } from 'src/app/models/machines/machineheader';
import { Machinespindle } from 'src/app/models/machines/machinespindle';

@Component({
  selector: 'app-machineitem',
  templateUrl: './machine-item.component.html',
  styleUrls: ['./machine-item.component.scss']
})
export class MachineItemComponent implements OnInit {
  
  @Input() MachineID: number;  

  machSpindleMain: Machinespindle;
  machSpindleTool: Machinespindle;
  arrMachineSpindle: Machinespindle[];
  machHeader:Machineheader;
  
  constructor(private serv: MachineService) {
  }

  ngOnInit() {
  
    this.serv.getmachinedetailed(this.MachineID).subscribe((res: any) => {
      this.arrMachineSpindle = JSON.parse(res);      
      this.machSpindleMain = this.arrMachineSpindle[0]; 
    });          
  }
}

