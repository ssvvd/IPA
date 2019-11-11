import { Component, OnInit ,Input} from '@angular/core';
/*  */import { MachineService } from 'src/app/services/machine.service' ;
import { Machinespindle } from 'src/app/models/machines/machinespindle';

@Component({
  selector: 'app-machine-item-spindle',
  templateUrl: './machine-item-spindle.component.html',
  styleUrls: ['./machine-item-spindle.component.scss']
})

export class MachineItemSpindleComponent implements OnInit 
{

  @Input() MachineID: number;  
  @Input() spindle:Machinespindle; 
  
  DescSpindle:string;
  constructor() {}

  ngOnInit() {   
    if(this.spindle.SpindleType=="M")  this.DescSpindle="Main Spindle";
    if(this.spindle.SpindleType=="T")  this.DescSpindle="Tool Spindle";
  }

}
