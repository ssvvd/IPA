import { Component, OnInit,Input } from '@angular/core';
import { StateManagerService} from '../../../../../../services/statemanager.service' ;
import { AppsettingService} from '../../../../../../services/appsetting.service';
import { environment } from 'src/environments/environment';
import { Observable ,Subscription} from 'rxjs';

@Component({
  selector: 'appdetails52',
  templateUrl: './appdetails52.component.html',
  styleUrls: ['./appdetails52.component.scss']
})
export class Appdetails52Component implements OnInit {

  ImageName:string='';
  InFocus:boolean=false;
  environment=environment;
  
   @Input() events: Observable<void>;
   @Input() exportPDF: boolean=false;
  private eventsSubscription: Subscription;
  
  public msrv_StMng:StateManagerService =this.srv_StMng;
  public msrv_appsetting:AppsettingService =this.srv_appsetting;
  CostPerHourByRate:number;
  
  constructor(private srv_StMng:StateManagerService,private srv_appsetting:AppsettingService) { }

  ngOnInit() {  
    this.SetIPLMandatory();
    this.ImageName= environment.ImageInputPath + this.srv_StMng.SecApp + ".png";
    this.eventsSubscription = this.events.subscribe(() => this.ClearData());   
    //this.CostPerHourByRate = Math.round(this.msrv_StMng.SelectedMachine.CostPerHour / this.srv_appsetting.CurrRate*100)/100;    
    this.CostPerHourByRate =Math.round(this.msrv_StMng.SelectedMachine.CostPerHour / ( Math.round(this.srv_appsetting.CurrRate*1000)/1000)*100)/100;
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
    this.srv_StMng.IPL.GetItem('WorkpieceDiameter').value =null;
    this.srv_StMng.IPL.GetItem('Depth').value =null;
    this.srv_StMng.IPL.GetItem('Width').value =null;
    this.srv_StMng.IPL.GetItem('GroovePosition').value =null;
    this.srv_StMng.IPL.GetItem('MaxCornerRadius').value =null;
    this.srv_StMng.IPL.GetItem('WToleranceMin').value =null;
    this.srv_StMng.IPL.GetItem('WToleranceMax').value =null;    
    this.srv_StMng.IPL.GetItem('RToleranceMin').value =null;
    this.srv_StMng.IPL.GetItem('RToleranceMax').value =null;

    this.srv_StMng.IPL.GetItem('Clamping').value =this.srv_StMng.IPL.GetItem('Clamping').valuedefault;     
    this.srv_StMng.IPL.GetItem('TypeOfCut').value =this.srv_StMng.IPL.GetItem('TypeOfCut').valuedefault;    
  }

  strMandatory:string='';
  SetIPLMandatory()
  {
    this.strMandatory='';
    if( this.srv_StMng.SecApp=='52')
    {
      this.AddTostrMandatoryParam('WorkpieceDiameter',"D:",this.srv_appsetting.UnitslengthDesc);
      this.AddTostrMandatoryParam('Depth',"DPT:",this.srv_appsetting.UnitslengthDesc);
      this.AddTostrMandatoryParam('Width',"W:",this.srv_appsetting.UnitslengthDesc);      
    }
    if( this.srv_StMng.SecApp=='53' || this.srv_StMng.SecApp=='50')
    {
      this.AddTostrMandatoryParam('WorkpieceDiameter',"D:",this.srv_appsetting.UnitslengthDesc);
      this.AddTostrMandatoryParam('GroovePosition',"LP:",this.srv_appsetting.UnitslengthDesc);
      this.AddTostrMandatoryParam('Depth',"DPT:",this.srv_appsetting.UnitslengthDesc);   
      this.AddTostrMandatoryParam('Width',"W:",this.srv_appsetting.UnitslengthDesc);    
    }  
      if(this.strMandatory.length>0)
        this.msrv_StMng.IPLMMandatory=this.strMandatory.substring(0,this.strMandatory.length-2);    
  }

  AddTostrMandatoryParam(name:string,desc:string,units:string)
  {
    if(this.srv_StMng.IPL.GetItem(name).value!=null && this.srv_StMng.IPL.GetItem(name).value!='')
    this.strMandatory=this.strMandatory +desc + this.srv_StMng.IPL.GetItem(name).value + units + ', ';
    
  }
}
