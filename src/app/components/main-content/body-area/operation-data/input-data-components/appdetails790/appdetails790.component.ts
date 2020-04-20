import { Component, OnInit,Input } from '@angular/core';
import { StateManagerService} from 'src/app/services/statemanager.service' ;
import { AppsettingService} from 'src/app/services/appsetting.service';
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
  private eventsSubscription: Subscription; 

  constructor(private srv_StMng:StateManagerService,private srv_appsetting:AppsettingService) { }
 
    options_d2: Options = {
    floor: 0,
    ceil: 100 , // Number(this.srv_StMng.IPL.GetItem('D2Max').valuemax),
    step: 0.1,
    showTicks: false
  };

 ngOnInit() {  
    this.eventsSubscription = this.events.subscribe(() => this.ClearData());  
    if(this.srv_StMng.IPL.GetItem('HoleTypeSolid').value=='Solid') this.HoleType="Solid";   
    if(this.srv_StMng.IPL.GetItem('HoleTypePreHole').value=='PreHole') this.HoleType="PreHole";   
    this.changeinputimage(this.HoleType);
  }

  changeSolidHole(val)
  {
    this.changeinputimage(val);
    if(val=="Solid") 
      {     
        this.srv_StMng.IPL.GetItem('HoleTypeSolid').value='Solid';
        this.srv_StMng.IPL.GetItem('HoleTypePreHole').value='';     
        this.srv_StMng.IPL.GetItem('D3').required=false;        
      }                   
    if(val=="PreHole") 
      {
        this.srv_StMng.IPL.GetItem('HoleTypeSolid').value='';
        this.srv_StMng.IPL.GetItem('HoleTypePreHole').value='PreHole';
        this.srv_StMng.IPL.GetItem('D3').required=true;
      }                  
 } 

  changeinputimage(val)
 {     
    if(val=='Solid')
    {
        //this.srv_StMng.IPL.GetItem('D3').image= "Images/Disk/jpg_png_gif/inpt_SM_Prehole_Diameter750.jpg";
        this.srv_StMng.IPL.GetItem('LengthOfShoulder_L').image= "inpt_SM_Length750.jpg";
        this.srv_StMng.IPL.GetItem('WidthOfShoulder_ae').image= "inpt_SM_Width750.jpg";
        this.srv_StMng.IPL.GetItem('DepthOfShoulder_ap').image= "inpt_SM_Depth750.jpg";
        this.srv_StMng.IPL.GetItem('RToleranceMin').image= "inpt_SM_Radius750.jpg";
        this.srv_StMng.IPL.GetItem('MinCornerRadius').image= "inpt_SM_ButtomRadius750.jpg";
        this.srv_StMng.IPL.GetItem('MaxCornerRadius').image= "inpt_SM_ButtomRadius750.jpg";          
    }

    if(val=='PreHole')
    {
        this.srv_StMng.IPL.GetItem('D3').image= "inpt_PH_Prehole_Diameter750.jpg";
        this.srv_StMng.IPL.GetItem('LengthOfShoulder_L').image= "inpt_PH_Length750.jpg";
        this.srv_StMng.IPL.GetItem('WidthOfShoulder_ae').image= "inpt_PH_Width750.jpg";
        this.srv_StMng.IPL.GetItem('DepthOfShoulder_ap').image= "inpt_PH_Depth750.jpg";
        this.srv_StMng.IPL.GetItem('RToleranceMin').image= "inpt_PH_Radius750.jpg";
        this.srv_StMng.IPL.GetItem('MinCornerRadius').image= "inpt_PH_ButtomRadius750.jpg";
        this.srv_StMng.IPL.GetItem('MaxCornerRadius').image= "inpt_PH_ButtomRadius750.jpg";        
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
    this.ImageName="";
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

  OnDepthChange ()
  {
    
  }
}
