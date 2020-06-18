import { Component, OnInit,Input} from '@angular/core';
import { StateManagerService } from 'src/app/services/statemanager.service';
import { AppsettingService} from 'src/app/services/appsetting.service';
import { Observable, Subject} from 'rxjs';
import { Options } from 'ng5-slider';

@Component({
  selector: 'app-optimizetool52',
  templateUrl: './optimizetool52.component.html',
  styleUrls: ['./optimizetool52.component.scss']
})

export class Optimizetool52Component implements OnInit {
  
  @Input() events: Observable<void>;
  eventsSubject: Subject<void> = new Subject<void>();

  isLoad:boolean =true;
  public msrv_StMng:StateManagerService =this.srv_StMng;
  public msrv_appsetting:AppsettingService =this.srv_appsetting;

  constructor(private srv_StMng:StateManagerService,private srv_appsetting:AppsettingService) { }
  
  options_W: Options = {
    floor: 0,
    ceil:  Number(this.srv_StMng.IPL.GetItem('TD_WMax').valuedefault),
    step:  this.msrv_appsetting.Units=='M'?0.1:0.01,
    showTicks: false
  };
    
  options_R: Options = {
    floor: 0,
    ceil:  Number(this.srv_StMng.IPL.GetItem('TD_RadiusMax').valuedefault),    
    step: this.msrv_appsetting.Units=='M'?0.1:0.01, 
    showTicks: false
  };
  
  options_Ang: Options = {
    floor: Number(this.srv_StMng.IPL.GetItem('MinAxialEntAngle').valuedefault),
    ceil:  Number(this.srv_StMng.IPL.GetItem('MaxAxialEntAngle').valuedefault),
    step: 0.5,
    showTicks: false
  };
 options_rad_ang: Options = {
    floor:  Number(this.srv_StMng.IPL.GetItem('MinRadEntAngle').valuedefault),
    ceil:  Number(this.srv_StMng.IPL.GetItem('MaxRadEntAngle').valuedefault),
    step: 0.5,
    showTicks: false
  };

  ClearDataChild() {
 
    this.srv_StMng.IPL.GetItem('TD_CoolantYes').value =this.srv_StMng.IPL.GetItem('TD_CoolantYes').valuedefault;
    this.srv_StMng.IPL.GetItem('TD_CoolantNo').value =this.srv_StMng.IPL.GetItem('TD_CoolantNo').valuedefault;
    this.srv_StMng.IPL.GetItem('TD_CoolantHP').value =this.srv_StMng.IPL.GetItem('TD_CoolantHP').valuedefault;

    this.srv_StMng.IPL.GetItem('GrooveToolSide').value =this.srv_StMng.IPL.GetItem('GrooveToolSide').valuedefault; 
    this.srv_StMng.IPL.GetItem('TD_ISOMat').value =this.srv_StMng.IPL.GetItem('TD_ISOMat').valuedefault;
    this.srv_StMng.IPL.GetItem('TD_NegOrPosAngle').value =this.srv_StMng.IPL.GetItem('TD_NegOrPosAngle').valuedefault;  
    
    this.srv_StMng.IPL.GetItem('TD_PrecisionOrUtility').value =this.srv_StMng.IPL.GetItem('TD_PrecisionOrUtility').valuedefault;  
    this.srv_StMng.IPL.GetItem('TD_IC_MIN').value =this.srv_StMng.IPL.GetItem('TD_IC_MIN').valuedefault;  
    this.srv_StMng.IPL.GetItem('TD_IC_MAX').value =this.srv_StMng.IPL.GetItem('TD_IC_MAX').valuedefault;  
    this.srv_StMng.IPL.GetItem('TD_WMin').value =this.srv_StMng.IPL.GetItem('TD_WMin').valuedefault;  
    this.srv_StMng.IPL.GetItem('TD_WMax').value =this.srv_StMng.IPL.GetItem('TD_WMax').valuedefault;      
    this.srv_StMng.IPL.GetItem('TD_RadiusMin').value =this.srv_StMng.IPL.GetItem('TD_RadiusMin').valuedefault;  
    this.srv_StMng.IPL.GetItem('TD_RadiusMax').value =this.srv_StMng.IPL.GetItem('TD_RadiusMax').valuedefault;      
    this.srv_StMng.IPL.GetItem('MinAxialEntAngle').value =this.srv_StMng.IPL.GetItem('MinAxialEntAngle').valuedefault;  
    this.srv_StMng.IPL.GetItem('MaxAxialEntAngle').value =this.srv_StMng.IPL.GetItem('MaxAxialEntAngle').valuedefault;  
    
    this.srv_StMng.IPL.GetItem('TD_BrandName').value =this.srv_StMng.IPL.GetItem('TD_BrandName').valuedefault;  
    this.srv_StMng.IPL.GetItem('TD_InsertShape').value =this.srv_StMng.IPL.GetItem('TD_InsertShape').valuedefault;  
    this.srv_StMng.IPL.GetItem('TD_InsertDesignation').value =this.srv_StMng.IPL.GetItem('TD_InsertDesignation').valuedefault;  

    this.srv_StMng.IPL.GetItem('TD_Grade').value =this.srv_StMng.IPL.GetItem('TD_Grade').valuedefault;  
    this.srv_StMng.IPL.GetItem('TD_HolderDesignation').value =this.srv_StMng.IPL.GetItem('TD_HolderDesignation').valuedefault;  
    this.srv_StMng.IPL.GetItem('TD_SquareDesignation').value =this.srv_StMng.IPL.GetItem('TD_SquareDesignation').valuedefault; 

    this.eventsSubject.next();
  }
  
  ngOnInit() {     
    this.isLoad =true;     
  }

  /* change(field:string)
  {      
      if(this.srv_StMng.IPL.GetItem(field).value=='True')
        this.srv_StMng.IPL.GetItem(field).value='False';
      else
        this.srv_StMng.IPL.GetItem(field).value='True';                
  }   */
}
