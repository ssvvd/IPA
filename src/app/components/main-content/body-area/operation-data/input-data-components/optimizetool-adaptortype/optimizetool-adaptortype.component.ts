import { Component, OnInit,Input ,Output,EventEmitter} from '@angular/core';
import { StateManagerService } from 'src/app/services/statemanager.service';
import { Observable ,Subscription} from 'rxjs';

@Component({
  selector: 'app-optimizetool-adaptortype',
  templateUrl: './optimizetool-adaptortype.component.html',
  styleUrls: ['./optimizetool-adaptortype.component.scss']
})
export class OptimizetoolAdaptortypeComponent implements OnInit {

  @Input() events: Observable<void>;
  private eventsSubscription: Subscription;

  constructor(private srv_StMng:StateManagerService) { }
 
  public msrv_StMng:StateManagerService =this.srv_StMng;
   
  ngOnInit() {
     this.eventsSubscription = this.events.subscribe(() => this.ClearData());
  }
  

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }
  
  changeAdaptorType(field:string)
  {      
      if(this.srv_StMng.IPL.GetItem(field).value=='True') 
        this.srv_StMng.IPL.GetItem(field).value='False';
      else
        this.srv_StMng.IPL.GetItem(field).value='True';                
  }
  
  ClearData()
  {    
    this.srv_StMng.IPL.GetItem('ADAPTOR_ColletChuck').value=this.srv_StMng.IPL.GetItem('ADAPTOR_ColletChuck').valuedefault;
    this.srv_StMng.IPL.GetItem('ADAPTOR_Hydro').value=this.srv_StMng.IPL.GetItem('ADAPTOR_Hydro').valuedefault;
    this.srv_StMng.IPL.GetItem('ADAPTOR_SRKIN').value=this.srv_StMng.IPL.GetItem('ADAPTOR_SRKIN').valuedefault;
    this.srv_StMng.IPL.GetItem('ADAPTOR_Maxin').value=this.srv_StMng.IPL.GetItem('ADAPTOR_Maxin').valuedefault;
    this.srv_StMng.IPL.GetItem('ADAPTOR_EM').value=this.srv_StMng.IPL.GetItem('ADAPTOR_EM').valuedefault;
  }
}
