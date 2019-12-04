import { Injectable } from '@angular/core';
import { Machineheader } from 'src/app/models/machines/machineheader';
import { Machinespindle } from 'src/app/models/machines/machinespindle';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class StateManagerService {  
  private MachineSelected:Machineheader;
  private lstMachineHeader:Machineheader[];
  private MachineSpindleSelected:Machinespindle;  
  private arrMachineSpindle: Machinespindle[];    
  private SelectedMachineID:number;

  private machine_selected = new BehaviorSubject(new Machineheader);
  current_machine_selected = this.machine_selected.asObservable(); 

  change_machine(mach: Machineheader) {
    this.MachineSelected=mach;
    this.machine_selected.next(mach);
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
 