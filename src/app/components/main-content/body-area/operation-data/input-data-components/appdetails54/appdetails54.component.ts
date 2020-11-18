import { Component, OnInit,Input } from '@angular/core';
import { StateManagerService} from '../../../../../../services/statemanager.service' ;
import { AppsettingService} from '../../../../../../services/appsetting.service';
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
  CostPerHourByRate:number;
  constructor(private srv_StMng:StateManagerService,private srv_appsetting:AppsettingService) { }

  ngOnInit() {  
    this.SetIPLMandatory();
    this.SetImageSecAppByAppType(this.TypeApp);    
    this.CostPerHourByRate = Math.round(this.msrv_StMng.SelectedMachine.CostPerHour / this.srv_appsetting.CurrRate*100)/100;   
    this.eventsSubscription = this.events.subscribe(() => this.ClearData());      
  }
  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }
  
  SetImageSecAppByAppType(apptype:string)
  {
    this.ImageName= environment.ImageInputPath + this.srv_StMng.SecApp + ".png";
    if( this.srv_StMng.SecApp=='54' ||  this.srv_StMng.SecApp=='10')
    {
    if(apptype=='1')       
        this.ImageName= environment.ImageInputPath + this.srv_StMng.SecApp + ".png";
      else
        this.ImageName= environment.ImageInputPath + this.srv_StMng.SecApp + "_1.png";            
    }
    if (this.srv_StMng.SecApp=='188')
    {
      if(apptype=='1') this.ImageName= environment.ImageInputPath + this.srv_StMng.SecApp + ".png";      
      if(apptype=='2') this.ImageName= environment.ImageInputPath + this.srv_StMng.SecApp + "_1.png";  
      if(apptype=='3') this.ImageName= environment.ImageInputPath + this.srv_StMng.SecApp + "_2.png";            
    }                 
  }

  onfocusfield(field:string)
  {
    this.InFocus=true;  
    if(this.TypeApp=='1')
      this.ImageName= environment.ImageInputPath + this.srv_StMng.IPL.GetItem(field).image;
    if(this.TypeApp=='2')
      this.ImageName= environment.ImageInputPath + this.srv_StMng.IPL.GetItem(field).image1; 
    if(this.TypeApp=='3')
      this.ImageName= environment.ImageInputPath + this.srv_StMng.IPL.GetItem(field).image1.replace('_1','_2');     
  }
  
  onfocusoutfield()
  {  
    this.InFocus=false;
    this.SetImageSecAppByAppType(this.TypeApp);
    /* if( this.srv_StMng.SecApp=='54' || this.srv_StMng.SecApp=='188' || this.srv_StMng.SecApp=='10')
    {
      if(this.TypeApp=='1')      
        this.ImageName= environment.ImageInputPath + this.srv_StMng.SecApp + ".png";
      else
        this.ImageName= environment.ImageInputPath + this.srv_StMng.SecApp + "_1.png";            
    }
    else      
       this.ImageName= environment.ImageInputPath + this.srv_StMng.SecApp + ".png"; */
  }
   
 /*  ChangeTypeApp(v:number)
  {    
    if( this.srv_StMng.SecApp=='54' || this.srv_StMng.SecApp=='188' || this.srv_StMng.SecApp=='10')
    {
      if(v==1)      
        this.ImageName= environment.ImageInputPath + this.srv_StMng.SecApp + ".png";
      else
        this.ImageName= environment.ImageInputPath + this.srv_StMng.SecApp + "_1.png";            
    }
    else      
       this.ImageName= environment.ImageInputPath + this.srv_StMng.SecApp + ".png"; 
  } 
  */

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

  strMandatory:string='';
  SetIPLMandatory()
  {
    this.strMandatory='';
    if( this.srv_StMng.SecApp=='188' )
    {
      this.AddTostrMandatoryParam('WorkpieceDiameter',"OD:",this.srv_appsetting.UnitslengthDesc);
      this.AddTostrMandatoryParam('Width',"ID:",this.srv_appsetting.UnitslengthDesc);
      this.AddTostrMandatoryParam('Depth',"DOD:",this.srv_appsetting.UnitslengthDesc);
      this.AddTostrMandatoryParam('DepthInner',"DID:",this.srv_appsetting.UnitslengthDesc);      
    }
    if(this.srv_StMng.SecApp=='10' )
    {
      this.AddTostrMandatoryParam('WorkpieceDiameter',"OD:",this.srv_appsetting.UnitslengthDesc);
      this.AddTostrMandatoryParam('DiameterInner',"ID:",this.srv_appsetting.UnitslengthDesc);
      this.AddTostrMandatoryParam('Depth',"DOD:",this.srv_appsetting.UnitslengthDesc);
      this.AddTostrMandatoryParam('DepthInner',"DID:",this.srv_appsetting.UnitslengthDesc);      
    }
    if(this.srv_StMng.SecApp=='54')
    {
      this.AddTostrMandatoryParam('WorkpieceDiameter',"D:",this.srv_appsetting.UnitslengthDesc);
      this.AddTostrMandatoryParam('Width',"W:",this.srv_appsetting.UnitslengthDesc);
      this.AddTostrMandatoryParam('Depth',"DOD:",this.srv_appsetting.UnitslengthDesc);
      this.AddTostrMandatoryParam('DepthInner',"DID:",this.srv_appsetting.UnitslengthDesc);
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
