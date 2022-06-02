import { Component, OnInit,Input } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { AppsettingService} from '../../../../../services/appsetting.service';
import { ResultsService} from '../../../../../services/results.service' ;
import { StateManagerService} from '../../../../../services/statemanager.service' ;
import { ResultsStoreService} from '../../../../../services/results-store.service' ;

@Component({
  selector: 'cncprogram',
  templateUrl: './cncprogram.component.html',
  styleUrls: ['./cncprogram.component.scss']
})
export class CncprogramComponent implements OnInit {

  constructor(public srv_appsetting:AppsettingService,private srv_results:ResultsService,
              public srv_StMng:StateManagerService, private srv_ResultsStoreService:ResultsStoreService) { }

  
  
  @Input() viewParamsChanged: any ;
  environment = environment;
  
  ProfileType:string='';
  Pitch_mm:string='';
  Pitch_TPI:string='';

  dia_major:string='';
  dia_minor:string='';

  CuttingSpeed:number;
  SpindleSpeed:number;
  InfeedMethod:string;
  RadialEn:string;  
  Controller:string;
  PassType:string;
  NoOfPasses:number;

  ngOnInit(): void {
   
    this.SpindleSpeed=Number(this.srv_ResultsStoreService.SpindleSpeed) ;
    this.CuttingSpeed=Number(this.srv_ResultsStoreService.CuttingSpeed );
    this.NoOfPasses=this.srv_ResultsStoreService.NoOfPasses ;

    this.InfeedMethod=this.srv_ResultsStoreService.InfeedMethod ;
    this.Controller=this.srv_ResultsStoreService.Controller ;
    this.RadialEn=this.srv_ResultsStoreService.RadialEn ;
    this.dia_minor=this.srv_StMng.IPL.GetItem('WorkpieceDiameterRad').value;  
    this.dia_major=this.srv_StMng.IPL.GetItem('MajorDiameter').value;

    let ar=this.viewParamsChanged.Res[1];
    this.ProfileType=this.CuttingSpeed=ar[6][0].value;  

  }

}
