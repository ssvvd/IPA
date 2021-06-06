import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import {clsPropertyValue} from 'src/app/models/results/property-value';
import {clsHelpProp} from 'src/app/models/results/help-prop';
import { environment } from 'src/environments/environment';
import { StateManagerService} from 'src/app/services/statemanager.service' ;
import { AppsettingService} from 'src/app/services/appsetting.service';

@Component({
  selector: 'machining-prms',
  templateUrl: './machining-prms.component.html',
  styleUrls: ['./machining-prms.component.scss']
})
export class MachiningPrmsComponent implements OnInit {

  @Input() viewParamsChangedMP: any ;
  @Input() exportPDF:boolean=false;
  
  selectedOptionMP:clsPropertyValue[][];
  selectedOptionMPHelp:clsHelpProp;
  environment = environment;
 ;
  constructor(public srv_StMng:StateManagerService,public srv_appsetting:AppsettingService) { }

  ngOnInit(): void {

  }

  ngOnChanges(changes:SimpleChanges) {

    if (this.viewParamsChangedMP && changes.viewParamsChangedMP){
      this.selectedOptionMP = this.viewParamsChangedMP.Res[1]
      this.selectedOptionMPHelp = this.viewParamsChangedMP.Res[0]
    }
    
  }

  getPropWithoutUnits(pr:string){
    let indexOfU:number = pr.lastIndexOf(' (')
    if (indexOfU != -1){
      return pr.substring(0,indexOfU)
    }
    else{
      return pr;
    }

  }

  getUnitsFromProp(pr:string){
    let indexOfU:number = pr.lastIndexOf(' (')
    if (indexOfU != -1){
      return pr.substring(indexOfU + 2,pr.length - 1)
    }
    else{
      return '';
    }
  }

}
