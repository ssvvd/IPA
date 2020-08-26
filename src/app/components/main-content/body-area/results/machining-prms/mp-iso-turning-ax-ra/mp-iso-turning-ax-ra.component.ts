import { Component, OnInit, SimpleChanges, Input } from '@angular/core';
import { StateManagerService} from 'src/app/services/statemanager.service' ;
import { AppsettingService} from 'src/app/services/appsetting.service';
import { ResultsService} from 'src/app/services/results.service' ;
import {clsHelpProp} from 'src/app/models/results/help-prop';
import {clsPropertyValue} from 'src/app/models/results/property-value';
import { throws } from 'assert';

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
  selector: 'mp-iso-turning-ax-ra',
  templateUrl: './mp-iso-turning-ax-ra.component.html',
  styleUrls: ['./mp-iso-turning-ax-ra.component.scss']
})
export class MpIsoTurningAxRaComponent implements OnInit {

  @Input() selectedRes:clsPropertyValue[][];
  @Input() selectedHelp:clsHelpProp;

  catalogNo:string[]=[]

  Di	:number
  LP1	:number
  LA1	:number
  LR1	:number
  Df1	:number
  Vc	:number
  fr	:number
  ap	:number
  NOPP	:number
  MRR	:number
  Di2	:number
  LP2	:number
  LA2	:number
  LR2	:number
  Df2	:number
  Vc2	:number
  fr2	:number
  ap2	:number
  NOPP2	:number
  MRR2	:number
  O	:number
  AW	:number
  P	:number
  T	:number
  Vf	:number
  n	:string
  Ft	:number
  P2	:number
  T2	:number
  Vf2	:number
  n2	:string
  Ft2	:number
  MCH	:number
  B	:number
  CTFa	:number
  CTFr	:number
  TLL	:number
  TLT	:number
  CEDC	:number
  IP	:number
  TP	:number
  PCE	:number
  IPB	:number
  TPB	:number
  TIC	:number
  TTC	:number
  TGC	:number
  MCB	:number
  MTB	:number
  TCB	:number
  I:number
CTP:number
CPU:number

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

    this.Di = +this.srv_StMng.IPL.GetItem('WorkpieceDiameter').value
    this.LA1 = +this.srv_StMng.IPL.GetItem('CutLengthAxial').value
    this.LA2 = +this.srv_StMng.IPL.GetItem('DepthRadial').value
    this.LR1 = +this.srv_StMng.IPL.GetItem('DepthAxial').value
    this.LR2 = +this.srv_StMng.IPL.GetItem('CutLengthRadial').value
    this.LP1 = +this.srv_StMng.IPL.GetItem('GroovePosition').value
    this.Di2 = +this.srv_StMng.IPL.GetItem('WorkpieceDiameterRad').value
    this.LP2 = +this.srv_StMng.IPL.GetItem('GroovePositionRad').value

    
    if (this.srv_StMng.SecApp=='870'){
      this.Df1 = this.Di + (2 * this.LR1)
      this.Df2 = this.Di2 + (2 * this.LR2)
    }  
    else
    {
      this.Df1 = this.Di - (2 * this.LR1)
      this.Df2 = this.Di - (2 * this.LR2)
    }
    

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
             break;
           }
           case 'CuttingSpeed':{
            this.Vc = +value
            this.Vc2 = +value
            break;
          }
          case 'CuttingSpeedG':{
            this.Vc2 = +value
            break;
          }
          case 'Feed':{
            this.fr = +value
            this.fr2 = +value
            break;
          }
          case'FeedG':{
            this.fr2 = +value
            break;
          }
          case 'DepthOfCutPerPass':{
            this.ap = +value
            this.ap2 = +value
            break;
          }
          case 'DepthOfCutPerPassG':{
            this.ap2 = +value
            break;
          }
          case 'NumberOfPassesDepth':{
            this.NOPP = +value
            this.NOPP2 = +value
            break;
          }
          case 'NumberOfPassesDepthG':{
            this.NOPP2 = +value
            break;
          }
          case 'MetalRemovalRate':{
            this.MRR= +value
            this.MRR2= +value
            break;
          }
          case 'MetalRemovalRateG':{
            this.MRR2= +value
            break;
          }
          case 'PowerConsumption':{
            this.P = +value
            this.P2 = +value
            break;
          }
          case 'PowerConsumptionG':{
            this.P2 = +value
            break;
          }
          case 'RPM':{
            this.n = value
            this.n2 = value
            break;
          }
          case 'RPMG':{
            this.n2 = value
            break;
          }
          case 'TotalCuttingTime':{
            this.CTFa = +value
            this.CTFr = +value
            break;
          }
          case 'TotalCuttingTimeG':{
            this.CTFr = +value
            break;
          }
          }
      }.bind(this));  
      if (pr && pr.property){
      // switch (pr.property.Field){

      // }

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

  this.Vf = Math.round((this.fr * (((+this.n.split('-')[1] || +this.n.split('-')[0]) + +this.n.split('-')[0])/2) || 0) * 100)/100
  this.Vf2 = Math.round((this.fr2 * (((+this.n2.split('-')[1] || +this.n2.split('-')[0]) + +this.n2.split('-')[0])/2) || 0) * 100)/100



  let _Mc:number = 0 
  let _Kc:number = 0      
  let kappaLeadAngel:number = 90

  // (material:number,  Units:number,  KappaLeadAngle:number,  Flutes:number,  Feed:number,  catalogNoList:String)
  this.srv_Results.GetMPowerParamsTurning(+this.srv_StMng.IPL.GetItem('Material').value,this.srv_appsetting.Units,
  +this.fr,this.catalogNo.toString()).subscribe((res: any) => {
    let paramsValues:string = JSON.parse(res); 
    var splitted = paramsValues.split(","); 
      if (splitted.length == 4){
        _Mc = +splitted[0]
        _Kc = +splitted[1]
        kappaLeadAngel = +splitted[2]
        this.CEDC = +splitted[3]


        //api/CalcReq/Power/Torque/Turning/StraightEdge/{DD}/{ap}/{f}/{vc}/{Kc}/{Mc}/{rake}/{k}
        this.srv_Results.GetTorqueTurning(this.Di,this.ap,this.fr,this.Vc,_Kc,_Mc,0,kappaLeadAngel).subscribe((res: any) => {
          var result = res as MPResult;
          this.T = Math.round(result.ResultRowList[1].Value * 100)/100
        })
      
      


        // CalcReq/F-CuttingForces/Turning/StraightEdge/{ap}/{f}/{Kc}/{Mc}/{rake}/{k}
        this.srv_Results.GetCuttingForcesTurning(this.ap,this.fr,_Kc,_Mc,0,kappaLeadAngel).subscribe((res: any) => {
          var result = res as MPResult;
          this.Ft = Math.round(result.ResultRowList[0].Value * 100)/100
        })
      
      

      this.MCH = +this.srv_StMng.IPL.GetItem('MachCostPerHour').value
      this.B = 100
      this.I = 1000
      this.TLL = 50
      this.TLT = 50
      this.CTP = this.CTFa + this.CTFr
      this.PCE = Math.round((this.TLT / this.CTP) * 100)/100
      this.IPB = Math.ceil(this.B / (this.PCE * this.CEDC))
      this.TPB = Math.ceil(this.IPB / this.I)
      this.TIC = Math.round(this.IP * this.IPB * 100)/100
      this.TTC = this.TP * this.TPB
      this.TGC = this.TIC + this.TTC
      this.MTB = Math.round((this.B * this.CTP) * 100)/100
      this.MCB = Math.round(((this.MTB / 60) * this.MCH) * 10000)/10000
      this.TCB = Math.round((this.TGC + this.MCB) * 100)/100
      this.CPU = Math.round((this.TCB / this.B) * 100)/100

}      




  })


  let _Mc2:number = 0 
  let _Kc2:number = 0      
  let kappaLeadAngel2:number = 90

  // (material:number,  Units:number,  KappaLeadAngle:number,  Flutes:number,  Feed:number,  catalogNoList:String)
  this.srv_Results.GetMPowerParamsTurning(+this.srv_StMng.IPL.GetItem('Material').value,this.srv_appsetting.Units,
  +this.fr2,this.catalogNo.toString()).subscribe((res: any) => {
    let paramsValues:string = JSON.parse(res); 
    var splitted = paramsValues.split(","); 
      if (splitted.length == 4){
        _Mc2 = +splitted[0]
        _Kc2 = +splitted[1]
        kappaLeadAngel2 = +splitted[2]
        this.CEDC = +splitted[3]


        //api/CalcReq/Power/Torque/Turning/StraightEdge/{DD}/{ap}/{f}/{vc}/{Kc}/{Mc}/{rake}/{k}
        let DiSelected:number = 0
        if (this.srv_StMng.SecApp=='870'){
          DiSelected = this.Di2
        }  
        else
        {
          DiSelected =this.Di 
        }
        this.srv_Results.GetTorqueTurning(DiSelected,this.ap2,this.fr2,this.Vc2,_Kc2,_Mc2,0,kappaLeadAngel2).subscribe((res: any) => {
          var result = res as MPResult;
          this.T2 = Math.round(result.ResultRowList[1].Value * 100)/100
        })
      
      


        // CalcReq/F-CuttingForces/Turning/StraightEdge/{ap}/{f}/{Kc}/{Mc}/{rake}/{k}
        this.srv_Results.GetCuttingForcesTurning(this.ap2,this.fr2,_Kc2,_Mc2,0,kappaLeadAngel2).subscribe((res: any) => {
          var result = res as MPResult;
          this.Ft2 = Math.round(result.ResultRowList[0].Value * 100)/100
        })


}      




  })













  }

  reset(){
    this.catalogNo = []

this.Di  	=	0
this.LP1 	=	0
this.LA1 	=	0
this.LR1 	=	0
this.Df1 	=	0
this.Vc  	=	0
this.fr  	=	0
this.ap  	=	0
this.NOPP  	=	0
this.MRR 	=	0
this.Di2 	=	0
this.LP2 	=	0
this.LA2 	=	0
this.LR2 	=	0
this.Df2 	=	0
this.Vc2 	=	0
this.fr2 	=	0
this.ap2 	=	0
this.NOPP2 	=	0
this.MRR2  	=	0
this.O 	=	0
this.AW  	=	0
this.P 	=	0
this.T 	=	0
this.Vf  	=	0
this.n 	=	''
this.Ft  	=	0
this.P2  	=	0
this.T2  	=	0
this.Vf2 	=	0
this.n2  	=	''
this.Ft2 	=	0
this.MCH 	=	0
this.B 	=	0
this.CTFa  	=	0
this.CTFr  	=	0
this.TLL 	=	0
this.TLT 	=	0
this.CEDC  	=	0
this.IP  	=	0
this.TP  	=	0
this.PCE 	=	0
this.IPB 	=	0
this.TPB 	=	0
this.TIC 	=	0
this.TTC 	=	0
this.TGC 	=	0
this.MCB 	=	0
this.MTB 	=	0
this.TCB 	=	0
this.I	=	0
this.CTP = 0
this.CPU = 0
  }
}
