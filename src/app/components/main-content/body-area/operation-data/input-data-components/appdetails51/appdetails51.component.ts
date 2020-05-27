import { Component, OnInit,Input } from '@angular/core';
import { StateManagerService} from 'src/app/services/statemanager.service' ;
import { AppsettingService} from 'src/app/services/appsetting.service';
import { environment } from 'src/environments/environment';
import { Observable ,Subscription} from 'rxjs';

@Component({
  selector: 'appdetails51',
  templateUrl: './appdetails51.component.html',
  styleUrls: ['./appdetails51.component.scss']
})
export class Appdetails51Component implements OnInit {

  ImageName:string='';
  InFocus:boolean=false;
  environment=environment;
  
   @Input() events: Observable<void>;
  private eventsSubscription: Subscription;
  
  public msrv_StMng:StateManagerService =this.srv_StMng;
  public msrv_appsetting:AppsettingService =this.srv_appsetting;

  constructor(private srv_StMng:StateManagerService,private srv_appsetting:AppsettingService) { }

  ngOnInit() {  
    this.eventsSubscription = this.events.subscribe(() => this.ClearData());      
  }
 
  onfocusfield(field:string)
  {
    this.InFocus=true;
    this.ImageName= environment.ImageInputPath + this.srv_StMng.IPL.GetItem(field).image;
  }

  onfocusoutfield()
  {  
    this.InFocus=false;
    this.ImageName="";
  }
   
  ClearData()
  {
    this.srv_StMng.IPL.GetItem('WorkpieceDiameter').value =null;
    this.srv_StMng.IPL.GetItem('DiameterBoring').value =null;
    this.srv_StMng.IPL.GetItem('Width').value =null;  

    this.srv_StMng.IPL.GetItem('Clamping').value =this.srv_StMng.IPL.GetItem('Clamping').valuedefault;     
    this.srv_StMng.IPL.GetItem('TypeOfCut').value =this.srv_StMng.IPL.GetItem('TypeOfCut').valuedefault;    
  }
}
