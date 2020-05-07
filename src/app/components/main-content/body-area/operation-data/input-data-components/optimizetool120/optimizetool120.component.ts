import { Component, OnInit ,Input} from '@angular/core';
//import { InputParameterItem } from 'src/app/models/operational-data/inputparameteritem';
//import { InputParameterlist } from 'src/app/models/operational-data/inputparameterlist';
import { StateManagerService } from 'src/app/services/statemanager.service';
import { AppsettingService} from 'src/app/services/appsetting.service';
import { Options,ChangeContext } from 'ng5-slider';
import { Observable ,Subscription} from 'rxjs';

@Component({
  selector: 'app-optimizetool120',
  templateUrl: './optimizetool120.component.html',
  styleUrls: ['./optimizetool120.component.scss']
})
export class Optimizetool120Component implements OnInit {
    
  @Input() events: Observable<void>;
  private eventsSubscription: Subscription;
  public msrv_StMng:StateManagerService =this.srv_StMng;
  public msrv_appsetting:AppsettingService =this.srv_appsetting;
  
  constructor(private srv_StMng:StateManagerService,private srv_appsetting:AppsettingService) { }
  
   options_dc: Options = {
    floor: 0,
    ceil:  Number(this.srv_StMng.IPL.GetItem('TD_DiameterTo').valuedefault),
    step: 0.1,
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
    this.srv_StMng.IPL.GetItem('TD_DiameterFrom').value = this.srv_StMng.IPL.GetItem('TD_DiameterFrom').valuedefault;
    this.srv_StMng.IPL.GetItem('TD_DiameterTo').value = this.srv_StMng.IPL.GetItem('TD_DiameterTo').valuedefault;
  }
}
