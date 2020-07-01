import { Component, OnInit,Input } from '@angular/core';
import { StateManagerService} from 'src/app/services/statemanager.service' ;
import { AppsettingService} from 'src/app/services/appsetting.service';
import { environment } from 'src/environments/environment';
import { Observable ,Subscription} from 'rxjs';

@Component({
  selector: 'app-appdetails59',
  templateUrl: './appdetails59.component.html',
  styleUrls: ['./appdetails59.component.scss']
})
export class Appdetails59Component implements OnInit {

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
    this.SetIPLMandatory();    
    this.ImageName= environment.ImageInputPath + this.srv_StMng.SecApp + ".png";
  }
      
  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }

  onfocusfield(field:string)
  {
    this.InFocus=true;    
    this.ImageName= environment.ImageInputPath + this.srv_StMng.IPL.GetItem(field).image;    
  }
  
  onfocusoutfield()
  {  
    this.InFocus=false;
    this.ImageName= environment.ImageInputPath + this.srv_StMng.SecApp + ".png";
  }
   
  ClearData()
  {
    this.srv_StMng.IPL.GetItem('DepthOfShoulder_ap').value =null;
    this.srv_StMng.IPL.GetItem('WidthOfShoulder_ae').value =null;
    this.srv_StMng.IPL.GetItem('LengthOfShoulder_L').value =null;
    this.srv_StMng.IPL.GetItem('OperationType').value =this.srv_StMng.IPL.GetItem('OperationType').valuedefault;
    this.srv_StMng.IPL.GetItem('OperationType4Solid').value =this.srv_StMng.IPL.GetItem('OperationType4Solid').valuedefault;
    this.srv_StMng.IPL.GetItem('OverHang').value =this.srv_StMng.IPL.GetItem('OverHang').valuedefault;
    this.srv_StMng.IPL.GetItem('Clamping').value =this.srv_StMng.IPL.GetItem('Clamping').valuedefault;
    this.srv_StMng.IPL.GetItem('PartShape').value =this.srv_StMng.IPL.GetItem('PartShape').valuedefault;    
    this.srv_StMng.IPL.GetItem('TypeOfCut').value =this.srv_StMng.IPL.GetItem('TypeOfCut').valuedefault;    
  }

  strMandatory:string='';
  SetIPLMandatory()
  {
    this.strMandatory='';
    this.AddTostrMandatoryParam('DepthOfShoulder_ap',"D:",this.srv_appsetting.UnitslengthDesc);
    this.AddTostrMandatoryParam('WidthOfShoulder_ae',"W:",this.srv_appsetting.UnitslengthDesc);
    this.AddTostrMandatoryParam('LengthOfShoulder_L',"L:",this.srv_appsetting.UnitslengthDesc);
    if(this.strMandatory.length>0)
      this.msrv_StMng.IPLMMandatory=this.strMandatory.substring(0,this.strMandatory.length-2);
  }

  AddTostrMandatoryParam(name:string,desc:string,units:string)
  {
    if(this.srv_StMng.IPL.GetItem(name).value!=null && this.srv_StMng.IPL.GetItem(name).value!='')
    this.strMandatory=this.strMandatory +desc + this.srv_StMng.IPL.GetItem(name).value + units + ', ';
    
  }
}
