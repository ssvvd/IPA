import { Component, OnInit,Input } from '@angular/core';
import { StateManagerService} from '../../../../../../services/statemanager.service' ;
import { AppsettingService} from '../../../../../../services/appsetting.service';
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
  HoleType1:string='Solid_Through';
  environment=environment;

  @Input() events: Observable<void>;
  @Input() exportPDF: boolean=false;
  private eventsSubscription: Subscription; 
  public msrv_StMng:StateManagerService =this.srv_StMng;
  public msrv_appsetting:AppsettingService =this.srv_appsetting;
  CostPerHourByRate:number;
  constructor(private srv_StMng:StateManagerService,private srv_appsetting:AppsettingService) { }
 
    options_d2: Options = {
    floor: 0,
    ceil:  Number(this.srv_StMng.IPL.GetItem('D2Max').valuemax),
    step: 0.1,
    showTicks: false
  };

 ngOnInit() {
    this.SetIPLMandatory('');
    this.SetImageApp();  
  
    this.eventsSubscription = this.events.subscribe(() => this.ClearData());  
    if(this.srv_StMng.IPL.GetItem('HoleTypeSolid').value!='') this.HoleType="Solid";   
    if(this.srv_StMng.IPL.GetItem('HoleTypePreHole').value!='') this.HoleType="PreHole";  
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
    this.SetImageApp();  
  }
  
  SetImageApp()
  {
    if( this.HoleType1=='Solid_Through') this.ImageName= environment.ImageInputPath + '780_1.png';
    if( this.HoleType1=='Solid_Blind') this.ImageName= environment.ImageInputPath + '780.png';
    if( this.HoleType1=='Hole_Through') this.ImageName= environment.ImageInputPath + '780_1-PreHole.png';
    if( this.HoleType1=='Hole_Blind') this.ImageName= environment.ImageInputPath + '780-PreHole.png';
  }
  changeSolidHole(val)
  {
    this.changeinputimage(val);
    this.HoleType1=val;
    if(val=="Solid_Through" || val=="Solid_Blind") 
      {
        this.srv_StMng.IPL.GetItem('D2Min').required=true;
        this.srv_StMng.IPL.GetItem('D2Max').required=true;
        
        this.srv_StMng.IPL.GetItem('D2').required=false;
        this.srv_StMng.IPL.GetItem('D3').required=false;

        this.srv_StMng.IPL.GetItem('HoleTypePreHole').value='';       
        this.HoleType='Solid';
        this.SetIPLMandatory('');
      }                   
    if(val=="Hole_Through" || val=="Hole_Blind") 
      {
        this.srv_StMng.IPL.GetItem('D2').required=true;
        this.srv_StMng.IPL.GetItem('D3').required=true;
  
         this.srv_StMng.IPL.GetItem('D2Min').required=false;
        this.srv_StMng.IPL.GetItem('D2Max').required=false;
       
        this.srv_StMng.IPL.GetItem('HoleTypeSolid').value='';        
        this.HoleType='PreHole';
        this.SetIPLMandatory('');
      }    
      this.SetImageApp();               
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
      this.srv_StMng.IPL.GetItem('D3').image='inpt_PH_BlindHole_PreholeDiameter720.png';
      this.srv_StMng.IPL.GetItem('D2').image='inpt_PH_BlindHole_HoleDiameter720.png';
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

  CheckValuesFields(field:string)
  {
    if(field=='D2Min' || field=='D2Max')
    {
      if(this.srv_StMng.IPL.GetItem('D2Min').value!=null && this.srv_StMng.IPL.GetItem('D2Min').value!='' &&
        this.srv_StMng.IPL.GetItem('D2Max').value!=null && this.srv_StMng.IPL.GetItem('D2Max').value!='')
        if(this.srv_StMng.IPL.GetItem('D2Min').value >this.srv_StMng.IPL.GetItem('D2Max').value)
        {          
          alert("D Hole Min diameter should be smaller than D Hole Max diameter");        
          this.srv_StMng.IPL.GetItem(field).value=null;          
        }
    }
    if(field=='D2' || field=='D3')
    {
      if(this.srv_StMng.IPL.GetItem('D2').value!=null && this.srv_StMng.IPL.GetItem('D2').value!='' &&
        this.srv_StMng.IPL.GetItem('D3').value!=null && this.srv_StMng.IPL.GetItem('D3').value!='')
        if(this.srv_StMng.IPL.GetItem('D3').value >this.srv_StMng.IPL.GetItem('D2').value)
        {        
          let v:string;
          if(this.srv_appsetting.Units=='M') v='0.01';
          if(this.srv_appsetting.Units=='I') v='0.004';
          alert('Final diameter should be bigger than the pre hole in ' + v + this.srv_appsetting.UnitslengthDesc);        
          this.srv_StMng.IPL.GetItem(field).value=null;          
        }
    }
    if(field=='Depth')
    {
      if(this.srv_StMng.IPL.GetItem('Depth').value!=null && this.srv_StMng.IPL.GetItem('Depth').value!='')
      {
        if(Number(this.srv_StMng.IPL.GetItem('Depth').value )>400)
        {
          let v:string;
          if(this.srv_appsetting.Units=='M') v='400';
          if(this.srv_appsetting.Units=='I') v='16';
          alert('Maximum value is ' + v);        
          this.srv_StMng.IPL.GetItem(field).value=null;
        }
      }
    }   
  }

  strMandatory:string='';
  SetIPLMandatory(field:string)  
  {
    this.CheckValuesFields(field);
    this.strMandatory='';
    if( this.HoleType=='Solid') 
    {
      this.AddTostrMandatoryParam('D2Min',"DH min:",this.srv_appsetting.UnitslengthDesc);
      this.AddTostrMandatoryParam('D2Max',"DH max:",this.srv_appsetting.UnitslengthDesc);
    }
    if( this.HoleType=='PreHole') 
    {
      this.AddTostrMandatoryParam('D3',"DPH:",this.srv_appsetting.UnitslengthDesc);
      this.AddTostrMandatoryParam('D2',"DH:",this.srv_appsetting.UnitslengthDesc);
      
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
