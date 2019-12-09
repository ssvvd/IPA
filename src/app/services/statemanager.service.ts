import { Injectable } from '@angular/core';
import { Machineheader } from 'src/app/models/machines/machineheader';
import { Machinespindle } from 'src/app/models/machines/machinespindle';
import { MachineFilter } from 'src/app/models/machines/machinefilter';
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
  
  private obsMachineSelected = new BehaviorSubject(new Machineheader);
  CurrentMachineSelected = this.obsMachineSelected.asObservable(); 
  
  SelectMachine(mach: Machineheader) {
    this.MachineSelected=mach;
    this.obsMachineSelected.next(mach);
  }

  ViewMachine(mach: Machineheader) { 
    this.obsMachineSelected.next(mach);
  }
  
  SetMachineFilter(f:MachineFilter)
  {
    this.MachineFilter=f;
  }
  
   GetMachineFilter() :MachineFilter
  {
    return this.MachineFilter;
  }
  SetlstMachineSpindle(lst_m:Machineheader[])
  {
    this.lstMachineHeader =lst_m;
  }

  GetlstMachineSpindle() : Machineheader[]
  {
    return this.lstMachineHeader;
  }

 /*  SetMachineHeaderCur(m:Machineheader)
  {   
    this.MachineSelected=m;    
  }   */
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
}
 