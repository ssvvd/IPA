import { Component, OnInit, Input } from '@angular/core';
import { MachineService } from 'src/app/services/machine.service' ;
import { Machineheader } from 'src/app/models/machines/machineheader';
import { Machinespindle } from 'src/app/models/machines/machinespindle';
import { Routes,ActivatedRoute} from '@angular/router';

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
  
  constructor(private serv: MachineService, private router: ActivatedRoute ) {
      this.router.params.subscribe(params => {
      this.MachineID = parseInt(params["id"]);
    })

  }

  ngOnInit() {
    //alert(this.MachineID);
             
     this.serv.getmachineheader(this.MachineID).subscribe((res: any) => {  
       //alert(JSON.parse(res)[0]);               
      this.machHeader =JSON.parse(res)[0];   
      //alert(this.machHeader) ;   
      this.serv.getmachinedetailed(this.MachineID).subscribe((res: any) => {
        this.arrMachineSpindle = JSON.parse(res);      
        this.machSpindleMain = this.arrMachineSpindle[0]; 
      });   
    });         
  }
}

