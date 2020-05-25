import { Component, OnInit,Input } from '@angular/core';
import { StateManagerService} from 'src/app/services/statemanager.service' ;
import { AppsettingService} from 'src/app/services/appsetting.service';
import { SurfacequalityService} from 'src/app/services/surfacequality.service';
import { environment } from 'src/environments/environment';
import { Observable ,Subscription,Subject} from 'rxjs';


@Component({
  selector: 'appdetails990',
  templateUrl: './appdetails990.component.html',
  styleUrls: ['./appdetails990.component.scss']
})
export class Appdetails990Component implements OnInit {

  ImageName:string='';
  InFocus:boolean=false;
  environment=environment;
  
   @Input() events: Observable<void>;

  private eventsSubscription: Subscription;  
  eventsSubject: Subject<void> = new Subject<void>();

  public msrv_StMng:StateManagerService =this.srv_StMng;
  public msrv_appsetting:AppsettingService =this.srv_appsetting;
  private s:SurfacequalityService;
  UnitsSurf:string;

  N:number;
  Ra:number;
  Rt:number;
  RMS:number;

  constructor(private srv_StMng:StateManagerService,private srv_appsetting:AppsettingService,private srv_sq:SurfacequalityService) 
  {   
    this.srv_sq.FillData(this.srv_appsetting.Units);
  }

  ngOnInit() {  
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
  }
 
  onfocusfield(field:string)
  {
    this.InFocus=true;
    if(field=='surface')
      this.ImageName= environment.ImageInputPath + "inpt_surface" + this.srv_StMng.SecApp+".jpg";
    else
      this.ImageName= environment.ImageInputPath + this.srv_StMng.IPL.GetItem(field).image;
  }

  onfocusoutfield()
  {  
    this.InFocus=false;
    this.ImageName="";
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
        this.RMS=this.srv_sq.GetRMS(this.Ra);        this.N=this.srv_sq.GetN(this.Rt);
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
      
    this.srv_StMng.IPL.GetItem('WorkpieceDiameter').value =null;
    this.srv_StMng.IPL.GetItem('DepthAxial').value =null;
    this.srv_StMng.IPL.GetItem('DepthRadial').value =null;
    this.srv_StMng.IPL.GetItem('CutLengthAxial').value =null;
    this.srv_StMng.IPL.GetItem('CutLengthRadial').value =null;      
    this.srv_StMng.IPL.GetItem('RmaxAxial').value =null;       
  
    this.srv_StMng.IPL.GetItem('OperationType').value =this.srv_StMng.IPL.GetItem('OperationType').valuedefault;
    this.srv_StMng.IPL.GetItem('OperationType4Solid').value =this.srv_StMng.IPL.GetItem('OperationType4Solid').valuedefault;
    this.srv_StMng.IPL.GetItem('OverHang').value =this.srv_StMng.IPL.GetItem('OverHang').valuedefault;
    this.srv_StMng.IPL.GetItem('Clamping').value =this.srv_StMng.IPL.GetItem('Clamping').valuedefault;
    this.srv_StMng.IPL.GetItem('PartShape').value =this.srv_StMng.IPL.GetItem('PartShape').valuedefault;    
    this.srv_StMng.IPL.GetItem('TypeOfCut').value =this.srv_StMng.IPL.GetItem('TypeOfCut').valuedefault;    
    this.eventsSubject.next();
  }
}
