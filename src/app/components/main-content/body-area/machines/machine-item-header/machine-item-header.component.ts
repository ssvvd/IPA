import { Component, OnInit,Input } from '@angular/core';
import { Machineheader } from 'src/app/models/machines/machineheader';
import { environment } from 'src/environments/environment';
import { Routes } from '@angular/router';

@Component({
  selector: 'app-machine-item-header',
  templateUrl: './machine-item-header.component.html',
  styleUrls: ['./machine-item-header.component.scss']
})

export class MachineItemHeaderComponent implements OnInit {
 
  environment = environment;

  @Input() machHeader:Machineheader;
  
  imgNameMachine:string; 

  constructor() { 

  }

  ngOnInit() {
    this.imgNameMachine =environment.ImagePath +"no-image.svg";
    if(this.machHeader.MachineType =='Lathe') this.imgNameMachine =environment.ImagePath +"lathe.svg";
    if(this.machHeader.MachineType =='Multi task') this.imgNameMachine =environment.ImagePath +"MultiTask.svg";
    if(this.machHeader.MachineType =='Machining center ') this.imgNameMachine =environment.ImagePath +"Machining Center.svg";              
  }
}

 