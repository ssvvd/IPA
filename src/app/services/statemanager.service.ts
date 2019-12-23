import { Injectable } from '@angular/core';
import { Machineheader } from 'src/app/models/machines/machineheader';
import { Machinespindle } from 'src/app/models/machines/machinespindle';
import { MachineFilter } from 'src/app/models/machines/machinefilter';
import { clsMaterial } from 'src/app/models/materials/material'
import { MainApp,SecondaryApp } from 'src/app/models/applications/applications';

import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class StateManagerService { 

  private MachineSelected:Machineheader;

  private lstMachineHeader:Machineheader[];
  private MachineSpindleSelected:Machinespindle;  
  private arrMachineSpindle: Machinespindle[];    
  private MachineFilter:MachineFilter;
  
  private obsMachineSelected = new BehaviorSubject<string[]>([]);;
  CurrentMachineSelected = this.obsMachineSelected.asObservable();   
  
  private materialSelected:clsMaterial;
  private obsMaterialSelected = new BehaviorSubject<string[]>([]);;
  CurrentMaterialSelected = this.obsMaterialSelected.asObservable();   

  private obsSecondaryAppSelected = new BehaviorSubject<string[]>([]);;
  CurrentSecAppSelected = this.obsSecondaryAppSelected.asObservable(); 

  SecondaryAppSelected:SecondaryApp;

  SelectMachine(mach: Machineheader) {
    this.MachineSelected=mach;   
    let desc:string;
    desc=mach.SpindleSpeed.toString() + " KW " + mach.Torque.toString() + " t/min";    
    this.obsMachineSelected.next([mach.MachineName,desc]);
  }

  ViewMachine(mach: Machineheader) { 
    this.obsMachineSelected.next([mach.MachineName,mach.SpindleSpeed.toString()]);
  }
  
  SetMachineFilter(f:MachineFilter)
  {
    this.MachineFilter=f;
  }
  
   GetMachineFilter() :MachineFilter
  {
    return this.MachineFilter;
  }

  SetlstMachineSpindle(lst_m:Machinespindle[])
  {
    this.arrMachineSpindle =lst_m;
  }

  GetlstMachineSpindle() : Machineheader[]
  {
    return this.lstMachineHeader;
  }

  GetMachineSelected() :Machineheader
  {
    return this.MachineSelected;    
  }

  SetMachineSpindleCur(m:Machinespindle)
  {
    this.MachineSpindleSelected=m;
  }
  SetMachineSpindlers(m: Machinespindle[])
  {
    this.arrMachineSpindle=m;
  }

  SetSecondaryApp(ma:MainApp, sa:SecondaryApp)
  {
    this.SecondaryAppSelected=sa;
     this.obsSecondaryAppSelected.next([ma.MenuName, sa.MenuName]);
  }

  GetSecondaryApp() :SecondaryApp
  {
    return this.SecondaryAppSelected;
  }

  SelectMaterial(mat: clsMaterial) {
    this.materialSelected=mat;   
    let desc:string;
    desc=mat.group.toString() + " - " + mat.description.toString().split(",")[0].split("(")[0].split(".")[0] ;    
    this.obsMaterialSelected.next([desc]);
  }

  GetMaterialSelected() :clsMaterial
  {
    return this.materialSelected;    
  }

}
 