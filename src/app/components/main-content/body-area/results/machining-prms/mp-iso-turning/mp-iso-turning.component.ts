import { Component, OnInit, SimpleChanges, Input } from '@angular/core';
import { StateManagerService} from 'src/app/services/statemanager.service' ;
import { AppsettingService} from 'src/app/services/appsetting.service';
import { ResultsService} from 'src/app/services/results.service' ;
import {clsHelpProp} from 'src/app/models/results/help-prop';
import {clsPropertyValue} from 'src/app/models/results/property-value';
import { environment } from 'src/environments/environment';
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
  selector: 'mp-iso-turning',
  templateUrl: './mp-iso-turning.component.html',
  styleUrls: ['./mp-iso-turning.component.scss']
})
export class MpIsoTurningComponent implements OnInit {

  @Input() selectedRes:clsPropertyValue[][];
  @Input() selectedHelp:clsHelpProp;
  @Input() exportPDF : boolean; 

  catalogNo:string[]=[]

  Di:number
  LP:number
  LR:number
  DPT:number
  Df:number
  LA:number
  KAPR:number
  Vc:string
  fr:number
  ap:number
  NOPP:number 
  MRR:number
  O:number
  AW:number
  P:number
  T:number
  Vf:number
  n:string
  Ft:number
  MCH:number
  B:number
  I:number
  CTF:number;
  CTFFormat:string;
  TLL:number
  TLT:number
  CEDC:number 
  IP:number
  TP:number
  SP:number
  FCE:number 
  SPB:number
  TSC:number
  IPB:number
  TPB:number
  TIC:number
  TTC:number
  TGC:number
  MCB:number
  MTB:string
  TCB:number
resType:string
CPU:number;

environment=environment;
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

    this.resType = this.selectedHelp.itemTypeRes
    if (this.srv_StMng.SecApp=='880')
    this.Di = +this.srv_StMng.IPL.GetItem('WorkpieceDiameterRad').value
    else
    this.Di = +this.srv_StMng.IPL.GetItem('WorkpieceDiameter').value

    if (this.srv_StMng.SecApp=='890' || this.srv_StMng.SecApp=='860' || this.srv_StMng.SecApp=='850')
      this.LP = +this.srv_StMng.IPL.GetItem('GroovePosition').value
    else if (this.srv_StMng.SecApp=='880')
      this.LP = +this.srv_StMng.IPL.GetItem('GroovePositionRad').value

      if (this.srv_StMng.SecApp=='990'){
      this.LR = +this.srv_StMng.IPL.GetItem('DepthAxial').value
      this.Df = this.Di - (2 * this.LR)//Di - 2*LR
      }
    else if ( this.srv_StMng.SecApp=='980'){
      this.LR = +this.srv_StMng.IPL.GetItem('CutLengthRadial').value
      this.Df = this.Di - (2 * this.LR)//Di - 2*LR
    }
    else if (this.srv_StMng.SecApp=='960'){
      this.DPT = +this.srv_StMng.IPL.GetItem('DepthAxial').value
      this.Df = this.Di - (2 * this.DPT)//Di - 2*DPT
    }
      else if (this.srv_StMng.SecApp=='890' || this.srv_StMng.SecApp=='850'){
        this.LR = +this.srv_StMng.IPL.GetItem('DepthAxial').value
        this.Df = this.Di + (2 * this.LR)//Di - 2*LR
        }
      else if (this.srv_StMng.SecApp=='880'){
        this.LR = +this.srv_StMng.IPL.GetItem('CutLengthRadial').value
        this.Df = this.Di + (2 * this.LR)//Di - 2*LR
      }
      else if (this.srv_StMng.SecApp=='860'){
        this.DPT = +this.srv_StMng.IPL.GetItem('DepthAxial').value
        this.Df = this.Di + (2 * this.DPT)//Di - 2*DPT
      }
    if (this.srv_StMng.SecApp=='890' || this.srv_StMng.SecApp=='990' || this.srv_StMng.SecApp=='850')
      this.LA = +this.srv_StMng.IPL.GetItem('CutLengthAxial').value
    else if (this.srv_StMng.SecApp=='980' || this.srv_StMng.SecApp=='880')
      this.LA = +this.srv_StMng.IPL.GetItem('DepthRadial').value

    // this.KAPR = this.selectedHelp.KAPR || 0


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
                this.SP = +(value.split(' ')[0])
                 break;
               }
              }
          }.bind(this));  
          if (pr && pr.property){
          switch (pr.property.Field){
            case 'CuttingSpeed':case 'CuttingSpeedG':{
              this.Vc = value
              break;
            }
            case 'Feed': case'FeedG':{
              this.fr = +value
              break;
            }
            case 'DepthOfCutPerPass':case 'DepthOfCutPerPassG':{
              this.ap = +value
              break;
            }
            case 'NumberOfPassesDepth':case 'NumberOfPassesDepthG':{
              this.NOPP = +value
              break;
            }
            case 'MetalRemovalRate':case 'MetalRemovalRateG':{
              this.MRR= +value
              break;
            }
            case 'PowerConsumption': case 'PowerConsumptionG':{
              this.P = +value
              break;
            }
            case 'RPM': case 'RPMG':{
              this.n = value
              break;
            }
            case 'TotalCuttingTime': case 'TotalCuttingTimeG':{
              this.CTF = +value
              break;
            }
            case 'TotalCuttingTimeFormat': case 'TotalCuttingTimeGFormat':{
              this.CTFFormat = value
              break;
            }
            case 'TCB': {
              this.TCB = +value
              break;
            }
            case 'TGC': {
              this.TGC = +value
              break;
            }
            case 'MCB': {
              this.MCB = +value
              break;
            }
            case 'CPU': {
              this.CPU = +value
              break;
            }
            case 'MTB': {
              this.MTB = value
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
                var roundDigits:number = this.srv_appsetting.Units == 'I' ? 100 : 10
                this.O = Math.round((this.O + +prmLta) * roundDigits)/roundDigits
              }
            })
      
            this.srv_Results.GetRatioLD(pr.value,this.srv_appsetting.Units).subscribe((res: any) => {
              let prmRatioLD:string = JSON.parse(res); 
              if (prmRatioLD != '0'){
                var roundDigits:number = this.srv_appsetting.Units == 'I' ? 1000 : 100;
                if((this.AW + +prmRatioLD)<0.01) roundDigits = 1000;
                if((this.AW + +prmRatioLD)<0.001) roundDigits = 10000;
                this.AW = Math.round((this.AW + +prmRatioLD) * roundDigits)/roundDigits
              }
            })
          }
          }.bind(this));
    
    
    
        }
          
    
    
        }
      }


      this.Vf = Math.round((this.fr * (((+this.n.split('-')[1] || +this.n.split('-')[0]) + +this.n.split('-')[0])/2) || 0) * 100)/100

      let _Mc:number = 0 
      let _Kc:number = 0      
      let kappaLeadAngel:number = 90

      this.MCH = +this.srv_StMng.IPL.GetItem('MachCostPerHour').value
      this.B = +this.srv_StMng.IPL.GetItem('BatchSize').value
      this.I = 1000
      
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

            this.KAPR = kappaLeadAngel

            if (this.srv_StMng.SecApp!='960' && !(this.srv_StMng.SecApp=='860' && this.selectedHelp.itemTypeRes == 'T') ){
            //api/CalcReq/Power/Torque/Turning/StraightEdge/{DD}/{ap}/{f}/{vc}/{Kc}/{Mc}/{rake}/{k}
            let meanVC = (((+this.Vc.split('-')[1] || +this.Vc.split('-')[0]) + +this.Vc.split('-')[0])/2) 
            this.srv_Results.GetTorqueTurning(this.Di,this.ap,this.fr,meanVC,_Kc,_Mc,0,kappaLeadAngel).subscribe((res: any) => {
              var result = res as MPResult;
              this.T = Math.round(result.ResultRowList[1].Value * 100)/100
            })
          
          }

          if (this.srv_StMng.SecApp!='960' && this.srv_StMng.SecApp !='860'  ){
            // CalcReq/F-CuttingForces/Turning/StraightEdge/{ap}/{f}/{Kc}/{Mc}/{rake}/{k}
            this.srv_Results.GetCuttingForcesTurning(this.ap,this.fr,_Kc,_Mc,0,kappaLeadAngel).subscribe((res: any) => {
              var result = res as MPResult;
              this.Ft = Math.round(result.ResultRowList[0].Value * 100)/100
            })
          
          }
    
        
          
          this.CTF =  Math.round(this.casttimeformattonumber(this.CTFFormat)* 100)/100;
          
          this.srv_Results.gettoolliferesults(this.srv_appsetting.Units,this.selectedHelp.SecondaryAppOrig1 || this.srv_StMng.SecApp,Array.from(new Set(this.selectedHelp.Grade)).toString().split(",").join("").trim(),this.srv_StMng.IPL.GetItem('Material').value,this.selectedHelp.itemType.includes('S')? 'S': 'T',this.Vc,this.srv_StMng.SecAppSelected.MainApp, 0).subscribe((res: any) => {
            var result:object[] = JSON.parse(res);
            this.TLL = result[0]['TLL'] || '0'
            this.TLT = result[0]['TLT'] || '0'
            var a:string[] = this.TLT.toString().split(':');
            //var TLTMin:number = +a[0] + (+a[1] / 60)
            var TLTMin:number = +a[0];
            this.FCE = Math.round((TLTMin / this.CTF) * 100)/100
            this.SPB = Math.ceil(this.B / this.FCE)
            this.TSC = Math.round(this.SP * this.SPB * 100)/100
      
            this.IPB = Math.ceil(this.B / (this.FCE * this.CEDC))
            this.TPB = Math.ceil(this.IPB / this.I)
            this.TIC = Math.round(this.IP * this.IPB * 100)/100
            this.TTC = Math.round((this.TP * this.TPB) * 100)/100
            // this.TGC = Math.round((this.TIC + this.TTC) * 100)/100
            // this.MTB = Math.round((this.B * this.CTF) * 100)/100
            // this.MCB = Math.round(((this.MTB / 60) * this.MCH) * 100)/100
            // this.TCB = Math.round((this.TGC + this.MCB) * 100)/100
            // this.CPU = Math.round((this.TCB / this.B) * 100)/100

          })

}      




      })




  }
  reset(){
    this.catalogNo = []
    this.Di = 0
    this.LP = 0
    this.LR = 0
    this.DPT = 0
    this.Df = 0
    this.LA = 0
    this.KAPR = 0
    this.Vc = ''
    this.fr = 0
    this.ap = 0
    this.NOPP = 0
    this.MRR = 0
    this.O = 0
    this.AW = 0
    this.P = 0
    this.T = 0
    this.Vf = 0
    this.n = ''
    this.Ft = 0
    this.MCH = 0
    this.B =0
    this.I = 0
    this.CTF	=	0;
    this.CTFFormat	=	'';
    this.TLL	=	0
    this.TLT	=	0
    this.CEDC = 0
    this.IP = 0
    this.TP = 0
    this.SP = 0
    this.FCE = 0
    this.SPB = 0
    this.TSC = 0
    this.IPB = 0
    this.TPB = 0
    this.TIC = 0
    this.TTC = 0
    this.TGC = 0
    this.MCB = 0
    this.MTB = ''
    this.TCB = 0
this.resType = ''
this.CPU = 0
  }

  casttimeformattonumber(t:string):number
  {
    if(t=='0' || t==undefined) return 0;
    let tn:number=0;
    let arr;
    arr=t.split(':');
    tn= +arr[0]+ (arr[1]/60);    
    return tn;
  }
}
