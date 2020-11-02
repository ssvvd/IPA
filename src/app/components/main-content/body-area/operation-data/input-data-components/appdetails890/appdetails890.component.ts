import { Component, OnInit,Input } from '@angular/core';
import { StateManagerService} from 'src/app/services/statemanager.service' ;
import { AppsettingService} from 'src/app/services/appsetting.service';
import { SurfacequalityService} from 'src/app/services/surfacequality.service';
import { environment } from 'src/environments/environment';
import { Observable ,Subscription,Subject} from 'rxjs';


@Component({
  selector: 'appdetails890',
  templateUrl: './appdetails890.component.html',
  styleUrls: ['./appdetails890.component.scss']
})
export class Appdetails890Component implements OnInit {

  ImageName:string='';
  InFocus:boolean=false;
  environment=environment;
  
   @Input() events: Observable<void>;
   @Input() exportPDF: boolean;
  private eventsSubscription: Subscription;  
  eventsSubject: Subject<void> = new Subject<void>();

  public msrv_StMng:StateManagerService =this.srv_StMng;
  public msrv_appsetting:AppsettingService =this.srv_appsetting;
  //private s:SurfacequalityService;
  UnitsSurf:string;
  CostPerHourByRate:number;

  N:number;
  Ra:number;
  Rt:number;
  RMS:number;

  constructor(private srv_StMng:StateManagerService,private srv_appsetting:AppsettingService,private srv_sq:SurfacequalityService) 
  {   
    this.srv_sq.FillData(this.srv_appsetting.Units);
  }

  ngOnInit() {  
    this.SetIPLMandatory();
    this.ImageName= environment.ImageInputPath + this.srv_StMng.SecApp + ".png";
    this.eventsSubscription = this.events.subscribe(() => this.ClearData());  
    if(this.srv_StMng.IPL.GetItem('SurfaceQualityRt').value!=null  && this.srv_StMng.IPL.GetItem('SurfaceQualityRt').value!='')    
      {
        this.Rt=Number(this.srv_StMng.IPL.GetItem('SurfaceQualityRt').value);
        this.onchangeRt();
        if(this.Rt==0)
          {
              this.N=0;
              this.Ra=0;
              this.RMS=0;
          }
      }
    if(this.srv_appsetting.Units=='M')
      this.UnitsSurf='μm';    
    else
      this.UnitsSurf='microinch';

    this.CostPerHourByRate = Math.round(this.msrv_StMng.SelectedMachine.CostPerHour / this.srv_appsetting.CurrRate*100)/100;     
  }
 
  onfocusfield(field:string)
  {
    this.InFocus=true;
    if(field=='surface')
      this.ImageName= environment.ImageInputPath + "inpt_surface" + this.srv_StMng.SecApp+".png";
    else
      this.ImageName= environment.ImageInputPath + this.srv_StMng.IPL.GetItem(field).image;
  }

  onfocusoutfield()
  {  
    this.InFocus=false;
    this.ImageName= environment.ImageInputPath + this.srv_StMng.SecApp + ".png";
  }

  onchangeN()
  {
    if(this.srv_sq.GetNMinMax(this.N)!=0)
      {
        this.Rt=this.srv_sq.GetRtByN(this.N);
        this.Ra=this.srv_sq.GetRaByN(this.N);
        this.RMS=this.srv_sq.GetRMSByN(this.N);
        this.srv_StMng.IPL.GetItem('SurfaceQualityRt').value =this.Rt.toString();
      }
      else      
        this.srv_StMng.IPL.GetItem('SurfaceQualityRt').value ='0';
        
  }

  onchangeRt()
  {
    this.Rt=this.srv_sq.GetRtMinMax(this.Rt);
    if(this.Rt!=0)
      {
        this.Ra=this.srv_sq.GetRa(this.Rt);      
        this.RMS=this.srv_sq.GetRMS(this.Ra);
        this.N=this.srv_sq.GetN(this.Rt);
        this.srv_StMng.IPL.GetItem('SurfaceQualityRt').value =this.Rt.toString();
      }
      else      
        this.srv_StMng.IPL.GetItem('SurfaceQualityRt').value ='0';
      
  }
  
  onchangeRa()
  {
    this.Ra=this.srv_sq.GetRaMinMax(this.Ra);
    if(this.Ra!=0)
      {
        this.Rt=this.srv_sq.GetRt(this.Ra);      
        this.RMS=this.srv_sq.GetRMS(this.Ra);
        this.N=this.srv_sq.GetN(this.Rt);
        this.srv_StMng.IPL.GetItem('SurfaceQualityRt').value =this.Rt.toString();
      }
      else      
        this.srv_StMng.IPL.GetItem('SurfaceQualityRt').value ='0';      
  }
  
  onchangeRMS()
  {
    this.RMS=this.srv_sq.GetRMSMinMax(this.Ra);
    if(this.RMS!=0)
      {          
        this.Ra=this.srv_sq.GetRaByRMS(this.Ra);
        this.Rt=this.srv_sq.GetRt(this.Ra);    
        this.N=this.srv_sq.GetN(this.Rt);
        this.srv_StMng.IPL.GetItem('SurfaceQualityRt').value =this.Rt.toString();
      }
      else      
        this.srv_StMng.IPL.GetItem('SurfaceQualityRt').value ='0'; 
  }

  ClearData()
  {
    switch (this.srv_StMng.SecApp.toString())
    {     
      case '890' :
      {      
        this.srv_StMng.IPL.GetItem('WorkpieceDiameter').value =null;
        this.srv_StMng.IPL.GetItem('GroovePosition').value =null;
        this.srv_StMng.IPL.GetItem('DepthAxial').value =null;
        this.srv_StMng.IPL.GetItem('CutLengthAxial').value =null;  
        this.srv_StMng.IPL.GetItem('RmaxAxial').value =null;         
        break;
      }
      case '880' :
      {
        this.srv_StMng.IPL.GetItem('WorkpieceDiameterRad').value =null;
        this.srv_StMng.IPL.GetItem('GroovePositionRad').value =null;
        this.srv_StMng.IPL.GetItem('DepthRadial').value =null;
        this.srv_StMng.IPL.GetItem('CutLengthRadial').value =null;  
        this.srv_StMng.IPL.GetItem('RmaxAxial').value =null;           
        break;
      }    
       case '870' :
      {     
        this.srv_StMng.IPL.GetItem('WorkpieceDiameter').value =null;
        this.srv_StMng.IPL.GetItem('GroovePosition').value =null;
        this.srv_StMng.IPL.GetItem('DepthAxial').value =null;
        this.srv_StMng.IPL.GetItem('CutLengthAxial').value =null;  
        this.srv_StMng.IPL.GetItem('RmaxAxial').value =null; 
         this.srv_StMng.IPL.GetItem('WorkpieceDiameterRad').value =null;
        this.srv_StMng.IPL.GetItem('GroovePositionRad').value =null;
        this.srv_StMng.IPL.GetItem('DepthRadial').value =null;
        this.srv_StMng.IPL.GetItem('CutLengthRadial').value =null;  
        this.srv_StMng.IPL.GetItem('RmaxRadial').value =null;            
        break;
      }   
      case '860':
      {             
        this.srv_StMng.IPL.GetItem('WorkpieceDiameter').value =null;
        this.srv_StMng.IPL.GetItem('GroovePosition').value =null;
        this.srv_StMng.IPL.GetItem('DepthAxial').value =null;
        this.srv_StMng.IPL.GetItem('CutLengthAxial').value =null;  
        this.srv_StMng.IPL.GetItem('RmaxAxial').value =null;         
        break;
      }
      case '850':
      {             
        this.srv_StMng.IPL.GetItem('WorkpieceDiameter').value =null;
        this.srv_StMng.IPL.GetItem('GroovePosition').value =null;
        this.srv_StMng.IPL.GetItem('DepthAxial').value =null;
        this.srv_StMng.IPL.GetItem('CutLengthAxial').value =null;  
        this.srv_StMng.IPL.GetItem('RmaxAxial').value =null;         
        break;
      }
    }    
    this.srv_StMng.IPL.GetItem('OperationType').value =this.srv_StMng.IPL.GetItem('OperationType').valuedefault;
    this.srv_StMng.IPL.GetItem('OperationType4Solid').value =this.srv_StMng.IPL.GetItem('OperationType4Solid').valuedefault;
    this.srv_StMng.IPL.GetItem('OverHang').value =this.srv_StMng.IPL.GetItem('OverHang').valuedefault;
    this.srv_StMng.IPL.GetItem('Clamping').value =this.srv_StMng.IPL.GetItem('Clamping').valuedefault;
    this.srv_StMng.IPL.GetItem('PartShape').value =this.srv_StMng.IPL.GetItem('PartShape').valuedefault;    
    this.srv_StMng.IPL.GetItem('TypeOfCut').value =this.srv_StMng.IPL.GetItem('TypeOfCut').valuedefault;    
    this.eventsSubject.next();
  }

  strMandatory:string='';
  SetIPLMandatory()
  {   
    this.strMandatory='';       
    if( this.srv_StMng.SecApp=='890')
    {
      this.AddTostrMandatoryParam('WorkpieceDiameter',"D:",this.srv_appsetting.UnitslengthDesc);
      this.AddTostrMandatoryParam('GroovePosition',"LP:",this.srv_appsetting.UnitslengthDesc);
      this.AddTostrMandatoryParam('DepthAxial',"LR:",this.srv_appsetting.UnitslengthDesc);     
    }
    if( this.srv_StMng.SecApp=='880')
    {
      this.AddTostrMandatoryParam('WorkpieceDiameterRad',"D:",this.srv_appsetting.UnitslengthDesc);
      this.AddTostrMandatoryParam('GroovePositionRad',"LP:",this.srv_appsetting.UnitslengthDesc);
      this.AddTostrMandatoryParam('DepthRadial',"LA:",this.srv_appsetting.UnitslengthDesc);    
      this.AddTostrMandatoryParam('CutLengthRadial',"LR:",this.srv_appsetting.UnitslengthDesc);            
    } 
    if( this.srv_StMng.SecApp=='870')
    {
      this.AddTostrMandatoryParam('WorkpieceDiameter',"D1:",this.srv_appsetting.UnitslengthDesc);
      this.AddTostrMandatoryParam('GroovePosition',"LP1:",this.srv_appsetting.UnitslengthDesc);
      this.AddTostrMandatoryParam('DepthAxial',"LR1:",this.srv_appsetting.UnitslengthDesc);    
      this.AddTostrMandatoryParam('WorkpieceDiameterRad',"D2:",this.srv_appsetting.UnitslengthDesc);      
      
    } 
    if( this.srv_StMng.SecApp=='860')
    {
      this.AddTostrMandatoryParam('WorkpieceDiameter',"D:",this.srv_appsetting.UnitslengthDesc);
      this.AddTostrMandatoryParam('GroovePosition',"LP:",this.srv_appsetting.UnitslengthDesc);
      this.AddTostrMandatoryParam('DepthAxial',"DPT:",this.srv_appsetting.UnitslengthDesc);            
    } 
    if( this.srv_StMng.SecApp=='850')
    {
      this.AddTostrMandatoryParam('WorkpieceDiameter',"D:",this.srv_appsetting.UnitslengthDesc);
      this.AddTostrMandatoryParam('GroovePosition',"LP:",this.srv_appsetting.UnitslengthDesc);
      this.AddTostrMandatoryParam('DepthAxial',"DPT:",this.srv_appsetting.UnitslengthDesc);            
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
