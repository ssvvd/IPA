import { Component, OnInit } from '@angular/core';
import { MachineService } from 'src/app/services/machine.service' ;
import { StateManagerService} from 'src/app/services/statemanager.service' ;
import { Machineheader } from 'src/app/models/machines/machineheader';
import { Machinespindle } from 'src/app/models/machines/machinespindle';
import { Routes,ActivatedRoute,Router} from '@angular/router';
import { environment } from 'src/environments/environment';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-machineitem',
  templateUrl: './machine-item.component.html',
  styleUrls: ['./machine-item.component.scss']
})
export class MachineItemComponent implements OnInit {
 
  MachineID: number; 
  machSpindleMain: Machinespindle;
  machSpindleTool: Machinespindle;
  arrMachineSpindle: Machinespindle[];
  machHeader:Machineheader;
  imgNameMachine:string; 
  environment = environment;  

  ClickSelectMachine:Subject<any> = new Subject();

  constructor(private srv_machine: MachineService,private router1:Router, private router: ActivatedRoute , private srv_statemanage:StateManagerService) 
  {  
      this.router.params.subscribe(params => {
      this.MachineID = parseInt(params["id"]);
    })
  }

  ngOnInit() {                    
    if(this.srv_statemanage.SelectedMachine!=null && this.srv_statemanage.SelectedMachine.MachineID==this.MachineID)
    {
      this.machHeader=this.srv_statemanage.SelectedMachine;
      if(this.srv_statemanage.arrMachineSpindle!=null)      
        {    
          this.arrMachineSpindle =this.srv_statemanage.arrMachineSpindle;
          this.FillImageMachineType();
        }
      else
          this.srv_machine.getmachinedetailed(this.MachineID).subscribe((res: any) => {
          this.arrMachineSpindle = JSON.parse(res);      
          this.machSpindleMain = this.arrMachineSpindle[0]; 
          this.machHeader.SpindleSpeed = this.arrMachineSpindle[0].SpindleSpeed;
          this.machHeader.Torque = this.arrMachineSpindle[0].Torque;
          this.FillImageMachineType();
        });            
    }         
    if(this.machHeader==null)
    {
        this.FillMachineDataFromServer(); 
    }      
  }
  
  FillImageMachineType()
  {
       this.imgNameMachine =environment.ImagePath +"no-image.svg";        
        if(this.machHeader.MachineType =='Lathe') this.imgNameMachine =environment.ImagePath +"lathe.svg";
        if(this.machHeader.MachineType =='Multi task') this.imgNameMachine =environment.ImagePath +"MultiTask.svg";
        if(this.machHeader.MachineType =='Machining center ') this.imgNameMachine =environment.ImagePath +"MachiningCenter.svg";                      
  }

  FillMachineDataFromServer()
  {
     this.srv_machine.getmachineheader(this.MachineID).subscribe((res: any) => {                   
        this.machHeader =JSON.parse(res)[0];                
        this.srv_machine.getmachinedetailed(this.MachineID).subscribe((res: any) => {
        this.arrMachineSpindle = JSON.parse(res);      
        this.machSpindleMain = this.arrMachineSpindle[0]; 
        this.machHeader.SpindleSpeed = this.arrMachineSpindle[0].SpindleSpeed;
        this.machHeader.Torque = this.arrMachineSpindle[0].Torque;
        this.FillImageMachineType(); 
          
      });   
    });    
  }

  OnSelectMachine()
  {                 
    this.machHeader.AdaptationType =this.arrMachineSpindle[0].AdaptationType;
    this.machHeader.AdaptationSize =this.arrMachineSpindle[0].AdaptationSize; 
    this.machHeader.Power =this.arrMachineSpindle[0].Power;
    this.machHeader.SpindleSpeed =this.arrMachineSpindle[0].SpindleSpeed;
    this.machHeader.Torque =this.arrMachineSpindle[0].Torque;   
    this.srv_statemanage.SelectedMachine = this.machHeader; 
    this.srv_statemanage.arrMachineSpindle =this.arrMachineSpindle;       
  } 
}