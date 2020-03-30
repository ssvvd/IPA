import { Component, OnInit,Input } from '@angular/core';
import { InputParameterItem } from 'src/app/models/operational-data/inputparameteritem';
import { InputParameterlist } from 'src/app/models/operational-data/inputparameterlist';
import { StateManagerService} from 'src/app/services/statemanager.service' ;
import { AppsettingService} from 'src/app/services/appsetting.service';
import { environment } from 'src/environments/environment';
import { Observable ,Subscription} from 'rxjs';

@Component({
  selector: 'app-appdetails59',
  templateUrl: './appdetails59.component.html',
  styleUrls: ['./appdetails59.component.scss']
})
export class Appdetails59Component implements OnInit {

  //@Input() Ipl:InputParameterlist;
  ImageName:string='';
  InFocus:boolean=false;
  environment=environment;
  
   @Input() events: Observable<void>;
  private eventsSubscription: Subscription;

  constructor(private srv_StMng:StateManagerService,private srv_appsetting:AppsettingService) { }

  ngOnInit() {  
    this.eventsSubscription = this.events.subscribe(() => this.ClearData());      
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
    this.srv_StMng.IPL.GetItem('DepthOfShoulder_ap').value =null;//this.srv_StMng.IPL.GetItem('DepthOfShoulder_ap').valuedefault;
    this.srv_StMng.IPL.GetItem('WidthOfShoulder_ae').value =null;//this.srv_StMng.IPL.GetItem('WidthOfShoulder_ae').valuedefault;
    this.srv_StMng.IPL.GetItem('LengthOfShoulder_L').value =null;//this.srv_StMng.IPL.GetItem('LengthOfShoulder_L').valuedefault;
    this.srv_StMng.IPL.GetItem('OperationType').value =this.srv_StMng.IPL.GetItem('OperationType').valuedefault;
    this.srv_StMng.IPL.GetItem('OperationType4Solid').value =this.srv_StMng.IPL.GetItem('OperationType4Solid').valuedefault;
    this.srv_StMng.IPL.GetItem('OverHang').value =this.srv_StMng.IPL.GetItem('OverHang').valuedefault;
    this.srv_StMng.IPL.GetItem('Clamping').value =this.srv_StMng.IPL.GetItem('Clamping').valuedefault;
    this.srv_StMng.IPL.GetItem('PartShape').value =this.srv_StMng.IPL.GetItem('PartShape').valuedefault;    
    this.srv_StMng.IPL.GetItem('TypeOfCut').value =this.srv_StMng.IPL.GetItem('TypeOfCut').valuedefault;    
  }
}
