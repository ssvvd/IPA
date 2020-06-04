import { Component, OnInit,Input } from '@angular/core';
import { StateManagerService} from 'src/app/services/statemanager.service' ;
import { AppsettingService} from 'src/app/services/appsetting.service';
import { DatalayerService} from 'src/app/services/datalayer.service' ;
import { environment } from 'src/environments/environment';
import { Observable, Subject,Subscription } from 'rxjs';

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
  private eventsSubscription: Subscription=new Subscription();

  constructor(private srv_StMng:StateManagerService,private srv_appsetting:AppsettingService,
              private srv_DataLayer:DatalayerService) { }

  ngOnInit() {
    this.eventsSubscription.add( this.events.subscribe(() => this.ClearData()));
    this.eventsSubscription.add(this.srv_DataLayer.holediameterdrilling(this.srv_appsetting.Units).subscribe((res: any) => {
      this.arrdiameter= JSON.parse(res);    
      this.SelectedDia =  this.arrdiameter.find(v=> v.Description==this.srv_StMng.IPL.GetItem('D_Hole').value)
      this.IsLoaded=true;              
      if(this.srv_StMng.SecAppSelected.MenuID=='111') this.srv_StMng.IPL.GetItem('IsRotating').value='0';
      if(this.srv_StMng.SecAppSelected.MenuID=='112') this.srv_StMng.IPL.GetItem('IsRotating').value='1';  
      if(this.srv_StMng.SecAppSelected.MenuID=='71') this.srv_StMng.IPL.GetItem('IsRotating').value='1';      
      }
      )
    );   
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
    this.ImageName="";   
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

}
