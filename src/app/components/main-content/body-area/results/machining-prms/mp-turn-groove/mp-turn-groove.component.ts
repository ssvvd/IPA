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
  W:number
  W1:string
  DPT1:number
  CW:number
  Vc:string
  fr:number
  NOP:number
  MRR:number
  Vc1:string
  fr1:number
  NOP1:number
  MRR1:number
  O:number
  AW:number
  P:string
  T:number
  n:string
  Ft:number
  P1:string
  T1:number
  n1:string
  Ft1:number
  MCH:number
  B:number
  CTFg:number
  CTFt:number
  CTP:number
  CTF:number
  TLL:number
  TLT:number
  CEDC:number
  IP:number
  TP:number
  FCE:number
  PCE:number
  IPB:number
  TPB:number
  TIC:number
  TTC:number
  TGC:number
  MCB:number
  MTB:number
  TCB:number
  CPU:number
  I:number

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
    this.DPT = this.DOD = this.DPT1 = +this.srv_StMng.IPL.GetItem('Depth').value

    if (this.srv_StMng.SecApp=='52' || this.srv_StMng.SecApp=='1')
      this.DWF = this.DWI - 2 * this.DPT
    if (this.srv_StMng.SecApp=='53' || this.srv_StMng.SecApp=='50')
      this.DWF = this.DWI + 2 * this.DPT

    this.W = +this.srv_StMng.IPL.GetItem('Width').value

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
                     this.IP = +(value.split(' ')[0])
                     break;
                   }
                   case 'HeaderListPrice':case 'HeaderListPrice1':case 'HeaderListPrice2':{
                     this.TP = +(value.split(' ')[0])
                    // this.SP = +(value.split(' ')[0])
                     break;
                   }
                   case 'WInsert':{
                    if (this.CW == 0)
                    this.CW = +value
                    break;
                  }
                  case 'WInsert1':{
                    if (this.CW == 0)
                    this.CW = +value
                    break;
                  }
                  case 'WInsert2':{
                    if (this.CW == 0)
                    this.CW = +value
                    break;
                  }
                   case 'DetailsWInsert':{
                    this.CW = +value
                    break;
                  }
                  case 'TotalCuttingTime': {
                    this.CTFt = +value
                    break;
                  }
                  case 'TotalCuttingTimeG':{
                    this.CTF = +value
                    this.CTFg = +value
                    this.CTFt = +value
                    break;
                  }
                  case 'CuttingSpeed':{
                    this.Vc1 = value
                    break;
                  }
                  case 'CuttingSpeedG':{
                    this.Vc = value
                    this.Vc1 = value
                    break;
                  }
                  case 'Feed':{
                    this.fr1 = +value
                    break;
                  }
                  case'FeedG':{
                    this.fr = +value
                    this.fr1 = +value
                    break;
                  }
                  case 'DepthOfCutPerPassG':{
                    this.W1 = value
                    break;
                  }
                  case 'NumberOfPassesDepth':{
                    this.NOP1 = +value
                    break;
                  }
                  case 'NumberOfPassesDepthG':{
                    this.NOP = +value
                    this.NOP1 = +value
                    break;
                  }
                  case 'MetalRemovalRateG':{
                    this.MRR= +value
                    this.MRR1= +value
                    break;
                  }
                  case 'MetalRemovalRate':{
                    this.MRR1= +value
                    break;
                  }
                  case 'PowerConsumption': {
                    this.P1 = value
                    break;
                  }
                  case 'PowerConsumptionG':{
                    this.P = value
                    this.P1 = value
                    break;
                  }
                  case 'RPM':{
                    this.n1 = value
                    break;
                  }
                  case 'RPMG':{
                    this.n = value
                    this.n1 = value
                    break;
                  }
                  }
              }.bind(this));  
              if (pr && pr.property){
              switch (pr.property.Field){
                case 'NoOfCorners':{
                  this.CEDC = +value
                  break;
                }
              }
        
            if (pr.property.Field.toLowerCase().includes('catalogno')){
        
              this.selectedRes[i].forEach(function (value) {
                pr = value
        if (pr.value.trim().length == 7){
                this.catalogNo.push(pr.value.trim());
    
                this.srv_Results.GetItemParameterValueSpecial(pr.value.trim(),'774',this.srv_appsetting.Units).subscribe((res: any) => {
                  let prmLta:string = JSON.parse(res); 
                  if (prmLta != '9999'){
                    this.O = Math.round((this.O + +prmLta) * 100)/100
                  }
                })
          
                this.srv_Results.GetRatioLD(pr.value,this.srv_appsetting.Units).subscribe((res: any) => {
                  let prmRatioLD:string = JSON.parse(res); 
                  if (prmRatioLD != '0'){
                    this.AW = Math.round((this.AW + +prmRatioLD) * 100000)/100000
                  }
                })
    
    
              }
              }.bind(this));
        
        
        
            }
              
        
        
            }
          }

          let _Mc:number = 0 
          let _Kc:number = 0  
          let _KcG:number = 0  

          this.srv_Results.GetMPowerParamsGrooving(+this.srv_StMng.IPL.GetItem('Material').value,this.srv_appsetting.Units,
          +this.fr1,+this.fr,this.catalogNo.toString()).subscribe((res: any) => {
            let paramsValues:string = JSON.parse(res); 
            var splitted = paramsValues.split(","); 
              if (splitted.length == 3){
                _Mc = +splitted[0]
                _Kc = +splitted[1]
                _KcG = +splitted[2]


                //GET api/CalcReq/Power/Torque/GroovingPartingOff/StraightEdge/{DD}/{w}/{f}/{vc}/{Kc}/{Mc}/{rake}/{k}
                let vcAvg = (((+this.Vc.split('-')[1] || +this.Vc.split('-')[0]) + +this.Vc.split('-')[0])/2) || 0
                this.srv_Results.GetTorqueGrooving(this.OD,this.CW,this.fr,vcAvg,_KcG,_Mc,0,0).subscribe((res: any) => {
                  var result = res as MPResult;
                  this.T = Math.round(result.ResultRowList[1].Value * 100)/100
                })
              

  
                //GET api/CalcReq/F-CuttingForces/Grooving/StraightEdge/{w}/{f}/{Kc}/{Mc}/{rake}/{k}
                this.srv_Results.GetCuttingForcesGrooving(this.CW,this.fr,_KcG,_Mc,0,0).subscribe((res: any) => {
                  var result = res as MPResult;
                  this.Ft = Math.round(result.ResultRowList[0].Value * 100)/100
                })
              
                //GET api/CalcReq/Power/Torque/GroovingPartingOff/StraightEdge/{DD}/{w}/{f}/{vc}/{Kc}/{Mc}/{rake}/{k}
                let vcAvg1 = (((+this.Vc1.split('-')[1] || +this.Vc1.split('-')[0]) + +this.Vc1.split('-')[0])/2) || 0
                this.srv_Results.GetTorqueGrooving(this.OD,this.CW,this.fr1,vcAvg1,_Kc,_Mc,0,0).subscribe((res: any) => {
                  var result = res as MPResult;
                  this.T1 = Math.round(result.ResultRowList[1].Value * 100)/100
                })



                //GET api/CalcReq/F-CuttingForces/Grooving/StraightEdge/{w}/{f}/{Kc}/{Mc}/{rake}/{k}
                this.srv_Results.GetCuttingForcesGrooving(this.CW,this.fr1,_Kc,_Mc,0,0).subscribe((res: any) => {
                  var result = res as MPResult;
                  this.Ft1 = Math.round(result.ResultRowList[0].Value * 100)/100
                })
    
              this.MCH = +this.srv_StMng.IPL.GetItem('MachCostPerHour').value
              this.B = this.srv_StMng.IPL.GetItem('BatchSize').value
              this.I = 1000
              this.CTP = Math.round((this.CTFg + this.CTFt) * 100)/100
              this.TLL = 50
              this.TLT = 50
              this.FCE = Math.round((this.TLT / this.CTF) * 100)/100
              this.PCE = Math.round((this.TLT / this.CTP) * 100)/100
              if (this.srv_StMng.SecApp=='1' || this.srv_StMng.SecApp=='10' || this.srv_StMng.SecApp=='50'){
                this.IPB = Math.ceil( this.B  / ( this.CEDC * this.PCE ))
              }            
              else{
                this.IPB = Math.ceil( this.B  / ( this.CEDC * this.FCE ))
              }
              this.TPB = Math.ceil( this.IPB / this.I )
              this.TIC = Math.round((this.IP * this.IPB) * 100)/100
              this.TTC = Math.round((this.TP * this.TPB) * 100)/100
              this.TGC = Math.round((this.TIC + this.TTC) * 100)/100
              this.MTB = Math.round((this.B * this.CTP)  * 100)/100
              this.MCB = Math.round((this.MTB / 60 * this.MCH) * 100)/100
              this.TCB = Math.round((this.TGC + this.MCB) * 100)/100
              this.CPU = Math.round((this.TCB / this.B) * 100)/100
    
    }      
    
    
    
    
          })

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
    this.W = 0
    this.W1 = ''
    this.DPT1 = 0
    this.CW = 0
    this.Vc = ''
    this.fr = 0
    this.NOP = 0
    this.MRR = 0
    this.Vc1 = ''
    this.fr1 = 0.2
    this.NOP1 = 0
    this.MRR1 = 0
    this.O = 0
    this.AW = 0
    this.P = ''
    this.T = 0
    this.n = ''
    this.Ft = 0
    this.P1 = ''
    this.T1 = 0
    this.n1 = ''
    this.Ft1 = 0
    this.MCH = 0
    this.B = 0
    this.CTFg = 0
    this.CTFt = 0
    this.CTP = 0
    this.CTF = 0
    this.TLL = 0
    this.TLT = 0
    this.CEDC = 0
    this.IP = 0
    this.TP = 0
    this.FCE = 0
    this.PCE = 0
    this.IPB = 0
    this.TPB = 0
    this.TIC = 0
    this.TTC = 0
    this.TGC = 0
    this.MCB = 0
    this.MTB = 0
    this.TCB = 0
    this.CPU = 0
    this.I = 0
  }

}
