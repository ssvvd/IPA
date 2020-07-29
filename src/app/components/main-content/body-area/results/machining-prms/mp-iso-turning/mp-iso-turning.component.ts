import { Component, OnInit, SimpleChanges, Input } from '@angular/core';
import { StateManagerService} from 'src/app/services/statemanager.service' ;
import { AppsettingService} from 'src/app/services/appsetting.service';
import { ResultsService} from 'src/app/services/results.service' ;
import {clsHelpProp} from 'src/app/models/results/help-prop';
import {clsPropertyValue} from 'src/app/models/results/property-value';
import { throws } from 'assert';

@Component({
  selector: 'mp-iso-turning',
  templateUrl: './mp-iso-turning.component.html',
  styleUrls: ['./mp-iso-turning.component.scss']
})
export class MpIsoTurningComponent implements OnInit {

  @Input() selectedRes:clsPropertyValue[][];
  @Input() selectedHelp:clsHelpProp;

  Di:number
  LP:number
  LR:number
  DPT:number
  Df:number
  LA:number
  KAPR:number
  Vc:number
  fr:number
  ap:number
  NOPP:number 
  MRR:number

  constructor(public srv_StMng:StateManagerService,public srv_appsetting:AppsettingService) { }

  ngOnInit(): void {
  }



  
  ngOnChanges(changes:SimpleChanges) {

    if (this.selectedRes && changes.selectedRes){
      this.fillParams()
    }
  }

  
  fillParams(){
    this.reset()

    this.Di = +this.srv_StMng.IPL.GetItem('WorkpieceDiameter').value

    if (this.srv_StMng.SecApp=='890' || this.srv_StMng.SecApp=='860' || this.srv_StMng.SecApp=='850')
      this.LP = +this.srv_StMng.IPL.GetItem('GroovePosition').value
    else if (this.srv_StMng.SecApp=='880')
      this.LP = +this.srv_StMng.IPL.GetItem('GroovePositionRad').value

      if (this.srv_StMng.SecApp=='890' || this.srv_StMng.SecApp=='850' || this.srv_StMng.SecApp=='990'){
      this.LR = +this.srv_StMng.IPL.GetItem('DepthAxial').value
      this.Df = this.Di - (2 * this.LR)//Di - 2*LR
      }
    else if (this.srv_StMng.SecApp=='880'  || this.srv_StMng.SecApp=='980'){
      this.LR = +this.srv_StMng.IPL.GetItem('CutLengthRadial').value
      this.Df = this.Di - (2 * this.LR)//Di - 2*LR
    }
    else if (this.srv_StMng.SecApp=='860'  || this.srv_StMng.SecApp=='960'){
      this.DPT = +this.srv_StMng.IPL.GetItem('DepthAxial').value
      this.Df = this.Di - (2 * this.DPT)//Di - 2*DPT
    }
      
    if (this.srv_StMng.SecApp=='980' || this.srv_StMng.SecApp=='890' || this.srv_StMng.SecApp=='990' || this.srv_StMng.SecApp=='850')
      this.LA = +this.srv_StMng.IPL.GetItem('CutLengthAxial').value
    else if (this.srv_StMng.SecApp=='880')
      this.LA = +this.srv_StMng.IPL.GetItem('DepthRadial').value

    this.KAPR = this.selectedHelp.KAPR || 0


        //output
        for(var i = 0; this.selectedRes && i < this.selectedRes.length; i++) {
          var pr:clsPropertyValue = this.selectedRes[i][0];
          var value:string = '0'
          this.selectedRes[i].forEach(function (v) {
            if (v.value != '' && v.value != '0')
              value = v.value
              if (v.property)
              switch (v.property.Field){
              case 'DetailsListPrice':{

                 break;
               }
               case 'HeaderListPrice':{

                 break;
               }
              }
          }.bind(this));  
          if (pr && pr.property){
          switch (pr.property.Field){
            case 'CuttingSpeed':{
              this.Vc = +value
              break;
            }
            case 'Feed':{
              this.fr = +value
              break;
            }
            case 'DepthOfCutPerPass':{
              this.ap = +value
              break;
            }
            case 'NumberOfPassesDepth':{
              this.NOPP = +value
              break;
            }
            case 'MetalRemovalRate':{
              this.MRR= +value
              break;
            }
          }
    
        if (pr.property.Field.toLowerCase().includes('catalogno')){
    
          this.selectedRes[i].forEach(function (value) {
            pr = value
    if (pr.value.trim().length == 7){
    
    
            this.catalogNo.push(pr.value.trim());


          }
          }.bind(this));
    
    
    
        }
          
    
    
        }
      }


  }
  reset(){
    this.Di = 0
    this.LP = 0
    this.LR = 0
    this.DPT = 0
    this.Df = 0
    this.LA = 0
    this.KAPR = 0
    this.Vc = 0
    this.fr = 0
    this.ap = 0
    this.NOPP = 0
    this.MRR = 0
  }

}
