import { Component, OnInit ,Input} from '@angular/core';
import { InputParameterItem } from 'src/app/models/operational-data/inputparameteritem';
import { InputParameterlist } from 'src/app/models/operational-data/inputparameterlist';
import { StateManagerService } from 'src/app/services/statemanager.service';
import { AppsettingService} from 'src/app/services/appsetting.service';
import { Options,ChangeContext } from 'ng5-slider';
import { Observable ,Subscription} from 'rxjs';

@Component({
  selector: 'app-optimizetool59',
  templateUrl: './optimizetool59.component.html',
  styleUrls: ['./optimizetool59.component.scss']
})
export class Optimizetool59Component implements OnInit {
  

  
  @Input() events: Observable<void>;
  private eventsSubscription: Subscription;
  public msrv_StMng:StateManagerService =this.srv_StMng;
  public msrv_appsetting:AppsettingService =this.srv_appsetting;
  
  constructor(private srv_StMng:StateManagerService,private srv_appsetting:AppsettingService) { }
  
   options_dc: Options = {
    floor: 0,
    ceil:  Number(this.srv_StMng.IPL.GetItem('TD_DCXMax').valuedefault),
    step: 0.1,
    showTicks: false
  };
  
   options_nof: Options = {
    floor: 0,
    ceil: Number(this.srv_StMng.IPL.GetItem('TD_NOFMax').valuedefault),
    step: 1,
    showTicks: false
  };
  
  options_radius: Options = {
    floor: 0,
    ceil: Number(this.srv_StMng.IPL.GetItem('MaxCornerRadius').valuedefault),
    step: 0.05,
    showTicks: false
  };
  
   options_chamfer: Options = {
    floor: 0,
    ceil: Number(this.srv_StMng.IPL.GetItem('MaxChamferRange').valuedefault),
    step: 0.1,
    showTicks: false
  };
  
  options_rampdown: Options = {
    floor: 0,
    ceil: 90,
    step: 0.5,
    showTicks: false
  };

  ngOnInit() {
     this.eventsSubscription = this.events.subscribe(() => this.ClearData());
  }
  
  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }

  ClearData()
  {
    this.srv_StMng.IPL.GetItem('TD_DCXMin').value = this.srv_StMng.IPL.GetItem('TD_DCXMin').valuedefault;
    this.srv_StMng.IPL.GetItem('TD_DCXMax').value = this.srv_StMng.IPL.GetItem('TD_DCXMax').valuedefault;
    this.srv_StMng.IPL.GetItem('TD_DiameterFrom').value = this.srv_StMng.IPL.GetItem('TD_DiameterFrom').valuedefault;
    this.srv_StMng.IPL.GetItem('TD_DiameterTo').value = this.srv_StMng.IPL.GetItem('TD_DiameterTo').valuedefault;

    this.srv_StMng.IPL.GetItem('TD_NOFMin').value = this.srv_StMng.IPL.GetItem('TD_NOFMin').valuedefault;
    this.srv_StMng.IPL.GetItem('TD_NOFMax').value = this.srv_StMng.IPL.GetItem('TD_NOFMax').valuedefault;
    
    this.srv_StMng.IPL.GetItem('MinCornerRadius').value = this.srv_StMng.IPL.GetItem('MinCornerRadius').valuedefault;
    this.srv_StMng.IPL.GetItem('MaxCornerRadius').value = this.srv_StMng.IPL.GetItem('MaxCornerRadius').valuedefault;

    this.srv_StMng.IPL.GetItem('MinChamferRange').value = this.srv_StMng.IPL.GetItem('MinChamferRange').valuedefault;
    this.srv_StMng.IPL.GetItem('MaxChamferRange').value = this.srv_StMng.IPL.GetItem('MaxChamferRange').valuedefault;
    

  }
}
