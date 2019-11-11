import { Component, OnInit, Input } from '@angular/core';
import { MachineService } from '../../../services/machine.service'
import { Machinespindle1 } from './machinespindle1';

@Component({
  selector: 'app-machinedetailed',
  templateUrl: './machinedetailed.component.html',
  styleUrls: ['./machinedetailed.component.scss']
})
export class MachinedetailedComponent implements OnInit {

  x: number = 1;

  @Input() MachineID: number;
  machSpindleMain: Machinespindle1;
  machSpindleTool: Machinespindle1;
  arrMachineSpindle: Machinespindle1[];
  constructor(private serv: MachineService) {
  }

  ngOnInit() {
    this.serv.getmachinedetailed(this.MachineID).subscribe((res: any) => {
      this.arrMachineSpindle = JSON.parse(res);
      this.machSpindleMain = this.arrMachineSpindle[0];
    });
  }
}
