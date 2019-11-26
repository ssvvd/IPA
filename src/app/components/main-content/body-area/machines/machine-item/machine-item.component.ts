import { Component, OnInit, Input,Output,EventEmitter } from '@angular/core';
import { MachineService } from 'src/app/services/machine.service' ;
import { Machineheader } from 'src/app/models/machines/machineheader';
import { Machinespindle } from 'src/app/models/machines/machinespindle';
import { Routes,ActivatedRoute} from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-machineitem',
  templateUrl: './machine-item.component.html',
  styleUrls: ['./machine-item.component.scss']
})
export class MachineItemComponent implements OnInit {
  
  @Input() MachineID: number;  
  //@Output() MachineSelect = new EventEmitter();

  machSpindleMain: Machinespindle;
  machSpindleTool: Machinespindle;
  arrMachineSpindle: Machinespindle[];
  machHeader:Machineheader;
  imgNameMachine:string; 
  environment = environment;   
  constructor(private serv: MachineService, private router: ActivatedRoute ) {
      this.router.params.subscribe(params => {
      this.MachineID = parseInt(params["id"]);
    })
  }

  ngOnInit() {          
      this.serv.getmachineheader(this.MachineID).subscribe((res: any) => {                   
        this.machHeader =JSON.parse(res)[0];          
        this.serv.getmachinedetailed(this.MachineID).subscribe((res: any) => {
        this.arrMachineSpindle = JSON.parse(res);      
        this.machSpindleMain = this.arrMachineSpindle[0]; 

        this.imgNameMachine =environment.ImagePath +"no-image.svg";        
        if(this.machHeader.MachineType =='Lathe') this.imgNameMachine =environment.ImagePath +"lathe.svg";
        if(this.machHeader.MachineType =='Multi task') this.imgNameMachine =environment.ImagePath +"MultiTask.svg";
        if(this.machHeader.MachineType =='Machining center ') this.imgNameMachine =environment.ImagePath +"Machining Center.svg";                      
      });   
    }); 
     
  }
}