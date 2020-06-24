import { Component, OnInit,Input } from '@angular/core';
import { StateManagerService} from 'src/app/services/statemanager.service' ;
import { AppsettingService} from 'src/app/services/appsetting.service';
import { environment } from 'src/environments/environment';
import { Options } from 'ng5-slider';
import { Observable ,Subscription} from 'rxjs';

@Component({
  selector: 'app-appdetails780',
  templateUrl: './appdetails780.component.html',
  styleUrls: ['./appdetails780.component.scss']
})
export class Appdetails780Component implements OnInit {

  ImageName:string='';
  InFocus:boolean=false;
  HoleType:string='Solid';
  environment=environment;

  @Input() events: Observable<void>;
  private eventsSubscription: Subscription; 
  public msrv_StMng:StateManagerService =this.srv_StMng;
  public msrv_appsetting:AppsettingService =this.srv_appsetting;

  constructor(private srv_StMng:StateManagerService,private srv_appsetting:AppsettingService) { }
 
    options_d2: Options = {
    floor: 0,
    ceil:  Number(this.srv_StMng.IPL.GetItem('D2Max').valuemax),
    step: 0.1,
    showTicks: false
  };

 ngOnInit() {
    this.SetIPLMandatory();
    if( this.HoleType=='Solid') 
      this.ImageName= environment.ImageInputPath + this.srv_StMng.SecApp + ".png";
    else
      this.ImageName= environment.ImageInputPath + this.srv_StMng.SecApp + "_0.png";

    this.eventsSubscription = this.events.subscribe(() => this.ClearData());  
    if(this.srv_StMng.IPL.GetItem('HoleTypeSolid').value!='') this.HoleType="Solid";   
    if(this.srv_StMng.IPL.GetItem('HoleTypePreHole').value!='') this.HoleType="PreHole";   
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
    if( this.HoleType=='Solid') 
      this.ImageName= environment.ImageInputPath + this.srv_StMng.SecApp + ".png";
    else
      this.ImageName= environment.ImageInputPath + this.srv_StMng.SecApp + "_0.png";
  }
  
  changeSolidHole(val)
  {
    this.changeinputimage(val);
    if(val=="Solid_Through" || val=="Solid_Blind") 
      {
        this.srv_StMng.IPL.GetItem('D2Min').required=true;
        this.srv_StMng.IPL.GetItem('D2Max').required=true;
        
        this.srv_StMng.IPL.GetItem('D2').required=false;
        this.srv_StMng.IPL.GetItem('D3').required=false;

        this.srv_StMng.IPL.GetItem('HoleTypePreHole').value='';       
        this.HoleType='Solid';
      }                   
    if(val=="Hole_Through" || val=="Hole_Blind") 
      {
        this.srv_StMng.IPL.GetItem('D2').required=true;
        this.srv_StMng.IPL.GetItem('D3').required=true;
  
         this.srv_StMng.IPL.GetItem('D2Min').required=false;
        this.srv_StMng.IPL.GetItem('D2Max').required=false;
       
        this.srv_StMng.IPL.GetItem('HoleTypeSolid').value='';        
        this.HoleType='PreHole';
      }                  
 } 

 changeinputimage(val)
 {     
    if(val=='Solid_Through')
    {
      this.srv_StMng.IPL.GetItem('D2Min').image='inpt_SM_Throughhole_holeDiameter720.png';
      this.srv_StMng.IPL.GetItem('D2Max').image='inpt_SM_Throughhole_holeDiameter720.png';
      this.srv_StMng.IPL.GetItem('Depth').image='inpt_SM_Throughhole_Depth720.png';      
    }
    if(val=='Solid_Blind')
    {
      this.srv_StMng.IPL.GetItem('D2Min').image='inpt_SM_Blindhole_HoleDiameter720.png';
      this.srv_StMng.IPL.GetItem('D2Max').image='inpt_SM_Blindhole_HoleDiameter720.png';
      this.srv_StMng.IPL.GetItem('Depth').image='inpt_SM_Blindhole_Depth720.png';      
    }
     if(val=='Hole_Through')
    {     
      this.srv_StMng.IPL.GetItem('D3').image='inpt_PH_ThroughHole_PreHoleDiameter720.png';
      this.srv_StMng.IPL.GetItem('D2').image='inpt_PH_Throughhole_HoleDiameter720.png';
      this.srv_StMng.IPL.GetItem('Depth').image='inpt_PH_ThroughHole_Depth720.png';      
    }
     if(val=='Hole_Blind')
    {     
      this.srv_StMng.IPL.GetItem('D3').image='inpt_PH_Blindhole_PreholeDiameter720.png';
      this.srv_StMng.IPL.GetItem('D2').image='inpt_PH_Blindhole_HoleDiameter720.png';
      this.srv_StMng.IPL.GetItem('Depth').image='inpt_PH_Blindhole_Depth720.png';      
    }
 }

   ClearData()
  {
    if( this.HoleType=='Solid') 
    {       
        this.srv_StMng.IPL.GetItem('D2Min').value ='0';
        this.srv_StMng.IPL.GetItem('D2Max').value ='0';         
    }                   
    if( this.HoleType=='PreHole') 
    {
        this.srv_StMng.IPL.GetItem('D2').value =null; 
        this.srv_StMng.IPL.GetItem('D3').value =null;       
    }
    this.srv_StMng.IPL.GetItem('Depth').value =null;    
    this.srv_StMng.IPL.GetItem('Clamping').value =this.srv_StMng.IPL.GetItem('Clamping').valuedefault;   
  }
  
  OnDepthChange()
  {   
    if(this.srv_StMng.IPL.GetItem('Depth').value>this.srv_StMng.IPL.GetItem('Depth').valuemax)
      {
        this.srv_StMng.IPL.GetItem('Depth').value=null;
        alert('Maximum value is <' + this.srv_StMng.IPL.GetItem('Depth').valuemax + '>');
      }
  }

  strMandatory:string='';
  SetIPLMandatory()
  {
    this.strMandatory='';
    if( this.HoleType=='Solid') 
    {
      this.AddTostrMandatoryParam('D2Min',"DH min:",this.srv_appsetting.UnitslengthDesc);
      this.AddTostrMandatoryParam('D2Max',"DH max:",this.srv_appsetting.UnitslengthDesc);
    }
    if( this.HoleType=='PreHole') 
    {
      this.AddTostrMandatoryParam('D2',"DPH:",this.srv_appsetting.UnitslengthDesc);
      this.AddTostrMandatoryParam('D3',"DH:",this.srv_appsetting.UnitslengthDesc);
    }
    this.AddTostrMandatoryParam('Depth',"D:",this.srv_appsetting.UnitslengthDesc);

    if(this.strMandatory.length>0)
      this.msrv_StMng.IPLMMandatory=this.strMandatory.substring(0,this.strMandatory.length-2);
  }

  AddTostrMandatoryParam(name:string,desc:string,units:string)
  {
    if(this.srv_StMng.IPL.GetItem(name).value!=null && this.srv_StMng.IPL.GetItem(name).value!='')
    this.strMandatory=this.strMandatory +desc + this.srv_StMng.IPL.GetItem(name).value + units + ', ';
    
  }
}
