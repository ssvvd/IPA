import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import {clsPropertyValue} from 'src/app/models/results/property-value';
import { StateManagerService} from 'src/app/services/statemanager.service' ;
import { AppsettingService} from 'src/app/services/appsetting.service';
import { ResultsService} from 'src/app/services/results.service' ;
import {clsHelpProp} from 'src/app/models/results/help-prop';
import { environment } from 'src/environments/environment';

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
  selector: 'mp760',
  templateUrl: './mp760.component.html',
  styleUrls: ['./mp760.component.scss']
})
export class Mp760Component implements OnInit {

  @Input() selectedRes:clsPropertyValue[][];
  @Input() selectedHelp:clsHelpProp;
  @Input() exportPDF : boolean; 
 
  DC:string
  DPH:number
  DH:string
  D:number
  W:number
  L:number
  CR:number
  Vc:string
  fz:string
  ap:string
  NOPP:string
  ae:string
  NOPE:string
  hm:number
  MCT:number
  MRR:string
  MRR1:string
  MRR2:string
  O:number
  AW:number
  P:number
  T:number
  Vf:number
  n:number
  Fb:number
  mb:number
  MCH:number
  B:number
  CTF:number
  CTFFormat:string;
  TLL:number
  TLT:number
  NOF:number
  THe_CICT:number
  THe_CEDC:number
  THe_IP:number
  T_TP:number
  He_HP:number
  S_SP:number
  H_SHP:number
  H_SKP:number
  He_HHP:number
  FCE:number
  THe_IPB:number
  T_TPB:number
  He_TPB:number
  He_THH:number
  THe_TIC:number
  T_TTC:number
  He_THSC:number
  H_SHB:number
  H_SKB:number
  H_TSHC:number
  H_TSKC:number
  T_TGC:number
  He_TGC:number
  H_TGC:number
  TGC:number
  S_SPB:number
  S_TSC:number
  MCB:number
  MTB:string
  TCB:number
  THeH_I:number
  He_Is:number
  COOL:string
  PreHole:boolean
  Dvf:number
  RMPX:number
  PITCH:number
  VfDvf:number
  CPU:number
  // Flutes:number
  catalogNo:string[]=[]
  resType:string = ''

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

if (this.srv_StMng.SecApp=='780' && this.srv_StMng.IPL.GetItem('HoleTypePreHole').value!='')
    this.PreHole = true
if (this.srv_StMng.SecApp=='790' && this.srv_StMng.IPL.GetItem('HoleTypePreHole').value=='PreHole')
    this.PreHole = true

    // if (this.srv_StMng.SecApp=='780')
    // if (this.PreHole)
    //   this.DH = +this.srv_StMng.IPL.GetItem('D2').value
    // else
    //   this.DH = +this.srv_StMng.IPL.GetItem('D2Min').value

    this.CR = +this.srv_StMng.IPL.GetItem('RToleranceMin').value
    if (this.srv_StMng.SecApp=='780')
    this.D = +this.srv_StMng.IPL.GetItem('Depth').value
    else
    this.D = +this.srv_StMng.IPL.GetItem('DepthOfShoulder_ap').value
    this.DPH = +this.srv_StMng.IPL.GetItem('D3').value
    this.W = +this.srv_StMng.IPL.GetItem('WidthOfShoulder_ae').value
    this.L = +this.srv_StMng.IPL.GetItem('LengthOfShoulder_L').value
    this.MCH = +this.srv_StMng.IPL.GetItem('MachCostPerHour').value

    //output
    for(var i = 0; this.selectedRes && i < this.selectedRes.length; i++) {
      var pr:clsPropertyValue = this.selectedRes[i][0];
      var value:string = '0'

      this.selectedRes[i].forEach(function (v) {
        if (v.value != '' && v.value != '0'){
          value = v.value
          if (v.property)
          switch (v.property.Field){
          case 'DetailsListPrice':{
            this.H_SHP = +(value.split(' ')[0])
             this.THe_IP = +(value.split(' ')[0])
             this.S_SP = +(value.split(' ')[0])
             break;
           }
           case 'HeaderListPrice':{
             this.T_TP = +(value.split(' ')[0])
             this.He_HP = +(value.split(' ')[0])
             this.He_HHP = +(value.split(' ')[0])
             this.S_SP = +(value.split(' ')[0])
             this.H_SKP = +(value.split(' ')[0])
             break;
           }
          }
        }
          
      }.bind(this)); 

      if (pr && pr.property){
      switch (pr.property.Field){
        case 'CuttingSpeed':{
          this.Vc = value
          break;
        }
        case 'Feed':{
          this.fz = value
          break;
        }
        case 'DMin': case 'Tool_D':{
          this.DC = value
          break;
        }
        case 'DepthOfCutPerPass':{
          this.ap = value
          break;
        }
        case 'NumberOfPassesDepth':{
          this.NOPP = value
          break;
        }
        case 'WidthOfCutPerPass':{
          this.ae = value
          break;
        }
        case 'NumberOfPassesWidth':{
          this.NOPE = value
          break;
        }
        case 'MetalRemovalRate':{
          this.MRR = value
          this.MRR1 = value
          break;
        }
        case 'MetalRemovalRateG':{
          this.MRR = value
          this.MRR2 = value
          break;
        }
        case 'PowerConsumption':{
          this.P = +value
          break;
        }
        case 'MaxTorque':{
          this.T= +value
          break;
        }
        case 'FeedTable':{
          this.Vf = +value
          break;
        }
        case 'RPM':{
          this.n = +value
          break;
        }
        case 'Flutes':{
          this.NOF = +value
          // this.Flutes = +value
          break;
        }
        case 'NoOfTeeth':{
          this.THe_CICT = +value
          if (this.NOF == 0)
            this.NOF = +value
          break;
        }
        case 'NoOfCorners':{
          this.THe_CEDC = +value
          break;
        }
        case 'Dvf1':{
          this.Dvf = +value
          break;
        }
        case 'RpDown1':{
          this.RMPX = +value
          break;
        }
        case 'Pitch':{
          this.PITCH = +value
          break;
        }
        case 'Vf1':{
          this.VfDvf = +value
          break;
        }
        case 'TotalCuttingTime':{
          if (this.srv_StMng.SecApp=='780')
            this.CTF = +value
          break;
        }
        case 'TotalCuttingTimeFormat':{
          //if (this.srv_StMng.SecApp=='780')
            this.CTFFormat = value
          //break;
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
        case 'DMax':{
          this.DH = value
          break;
        }
      }
 


    }
  }


  if (this.srv_StMng.SecApp=='790')
  this.Vf = Math.round((+this.fz * this.n * this.NOF)*100)/100

this.B = +this.srv_StMng.IPL.GetItem('BatchSize').value
this.He_Is = 100
this.THeH_I = 110
if (this.srv_StMng.SecApp!='780')
  this.CTF = Math.round((+this.NOPE * +this.NOPP * this.L / this.Vf) * 100)/100 //NOPE * NOPP * L / Vf
else
 this.CTF = Math.round(this.casttimeformattonumber(this.CTFFormat))
//this.CTFFormat = Math.floor(this.CTF).toString().padStart(2, '0') + ':' + Math.round((this.CTF  - Math.floor(this.CTF))*60).toString().padStart(2, '0');

// this.TLL = 50
// this.TLT = 50
this.srv_Results.gettoolliferesults(this.srv_appsetting.Units,this.selectedHelp.SecondaryAppOrig1 || this.srv_StMng.SecApp,Array.from(new Set(this.selectedHelp.Grade)).toString().split(",").join("").trim(),this.srv_StMng.IPL.GetItem('Material').value,this.selectedHelp.itemType.includes('S')? 'S': 'T',this.Vc,0).subscribe((res: any) => {
  var result:object[] = JSON.parse(res);
  this.TLL = result[0]['TLL'] || '0'
  this.TLT = result[0]['TLT'] || '0'
  var a:string[] = this.TLT.toString().split(':');
  //var TLTMin:number = +a[0] + (+a[1] / 60)
  var TLTMin:number = +a[0] ;
  this.FCE = Math.round((TLTMin / this.CTF) * 100)/100
this.THe_IPB = Math.ceil((this.B / this.FCE / this.THe_CEDC) * this.THe_CICT)
this.T_TPB = Math.ceil(this.B / this.FCE / this.THe_CEDC / this.THeH_I)
this.He_TPB = this.T_TPB
this.He_THH = Math.ceil(this.He_TPB / this.He_Is)
this.THe_TIC = Math.round((this.THe_IP * this.THe_IPB) * 100)/100
this.He_THSC = (this.He_HP * this.He_TPB) + (this.He_HHP * this.He_THH)
this.T_TTC = Math.round(this.T_TP * this.T_TPB * 100)/100
this.T_TGC =  this.TGC
this.He_TGC =  this.TGC
this.S_SPB = Math.ceil(this.B / this.FCE)
this.S_TSC = Math.round(this.S_SP * this.S_SPB * 100)/100
this.H_SHB = Math.ceil(this.B / this.FCE)
this.H_SKB = Math.ceil(this.B / this.FCE / this.THeH_I)
this.H_TSHC = Math.round(this.H_SHP * this.H_SHB * 100)/100
this.H_TSKC = this.H_SKP * this.H_SKB
this.H_TGC =  this.TGC

// this.MTB = Math.round(this.B * this.CTF * 100)/100
// this.MCB = Math.round((this.MTB / 60 * this.MCH) * 100) / 100




/////TYPES
///1. T itemType = T   TD_IT_InsertTool = 1
///2. He  itemType = T TD_IT_InsertHead=1
///3. S itemType = S
///4. H itemType = H

if (this.selectedHelp.itemTypeRes == 'S'){
  this.resType = "S" //Solid
  // this.TCB = this.S_TSC + this.MCB
}else if (this.selectedHelp.itemTypeRes == 'H'){
  this.resType = "H" //MM
  // this.TCB = this.H_TGC + this.MCB
}else{
  this.resType = "T"
  // this.TCB = this.T_TGC + this.MCB
  for (let entry of this.selectedHelp.CatalogNoT) {
    this.srv_Results.getfzminf(entry.trim(),this.selectedHelp.SecondaryAppOrig1).subscribe((res: any) => {
        let _FzminF:string = JSON.parse(res)
        if (_FzminF.trim().startsWith('02,307-01,') || _FzminF == '01,307-01,SAI'){
          this.resType = "He"
          // this.TCB = this.He_TGC + this.MCB
        }     
      })
}
}

// this.TCB = Math.round(this.TCB * 100)/100
// this.CPU = Math.round((this.TCB / this.B) * 100)/100

})

// let itemIndex:number = 0
  this.selectedHelp.CatalogNo.forEach(function (value) {
if (value.trim().length == 7){


    this.catalogNo.push(value.trim());
    this.srv_Results.GetItemParameterValueSpecial(value.trim(),'774',this.srv_appsetting.Units).subscribe((res: any) => {
      let prmLta:string = JSON.parse(res); 
      if (prmLta != '9999'){
        var roundDigits:number = this.srv_appsetting.Units == 'I' ? 100 : 10
        this.O = Math.round((this.O + +prmLta) * roundDigits)/roundDigits
      }
    })

    this.srv_Results.GetRatioLD(value,this.srv_appsetting.Units).subscribe((res: any) => {
      let prmRatioLD:string = JSON.parse(res); 
      if (prmRatioLD != '0'){
        if (this.selectedHelp.itemType[this.selectedHelp.CatalogNo.indexOf(value,0)] == 'I' && this.THe_CICT != 0)
          prmRatioLD = (+prmRatioLD * this.THe_CICT).toString()
          var roundDigits:number = this.srv_appsetting.Units == 'I' ? 1000 : 100
        this.AW = Math.round((this.AW + +prmRatioLD) * roundDigits)/roundDigits
      }
    })

  }
  // itemIndex++
  }.bind(this));




// //T
// if (this.resType == "T")
// this.TCB = this.T_TGC + this.MCB
// //He
// if (this.resType == "He")
// this.TCB = this.He_TGC + this.MCB
// //S
// if (this.resType == "S")
// this.TCB = this.S_TSC + this.MCB
// //H
// if (this.resType == "H")
// this.TCB = this.H_TGC + this.MCB

// let mat:number = +this.srv_StMng.IPL.GetItem('Material').value
let coolValue = this.srv_StMng.IPL.GetItem('Coolant').value
if (coolValue == '1')
  this.COOL = 'WET'
  else
  this.COOL = 'DRY'


let _Mc:number = 0 
let _Kc:number = 0      
let _FHA:number = 0
let GFSCOD:number = 0
let subApp:string = 'Shouldering'
let insertType:string = ''
let thickFirstParam = ''
let thickSecondParam = ''
let cutForceFirts:string = ''
let cutForceSecond:string = ''
let cutForceThird:string = ''
let kappaLeadAngel:number = this.selectedHelp.kappaLeadAngle || 90
//(material:number,  Units:number,  KappaLeadAngle:number,  Flutes:number,  Feed:number,  catalogNoList:String,families)
this.srv_Results.GetMPowerParams760(+this.srv_StMng.IPL.GetItem('Material').value,this.srv_appsetting.Units,kappaLeadAngel,+this.DC,
+this.ae,+this.fz,this.catalogNo.toString(),this.selectedHelp.Families.toString()).subscribe((res: any) => {
  let paramsValues:string = JSON.parse(res); 
  var splitted = paramsValues.split(","); 
    if (splitted.length == 4){
      _Mc = +splitted[0]
      _Kc = +splitted[1]
       _FHA = +splitted[2]
      GFSCOD = +splitted[3]



      if (this.selectedHelp.SecondaryAppOrig1 == '59' || this.selectedHelp.SecondaryAppOrig1 == '61' || ((this.srv_StMng.SecApp == '57' || this.selectedHelp.SecondaryAppOrig1 == '750') && GFSCOD == 0)){
        if (this.selectedHelp.itemType.includes('S')){
          insertType = 'Solidcarbidecutter'
          cutForceFirts = _FHA.toString()
        }          
        else
        {
          insertType = 'StraightEdge'
          thickFirstParam = kappaLeadAngel.toString()  
          cutForceFirts = kappaLeadAngel.toString()
        } 
      }
      else if (this.selectedHelp.SecondaryAppOrig1 == '700' || this.selectedHelp.SecondaryAppOrig1 == '710'  || this.selectedHelp.SecondaryAppOrig1 == '740'){
        insertType = 'FastFeedInsertType'
        thickSecondParam = kappaLeadAngel.toString()
        cutForceFirts = kappaLeadAngel.toString()
        thickFirstParam = this.ap
      }
      else if (GFSCOD > 0){
        insertType = 'Extflutemillingcutter'
        cutForceFirts = this.L.toString()
        cutForceSecond = '0.2'
        cutForceThird = '35'
      }
          


  //GET api/CalcReq/F-CuttingForces/Milling/Shouldering/Extflutemillingcutter/{DD}/{ae}/{z}/{fz}/{ap}/{Kc}/{Mc}/{rake}  /{L}/{delta}/{alpha}
  //GET api/CalcReq/F-CuttingForces/Milling/Shouldering/FastFeedInsertType   /{DD}/{ae}/{z}/{fz}/{ap}/{Kc}/{Mc}/{rake}  /{k}
  //GET api/CalcReq/F-CuttingForces/Milling/Shouldering/StraightEdge         /{DD}/{ae}/{z}/{fz}/{ap}/{Kc}/{Mc}/{rake}  /{k}
  //GET api/CalcReq/F-CuttingForces/Milling/Shouldering/Solidcarbidecutter   /{DD}/{ae}/{z}/{fz}/{ap}/{Kc}/{Mc}/{rake}  /{alpha}
  //GetCuttingForcesMilling(subApp:string,insertType:string,DD:number,ae:number,z:number,fz:number,ap:number,Kc:number,Mc:number,rake:number,k:number,delta:number,alpha:number)

  this.srv_Results.GetCuttingForcesMilling(subApp,insertType,+this.DC,+this.ae,this.NOF,+this.fz,+this.ap,_Kc,_Mc,0,cutForceFirts,cutForceSecond,cutForceThird).subscribe((res: any) => {
    var result = res as MPResult;
    this.Fb = Math.round(result.ResultRowList[0].Value * 100)/100
    this.mb  = Math.round((((this.Fb  * this.O) / 1000)/12)* 100)/100
  })


  //old
  //GET api/CalcReq/H-ChipThickness/Milling/Shouldering/StraightEdge        /{D}/{ae}/{fz}  /{k}
//GET api/CalcReq/H-ChipThickness/Milling/Shouldering/FastFeedInsertType             /{D}/{ae}/{fz}  /{ap}/{k}
//GET api/CalcReq/H-ChipThickness/Milling/Shouldering/ExtFluteMillingCutter/{D}/{ae}/{fz}  /{ap}
//GET api/CalcReq/H-ChipThickness/Milling/Shouldering/SolidCarbidecutter   /{D}/{ae}/{fz}  /{ap}

//new
// GET api/CalcReq/H-ChipThickness/Milling/Shouldering/StraightEdge/{D}/{ae}/{fz}/{k}		
// GET api/CalcReq/H-ChipThickness/Milling/Shouldering/FastFeedInsertType/{D}/{ae}/{fz}/{ap}/{k}	
// GET api/CalcReq/H-ChipThickness/Milling/Shouldering/ExtFluteMillingCutter/{DC}/{ae}/{fz}	
// GET api/CalcReq/H-ChipThickness/Milling/Shouldering/SolidCarbidecutter/{DC}/{ae}/{fz}
//GetChipThicknessMilling(subApp:string,insertType:string,D:number,ae:number,fz:number,ap:number,k:number)
      this.srv_Results.GetChipThicknessMilling(subApp,insertType,+this.DC,+this.ae,+this.fz,thickFirstParam,thickSecondParam).subscribe((res: any) => {
        var result = res as MPResult;
        var roundDigits:number = this.srv_appsetting.Units == 'I' ? 10000 : 1000
        this.hm = Math.round(result.ResultRowList[0].Value * roundDigits)/roundDigits
        this.MCT = Math.round(result.ResultRowList[1].Value * roundDigits)/roundDigits
      })



    }

})




  }





  reset(){

// this.Flutes = 0
this.DC	=	''
this.DPH = 0
this.D	=	0
this.W	=	0
this.L	=	0
this.Vc	=	''
this.fz	=	''
this.ap	=	''
this.NOPP	=	''
this.ae	=	''
this.NOPE	=	''
this.hm	=	0
this.MCT	=	0
this.MRR	=	''
this.MRR1	=	''
this.MRR2	=	''
this.O	=	0
this.AW	=	0
this.P	=	0
this.T	=	0
this.Vf	=	0
this.n	=	0
this.Fb	=	0
this.mb	=	0
this.MCH	=	0
this.B	=	0
this.CTF	=	0
this.TLL	=	0
this.TLT	=	0
this.NOF	=	0
this.THe_CICT	=	0
this.THe_CEDC	=	0
this.THe_IP	=	0
this.T_TP	=	0
this.He_HP	=	0
this.S_SP	=	0
this.H_SHP	=	0
this.H_SKP	=	0
this.He_HHP	=	0
this.FCE	=	0
this.THe_IPB	=	0
this.T_TPB	=	0
this.He_TPB	=	0
this.He_THH	=	0
this.THe_TIC	=	0
this.T_TTC	=	0
this.He_THSC	=	0
this.H_SHB	=	0
this.H_SKB	=	0
this.H_TSHC	=	0
this.H_TSKC	=	0
this.T_TGC	=	0
this.He_TGC	=	0
this.H_TGC	=	0
this.TGC	=	0
this.S_SPB	=	0
this.S_TSC	=	0
this.MCB	=	0
this.MTB	=	''
this.TCB	=	0
this.catalogNo=[]
this.COOL =''
this.PreHole = false
this.DH = ''
this.CR = 0
this.Dvf = 0
this.RMPX = 0
this.PITCH = 0
this.VfDvf = 0
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
