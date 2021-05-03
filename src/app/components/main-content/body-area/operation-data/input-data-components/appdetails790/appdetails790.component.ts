import { Component, OnInit,Input } from '@angular/core';
import { StateManagerService} from '../../../../../../services/statemanager.service' ;
import { AppsettingService} from '../../../../../../services/appsetting.service';
import { environment } from 'src/environments/environment';
import { Options,ChangeContext } from 'ng5-slider';
import { Observable ,Subscription} from 'rxjs';


@Component({
  selector: 'app-appdetails790',
  templateUrl: './appdetails790.component.html',
  styleUrls: ['./appdetails790.component.scss']
})
export class Appdetails790Component implements OnInit {

  ImageName:string='';
  InFocus:boolean=false;
  HoleType:string='Solid';
  environment=environment;
  
  @Input() events: Observable<void>;
  @Input() exportPDF: boolean;
  private eventsSubscription: Subscription; 
  
  public msrv_StMng:StateManagerService =this.srv_StMng;
  public msrv_appsetting:AppsettingService =this.srv_appsetting;
  CostPerHourByRate:number;
  constructor(private srv_StMng:StateManagerService,private srv_appsetting:AppsettingService) { }
  
 ngOnInit() { 
    this.SetIPLMandatory(''); 
    if(this.HoleType=="Solid") 
      this.ImageName= environment.ImageInputPath + this.srv_StMng.SecApp + ".png";
    else
      this.ImageName= environment.ImageInputPath + this.srv_StMng.SecApp + "_PH.png";

    this.eventsSubscription = this.events.subscribe(() => this.ClearData());  
    if(this.srv_StMng.IPL.GetItem('HoleTypeSolid').value=='Solid') this.HoleType="Solid";   
    if(this.srv_StMng.IPL.GetItem('HoleTypePreHole').value=='PreHole') this.HoleType="PreHole";   
    this.changeinputimage(this.HoleType);

    this.CostPerHourByRate = Math.round(this.msrv_StMng.SelectedMachine.CostPerHour / this.srv_appsetting.CurrRate*100)/100;     
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }
  
  changeSolidHole(val)
  {
    this.changeinputimage(val);
    if(val=="Solid") 
      {     
        this.srv_StMng.IPL.GetItem('HoleTypeSolid').value='Solid';
        this.srv_StMng.IPL.GetItem('HoleTypePreHole').value='';     
        this.srv_StMng.IPL.GetItem('D3').required=false; 
        this.SetIPLMandatory('');       
      }                   
    if(val=="PreHole") 
      {
        this.srv_StMng.IPL.GetItem('HoleTypeSolid').value='';
        this.srv_StMng.IPL.GetItem('HoleTypePreHole').value='PreHole';
        this.srv_StMng.IPL.GetItem('D3').required=true;
        this.SetIPLMandatory('');
      } 
    if(val=="Solid") 
      this.ImageName= environment.ImageInputPath + this.srv_StMng.SecApp + ".png";
    else
      this.ImageName= environment.ImageInputPath + this.srv_StMng.SecApp + "_PH.png";                 
 } 

  changeinputimage(val)
 {     
    if(val=='Solid')
    {     
        this.srv_StMng.IPL.GetItem('LengthOfShoulder_L').image= "inpt_SM_Length750.png";
        this.srv_StMng.IPL.GetItem('WidthOfShoulder_ae').image= "inpt_SM_Width750.png";
        this.srv_StMng.IPL.GetItem('DepthOfShoulder_ap').image= "inpt_SM_Depth750.png";
        this.srv_StMng.IPL.GetItem('RToleranceMin').image="inpt_SM_ButtomRadius750.png";
        this.srv_StMng.IPL.GetItem('MinCornerRadius').image= "inpt_SM_Radius750.png";
        this.srv_StMng.IPL.GetItem('MaxCornerRadius').image= "inpt_SM_Radius750.png";        
    }

    if(val=='PreHole')
    {
        this.srv_StMng.IPL.GetItem('D3').image= "inpt_PH_Prehole_Diameter750.png";
        this.srv_StMng.IPL.GetItem('LengthOfShoulder_L').image= "inpt_PH_Length750.png";
        this.srv_StMng.IPL.GetItem('WidthOfShoulder_ae').image= "inpt_PH_Width750.png";
        this.srv_StMng.IPL.GetItem('DepthOfShoulder_ap').image= "inpt_PH_Depth750.png";
        this.srv_StMng.IPL.GetItem('RToleranceMin').image= "inpt_PH_ButtomRadius750.png";
        this.srv_StMng.IPL.GetItem('MinCornerRadius').image= "inpt_PH_Radius750.png";
        this.srv_StMng.IPL.GetItem('MaxCornerRadius').image= "inpt_PH_Radius750.png";    
    }    
 }


  onfocusfield(field:string)
  {    
    this.InFocus=true;    
    this.ImageName= environment.ImageInputPath + this.srv_StMng.IPL.GetItem(field).image;

  }

  onfocusoutfield()
  {  
    this.InFocus=false;
    if(this.HoleType=="Solid") 
      this.ImageName= environment.ImageInputPath + this.srv_StMng.SecApp + ".png";
    else
      this.ImageName= environment.ImageInputPath + this.srv_StMng.SecApp + "_PH.png";
  }

 ClearData()
  {
    this.srv_StMng.IPL.GetItem('D3').value=null;
    this.srv_StMng.IPL.GetItem('LengthOfShoulder_L').value=null;
    this.srv_StMng.IPL.GetItem('WidthOfShoulder_ae').value=null;
    this.srv_StMng.IPL.GetItem('DepthOfShoulder_ap').value=null;
    this.srv_StMng.IPL.GetItem('RToleranceMin').value=null;
    this.srv_StMng.IPL.GetItem('MinCornerRadius').value=null;
    this.srv_StMng.IPL.GetItem('MaxCornerRadius').value=null; 
    this.srv_StMng.IPL.GetItem('Clamping').value =this.srv_StMng.IPL.GetItem('Clamping').valuedefault;   
  }

  strMandatory:string='';
  SetIPLMandatory(field:string)
  {   
    this.CheckValuesFields(field);
    this.strMandatory=''; 
    if(this.HoleType=='Solid')
    {       
        this.AddTostrMandatoryParam('D3',"DPH:",this.srv_appsetting.UnitslengthDesc);
    }   
    this.AddTostrMandatoryParam('LengthOfShoulder_L',"L:",this.srv_appsetting.UnitslengthDesc);
    this.AddTostrMandatoryParam('WidthOfShoulder_ae',"W:",this.srv_appsetting.UnitslengthDesc); 
    this.AddTostrMandatoryParam('DepthOfShoulder_ap',"D:",this.srv_appsetting.UnitslengthDesc);
    this.AddTostrMandatoryParam('RToleranceMin',"CR:",this.srv_appsetting.UnitslengthDesc);
    
    if(this.strMandatory.length>0)
      this.msrv_StMng.IPLMMandatory=this.strMandatory.substring(0,this.strMandatory.length-2);
  }

ChangeField(field:string)
{
  if (this.CheckInputValues(field)) this.CheckInputValues1(field);
  this.SetIPLMandatory(field);
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

  CheckInputValues(field) {
         
    var diameter = this.srv_StMng.IPL.GetItem('D3').value;
    var length = this.srv_StMng.IPL.GetItem('LengthOfShoulder_L').value;
    var width = this.srv_StMng.IPL.GetItem('WidthOfShoulder_ae').value;

    var msg1 = 'Pre hole should be smaller than ';
  
    var val;
    val = 0;
    
    if (diameter != '') val = this.GetMessageValidate();
    
    if (val != 0) {            
        alert(msg1+ ' ' + Math.round(val * 100) / 100);
        if (field == 'D3') this.srv_StMng.IPL.GetItem('D3').value=null;  
        if (field == 'LengthOfShoulder_L')  this.srv_StMng.IPL.GetItem('LengthOfShoulder_L').value =null;                               
        if (field == 'WidthOfShoulder_ae')  this.srv_StMng.IPL.GetItem('WidthOfShoulder_ae').value =null;                       
     
        return false;
    }            
    return true;
}

 CheckInputValues1(field) {        
  var diameter = this.srv_StMng.IPL.GetItem('D3').value;
  var radius = this.srv_StMng.IPL.GetItem('RToleranceMin').value;
  var minradius = this.srv_StMng.IPL.GetItem('MinCornerRadius').value;
  var maxradius = this.srv_StMng.IPL.GetItem('MaxCornerRadius').value;
  var length = this.srv_StMng.IPL.GetItem('LengthOfShoulder_L').value;
  var width = this.srv_StMng.IPL.GetItem('WidthOfShoulder_ae').value;

  var msg2 = '';//document.getElementById('<%=lblmsg2.ClientID%>');
  var msg3 = 'Corner radius should be smaller than half of cavity width';
  var msg4 = 'Corner radius should be smaller than half of cavity length';
  var msg5 = 'Min bottom radius should be smaller or equal than Corner radius';
  var msg6 = 'Max bottom radius  should be bigger or equal than Min botton radius';           

 if (radius != null && width != null && length != null) {
      if (2* Number(radius) > Number(width) && Number(width) <= Number(length)) {

          alert(msg3);
          if (field == 'RToleranceMin') {
              radius = null;             
          }
          if (field == 'WidthOfShoulder_ae') {
              width= null;  
          }
          if (field == 'LengthOfShoulder_L') {
              length= null;   
          }
          return false;
      }
  }

  if (radius != null && length != null && width!=null) {
      if (2 * Number(radius) > Number(length) && Number(length) <= Number(width)) {

          alert(msg4);
          if (field == 'RToleranceMin') {
              radius= null;
          }
          if (field == 'LengthOfShoulder_L') {
            length= null;   
        }
        if (field == 'WidthOfShoulder_ae') {
          width= null;  
        }
          return false;
      }
  }

  if (radius !=null && minradius !=null) {  
      if (Number(minradius) > Number(radius)) {
          //alert('Min bottom radius should be ≤ Corner radius');
          alert(msg5);
          if (field == 'RToleranceMin') {
            radius= null;
        }
          if (field == 'txtminradius') {
              minradius= null;
            }
          return false;
      }
  }

  if (minradius!=null && maxradius != null) {
      if (Number(minradius) > Number(maxradius)) {                 
          alert(msg6);
          if (field == 'MinCornerRadius') {
              minradius=null;
          }
          if (field == 'MaxCornerRadius') {
              maxradius=null;
          }
          return false;
      }
  }
}

CheckInputFields(field) {     
  
  var diameter = this.srv_StMng.IPL.GetItem('D3').value;
  var radius = this.srv_StMng.IPL.GetItem('RToleranceMin').value;
  var minradius = this.srv_StMng.IPL.GetItem('MinCornerRadius').value;
  var maxradius = this.srv_StMng.IPL.GetItem('MaxCornerRadius').value;
  var length = this.srv_StMng.IPL.GetItem('LengthOfShoulder_L').value;
  var width = this.srv_StMng.IPL.GetItem('WidthOfShoulder_ae').value;

  if(field=='DepthOfShoulder_ap')
  {    
    let v:string;
    if(this.srv_appsetting.Units=='M') v='400';
    if(this.srv_appsetting.Units=='I') v='16';
    if(Number(this.srv_StMng.IPL.GetItem('DepthOfShoulder_ap').value )>Number(v))
    {         
      alert('Maximum value is ' + v);        
      this.srv_StMng.IPL.GetItem(field).value=null;
    }   
  }

  if(field=='D3' || field=='LengthOfShoulder_L'  || field=='WidthOfShoulder_ae')
  {
    let prehole=this.GetMessageValidate();
    if(prehole!=0)
      if(Number(diameter)>prehole)
      {
        alert("Pre hole should be smaller than " + prehole);
        this.srv_StMng.IPL.GetItem(field).value=null;
      }
  }

  if(field=='RToleranceMin' || field=='D3' || field=='WidthOfShoulder_ae')
  {
    if(radius!=null && radius!='' && diameter!=null && diameter!='')
    {
      if(Number(radius)<Number(diameter)/2)
      {
        //alert("Corner radius should be bigger than half of pre hole diameter");
        //this.srv_StMng.IPL.GetItem(field).value=null;
      }
    }
    if(radius!=null && radius!='' && width!=null && width!='')
    {
      if(Number(radius)>Number(width)/2)
      {
        alert("Corner radius should be smaller than half of cavity length");
        this.srv_StMng.IPL.GetItem(field).value=null;
      }
    }
  }
  
  if(field=='RToleranceMin' || field=='MinCornerRadius' )
  {  
    if(Number(minradius)>Number(radius))
    {
      alert("Min bottom radius should be smaller or equal than Corner radius");
      this.srv_StMng.IPL.GetItem(field).value=null;
    }
  }

  if(field=='RToleranceMin' || field=='MaxCornerRadius' )
  {  
    if(Number(maxradius)>Number(radius))
    {
      alert("Max bottom radius should be smaller or equal than Corner radius");
      this.srv_StMng.IPL.GetItem(field).value=null;
    }
  }

}
   GetMessageValidate() {
    var diameter = this.srv_StMng.IPL.GetItem('D3').value;
    var length = this.srv_StMng.IPL.GetItem('LengthOfShoulder_L').value;
    var width = this.srv_StMng.IPL.GetItem('WidthOfShoulder_ae').value;
    var val:number;
    val = 0;

    if (length != null && width != null && length != '' && width != '') {                                  
        if (Number(diameter) > Number(length) || Number(diameter) > Number(width)) {              
            if (Number(length) < Number(width)) {                  
                val = Number(length) * 0.95;
            }
            if (Number(length) >= Number(width)) {                
                val = Number(width)  * 0.95;
            }
        }
   }
    else 
    {
        if (length != '' && length != null) 
        {
            if (Number(diameter) > Number(length) )
            {
                val = Number(length) * 0.95;
            }
    }
       else {
           if (width != '' && width != null)
            {                  
               if (Number(diameter) > Number(width) )
               {
                   val = Number(width)  * 0.95;
               }
           }
       }
   }
   val = Math.round(val * 100) / 100;
   return val;

}

  AddTostrMandatoryParam(name:string,desc:string,units:string)
  {
    if(this.srv_StMng.IPL.GetItem(name).value!=null && this.srv_StMng.IPL.GetItem(name).value!='')
    this.strMandatory=this.strMandatory +desc + this.srv_StMng.IPL.GetItem(name).value + units + ', ';
    
  }
}
