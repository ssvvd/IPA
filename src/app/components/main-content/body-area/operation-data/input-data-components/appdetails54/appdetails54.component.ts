import { Component, OnInit,Input } from '@angular/core';
import { StateManagerService} from 'src/app/services/statemanager.service' ;
import { AppsettingService} from 'src/app/services/appsetting.service';
import { environment } from 'src/environments/environment';
import { Observable ,Subscription} from 'rxjs';

@Component({
  selector: 'appdetails54',
  templateUrl: './appdetails54.component.html',
  styleUrls: ['./appdetails54.component.scss']
})
export class Appdetails54Component implements OnInit {

  ImageName:string='';
  InFocus:boolean=false;
  environment=environment;
  TypeApp:string ='1';

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
    if(this.TypeApp=='1')
      this.ImageName= environment.ImageInputPath + this.srv_StMng.IPL.GetItem(field).image;
    else
      this.ImageName= environment.ImageInputPath + this.srv_StMng.IPL.GetItem(field).image1;
    
  }

  onfocusoutfield()
  {  
    this.InFocus=false;
    this.ImageName="";
  }
   
  ClearData()
  {
    this.srv_StMng.IPL.GetItem('WorkpieceDiameter').value =null;
    this.srv_StMng.IPL.GetItem('Depth').value =null;    
    this.srv_StMng.IPL.GetItem('DepthInner').value =null;
    this.srv_StMng.IPL.GetItem('Width').value =null;
    this.srv_StMng.IPL.GetItem('DiameterInner').value =null;    
    this.srv_StMng.IPL.GetItem('MinCornerRadius').value =null;
    this.srv_StMng.IPL.GetItem('MaxCornerRadius').value =null;
    this.srv_StMng.IPL.GetItem('WToleranceMin').value =null;
    this.srv_StMng.IPL.GetItem('WToleranceMax').value =null;    
    this.srv_StMng.IPL.GetItem('RToleranceMin').value =null;
    this.srv_StMng.IPL.GetItem('RToleranceMax').value =null;

    this.srv_StMng.IPL.GetItem('Clamping').value =this.srv_StMng.IPL.GetItem('Clamping').valuedefault;     
    this.srv_StMng.IPL.GetItem('TypeOfCut').value =this.srv_StMng.IPL.GetItem('TypeOfCut').valuedefault;    
  }
}
