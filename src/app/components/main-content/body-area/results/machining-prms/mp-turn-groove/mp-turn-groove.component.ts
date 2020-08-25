import { Component, OnInit, SimpleChanges, Input } from '@angular/core';
import { StateManagerService} from 'src/app/services/statemanager.service' ;
import { AppsettingService} from 'src/app/services/appsetting.service';
import { ResultsService} from 'src/app/services/results.service' ;
import {clsHelpProp} from 'src/app/models/results/help-prop';
import {clsPropertyValue} from 'src/app/models/results/property-value';

class ResRow {
  Name: string;
  Value: number;
  Unit: string;
}

export class MPResult {
  ResultRowList: Array<ResRow>;
  Status: boolean;
  ErrorDescription: string;
  route: string;
}

@Component({
  selector: 'mp-turn-groove',
  templateUrl: './mp-turn-groove.component.html',
  styleUrls: ['./mp-turn-groove.component.scss']
})
export class MpTurnGrooveComponent implements OnInit {

  @Input() selectedRes:clsPropertyValue[][];
  @Input() selectedHelp:clsHelpProp;

  catalogNo:string[]=[]
  OD:number
  ID:number
  DWI:number
  LP:number
  DPT:number
  DWF:number
  D:number
  DOD:number

  constructor(public srv_StMng:StateManagerService,public srv_appsetting:AppsettingService,private srv_Results:ResultsService) { }

  ngOnInit(): void {
  }

    
  ngOnChanges(changes:SimpleChanges) {

    if (this.selectedRes && changes.selectedRes){
      this.fillParams()
    }
  }

  fillParams(){
    this.reset()

    this.OD = this.D = this.DWI = +this.srv_StMng.IPL.GetItem('WorkpieceDiameter').value
    this.ID = +this.srv_StMng.IPL.GetItem('DiameterBoring').value
    this.LP = +this.srv_StMng.IPL.GetItem('GroovePosition').value
    this.DPT = this.DOD = +this.srv_StMng.IPL.GetItem('Depth').value

    if (this.srv_StMng.SecApp=='52' || this.srv_StMng.SecApp=='1')
      this.DWF = this.DWI - 2 * this.DPT
    if (this.srv_StMng.SecApp=='53' || this.srv_StMng.SecApp=='50')
      this.DWF = this.DWI + 2 * this.DPT

    

  }

  reset(){
    this.catalogNo = []
    this.OD = 0
    this.ID = 0
    this.DWI = 0
    this.LP = 0
    this.DPT = 0
    this.DWF =0
    this.D = 0
    this.DOD = 0
  }

}
