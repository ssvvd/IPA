import { Injectable } from '@angular/core';
import { Machineheader } from 'src/app/models/machines/machineheader';
import { Machinespindle } from 'src/app/models/machines/machinespindle';
import { MachineFilter } from 'src/app/models/machines/machinefilter';
import { clsMaterial } from 'src/app/models/materials/material'
import { MainApp,SecondaryApp } from 'src/app/models/applications/applications';
import { InputParameterlist } from 'src/app/models/operational-data/inputparameterlist';
import { InputParamItemChanged} from 'src/app/models/operational-data/inputparameteritem';

import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class StateManagerService { 

  private lstMachineHeader:Machineheader[]; 
  private mMachineFilter:MachineFilter;
  private mSelectedMachine:Machineheader;
  private marrMachineSpindle:Machinespindle[];

  private obsMachineSelected = new BehaviorSubject<string[]>([]);
  CurrentMachineSelected = this.obsMachineSelected.asObservable();   
  
  private materialSelected:clsMaterial;
  private obsMaterialSelected = new BehaviorSubject<string[]>([]);
  CurrentMaterialSelected = this.obsMaterialSelected.asObservable();   

  private obsSecondaryAppSelected = new BehaviorSubject<string[]>([]);
  CurrentSecAppSelected = this.obsSecondaryAppSelected.asObservable(); 
 
  private obsOperationDataEnable = new BehaviorSubject<boolean>(false);
  OperationDataEnable = this.obsOperationDataEnable.asObservable();   

  private mSecondaryAppSelected:SecondaryApp;
  private mMainAppSelected:MainApp; 

  CheckTabOperationalDataEnable()
  {   
    if(typeof(this.SelectedMachine) !== 'undefined' && typeof(this.SecAppSelected) !== 'undefined' && typeof(this.GetMaterialSelected()) !== 'undefined' && this.SelectedMachine!=null && this.SecAppSelected!=null && this.GetMaterialSelected()!=null)   
        this.obsOperationDataEnable.next(true);    
    else     
        this.obsOperationDataEnable.next(false);  
  }

  public CheckToOperationData():boolean
  {   
    if(typeof(this.SelectedMachine) !== 'undefined'  && typeof(this.GetMaterialSelected()) !== 'undefined' && this.SelectedMachine!=null && this.GetMaterialSelected()!=null)   
        return true;    
    else     
        return false;
  }

  get SelectedMachine():Machineheader {
    return this.mSelectedMachine;
  }
  set SelectedMachine(m:Machineheader) {
    this.mSelectedMachine=m;   
    let desc:string;
    desc=m.SpindleSpeed.toString() + " rpm /" + m.Power.toString() + " Kw"; 
    this.CheckTabOperationalDataEnable();   
    this.obsMachineSelected.next([m.MachineName,desc]);
  }

  ViewMachine(mach: Machineheader) { 
    this.obsMachineSelected.next([mach.MachineName,mach.SpindleSpeed.toString()]);
  }
  
  get SelectMachineFilter():MachineFilter {
    return this.mMachineFilter;
  }
  set SelectMachineFilter(mf:MachineFilter) {
    this.mMachineFilter = mf;
  }
  
  get arrMachineSpindle():Machinespindle[] {
    return this.marrMachineSpindle;
  }
  set arrMachineSpindle(mf:Machinespindle[]) {
    this.marrMachineSpindle = mf;
  }
  
  get SecAppSelected():SecondaryApp {
    return this.mSecondaryAppSelected;
  }
  set SecAppSelected(sa:SecondaryApp) {
    this.mSecondaryAppSelected = sa;   
    this.CheckTabOperationalDataEnable();   
    this.obsSecondaryAppSelected.next([this.MainAppSelected.MenuName, sa.MenuName]);
  }

  get MainAppSelected():MainApp {
    return this.mMainAppSelected;
  }
  set MainAppSelected(ma:MainApp) {
    this.mMainAppSelected = ma;
  }

  private mMenuIDLevel1:string;
  get MenuIDLevel1():string {
    return this.mMenuIDLevel1;
  }
  set MenuIDLevel1(id:string) {
    this.mMenuIDLevel1 = id;
  }
  
  private mMenuIDLevel2:string;
  get MenuIDLevel2():string {
    return this.mMenuIDLevel2;
  }
  set MenuIDLevel2(id:string) {
    this.mMenuIDLevel2 = id;
  }
  
   private mIPL:InputParameterlist;
   get IPL():InputParameterlist {
    return this.mIPL;
    }
  set IPL(ipl:InputParameterlist) {
    this.CheckTabOperationalDataEnable();   
    this.mIPL = ipl;
   }

   private mIPLChanged:string;
   get IPLChanged():string {
    return this.mIPLChanged;
    }
  set IPLChanged(ipl:string) {  
    this.mIPLChanged = ipl;
   }

  SelectMaterial(mat: clsMaterial) {
    this.materialSelected=mat;   
    let desc:string;
    if (mat.material && mat.material != ''){
      desc=mat.group.toString() + " - " + mat.material ; 
    }
    else{
      desc=mat.group.toString() + " - " + mat.description.toString().split(",")[0].split("(")[0].split(".")[0] ; 
    }
       
    this.obsMaterialSelected.next([desc]);
  }

  GetMaterialSelected() :clsMaterial
  {
    return this.materialSelected;    
  }

}
 