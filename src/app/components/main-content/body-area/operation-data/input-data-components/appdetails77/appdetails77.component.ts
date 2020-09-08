import { Component, OnInit,Input } from '@angular/core';
import { StateManagerService} from 'src/app/services/statemanager.service' ;
import { AppsettingService} from 'src/app/services/appsetting.service';
import { DatalayerService} from 'src/app/services/datalayer.service' ;
import { environment } from 'src/environments/environment';
import { Observable, Subscription } from 'rxjs';

export interface DiameterHole
{
  Value:number;
  Description:string;
}

@Component({
  selector: 'app-appdetails77',
  templateUrl: './appdetails77.component.html',
  styleUrls: ['./appdetails77.component.scss']
})

export class Appdetails77Component implements OnInit {
  ImageName:string='';
  InFocus:boolean=false;
  environment=environment;
  
  @Input() events: Observable<void>;

  public msrv_StMng:StateManagerService =this.srv_StMng;
  public msrv_appsetting:AppsettingService =this.srv_appsetting;
  public arrdiameter:DiameterHole[]=[];
  public IsLoaded:Boolean=false;
  public SelectedDia:DiameterHole;
  public CostPerHourByRate:number;
  private eventsSubscription: Subscription=new Subscription();

  constructor(private srv_StMng:StateManagerService,private srv_appsetting:AppsettingService,
              private srv_DataLayer:DatalayerService) { }

  ngOnInit() {
    this.SetIPLMandatory();
    if( this.srv_StMng.SecAppSelected.MenuID=='111') 
      this.ImageName= environment.ImageInputPath + this.srv_StMng.SecApp + ".png";
    else
      this.ImageName= environment.ImageInputPath + this.srv_StMng.SecApp + "_1.png";
          
    this.eventsSubscription.add( this.events.subscribe(() => this.ClearData()));
    this.eventsSubscription.add(this.srv_DataLayer.holediameterdrilling(this.srv_appsetting.Units).subscribe((res: any) => {
      this.arrdiameter= JSON.parse(res);    
      this.SelectedDia =  this.arrdiameter.find(v=> v.Description==this.srv_StMng.IPL.GetItem('D_Hole').value)
      this.IsLoaded=true;              
      if(this.srv_StMng.SecAppSelected.MenuID=='111') this.srv_StMng.IPL.GetItem('IsRotating').value='1';
      if(this.srv_StMng.SecAppSelected.MenuID=='112') this.srv_StMng.IPL.GetItem('IsRotating').value='0';  
      if(this.srv_StMng.SecAppSelected.MenuID=='71') this.srv_StMng.IPL.GetItem('IsRotating').value='0';      
      }
      )
    );  
    this.CostPerHourByRate = Math.round(this.msrv_StMng.SelectedMachine.CostPerHour / this.srv_appsetting.CurrRate*100)/100;    
  }
  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }
  
   public onChange(value: any) {
     if(value!==undefined) this.srv_StMng.IPL.GetItem('D_Hole').value=value.Value;    
  }
  
  public ChangeDiameter()
  {
    //alert(this.SelectedDia.Value.toString());
    this.srv_StMng.IPL.GetItem('D_Hole').value=this.SelectedDia.Value.toString(); 
  }

   onfocusfield(field:string)
  {
    this.InFocus=true;
    if(this.srv_StMng.SecAppSelected.MenuID=='111')
      this.ImageName= environment.ImageInputPath + this.srv_StMng.IPL.GetItem(field).image;
    else
      this.ImageName= environment.ImageInputPath + this.srv_StMng.IPL.GetItem(field).image1;
  }

  onfocusoutfield()
  {  
    this.InFocus=false;
    
    if( this.srv_StMng.SecAppSelected.MenuID=='111') 
      this.ImageName= environment.ImageInputPath + this.srv_StMng.SecApp + ".png";
    else
      this.ImageName= environment.ImageInputPath + this.srv_StMng.SecApp + "_1.png";
  }
    
  ClearData()
  {
    this.srv_StMng.IPL.GetItem('D_Hole').value ='';   
    this.srv_StMng.IPL.GetItem('DiameterBoring').value =null;
    this.srv_StMng.IPL.GetItem('Depth').value =null;  
    this.srv_StMng.IPL.GetItem('Clamping').value =this.srv_StMng.IPL.GetItem('Clamping').valuedefault;
    this.srv_StMng.IPL.GetItem('Slope').value =this.srv_StMng.IPL.GetItem('Slope').valuedefault;    
    this.srv_StMng.IPL.GetItem('TypeOfCut').value =this.srv_StMng.IPL.GetItem('TypeOfCut').valuedefault;        
  }
  
  strMandatory:string='';
  SetIPLMandatory()
  {
    this.strMandatory='';
    this.AddTostrMandatoryParam('D_Hole',"DH:",this.srv_appsetting.UnitslengthDesc);
    this.AddTostrMandatoryParam('Depth',"DPT:",this.srv_appsetting.UnitslengthDesc);
    this.AddTostrMandatoryParam('DiameterBoring',"DPH:",this.srv_appsetting.UnitslengthDesc);
    if(this.strMandatory.length>0)
      this.msrv_StMng.IPLMMandatory=this.strMandatory.substring(0,this.strMandatory.length-2);
  }

  AddTostrMandatoryParam(name:string,desc:string,units:string)
  {
    if(this.srv_StMng.IPL.GetItem(name).value!=null && this.srv_StMng.IPL.GetItem(name).value!='')
    this.strMandatory=this.strMandatory +desc + this.srv_StMng.IPL.GetItem(name).value + units + ', ';
    
  }

  SlopeChange(n:number)
  {
    if(n==1) this.msrv_StMng.IPL.GetItem('Slope').value='<=6';
    if(n==2) this.msrv_StMng.IPL.GetItem('Slope').value='>6<=12';
    if(n==3) this.msrv_StMng.IPL.GetItem('Slope').value='>12';
  }
}
