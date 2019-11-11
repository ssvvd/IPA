import { Component, OnInit,Input } from '@angular/core';
import { Machineheader } from 'src/app/models/machines/machineheader';
import { MachineService } from 'src/app/services/machine.service' ;
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-machine-item-header',
  templateUrl: './machine-item-header.component.html',
  styleUrls: ['./machine-item-header.component.scss']
})

export class MachineItemHeaderComponent implements OnInit {
  @Input() MachineID: number;

  machHeader:Machineheader;
  imgNameMachine:string;  
  constructor(private serv: MachineService) { }

  ngOnInit() {
    this.serv.getmachineheader(this.MachineID).subscribe((res: any) => {          
      this.machHeader =JSON.parse(res)[0];    
      if(this.machHeader.MachineType =='Lathe') this.imgNameMachine =environment.ImagePath +"lathe.svg";
      if(this.machHeader.MachineType =='Multi task') this.imgNameMachine =environment.ImagePath +"MultiTask.svg";
      if(this.machHeader.MachineType =='Machining center ') this.imgNameMachine =environment.ImagePath +"Machining Center.svg"; 

    });
  }  

}
