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
  selector: 'mp77',
  templateUrl: './mp77.component.html',
  styleUrls: ['./mp77.component.scss']
})
export class Mp77Component implements OnInit {

 @Input() selectedRes:clsPropertyValue[][];
 @Input() selectedHelp:clsHelpProp;
 @Input() exportPDF:boolean;

Vc:string
fr:string
DH:string
MaxTol:number
MinTol:number        
DOC:number
MRR:string
O:number
AW:number
P:string
T:string
Vf:number
n:string
Fax:number
MCH:number
B:number
HPP:number
HI_I:number
TLL:number
TLT:string
H_HDH:number
S_HPS:number
I_HPC:number
I_CICT:number
I_CEDC:number
CTH:string
H_DHP:number
S_NSB:number
H_HPB:number
I_IP:number
I_NIB:number
TP:number
H_DHC:number
I_TIC:number
TTC:number
H_CTB:number
I_TPT:number
MCB:number
MTB:string
TCB:number
Flutes:number
CPU:number
 catalogNo:string[]=[]
resType:string = ''

environment=environment;
  constructor(public srv_StMng:StateManagerService,public srv_appsetting:AppsettingService,private srv_Results:ResultsService) { }

  ngOnInit(): void {

// this.fillParams()

// this.reset()
  }


  ngOnChanges(changes:SimpleChanges) {

    if (this.selectedRes && changes.selectedRes){
      this.fillParams()
    }
  }

  fillParams(){
    this.reset()


    this.DOC = +this.srv_StMng.IPL.GetItem('Depth').value
    this.MCH = +this.srv_StMng.IPL.GetItem('MachCostPerHour').value
    this.DH = this.srv_StMng.IPL.GetItem('D_Hole').value

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
            this.H_DHP = +(value.split(' ')[0])
            this.I_IP = +(value.split(' ')[0])
            if (this.TP == 0)
              this.TP = +(value.split(' ')[0])
             break;
           }
           case 'HeaderListPrice':{
            this.TP = +(value.split(' ')[0])
             break;
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
          this.fr = value
          break;
        }
        // case 'Tool_D1':{
        //   this.DC = value
        //   break;
        // }
        case 'MetalRemovalRate':{
          this.MRR = value
          break;
        }
        case 'PowerConsumption':{
          this.P = value
          break;
        }
        case 'MaxTorque':{
          this.T= value
          break;
        }
        case 'FeedTable':{
          this.Vf = +value
          break;
        }
        case 'RPM':{
          this.n = value
          break;
        }
        case 'TCB': {
          this.TCB = +value
          break;
        }
        case 'TGC': {
          this.H_CTB = +value
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
        // case 'DetailsListPrice':{
        //   this.H_DHP = +(value.split(' ')[0])
        //   this.I_IP = +(value.split(' ')[0])
        //   break;
        // }
        // case 'HeaderListPrice':{
        //   this.TP = +(value.split(' ')[0])
        //   break;
        // }
        case 'Flutes':{
          this.Flutes = +value
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
            var roundDigits:number = this.srv_appsetting.Units == 'I' ? 1000 : 100
            if((this.AW + +prmRatioLD)<0.01) roundDigits = 1000;
            this.AW = Math.round((this.AW + +prmRatioLD) * roundDigits)/roundDigits
          }
        })
  
        this.srv_Results.GetPivotParamValue(pr.value.trim(),307,this.srv_StMng.SecApp).subscribe((res: any) => {
          let prmMin:string = JSON.parse(res); 
          if (prmMin != '0'){
            this.MinTol = Math.round((this.MinTol + +prmMin) * 100)/100
          }
        })
  
        // this.srv_Results.GetPivotParamValue(pr.value.trim(),594,this.srv_StMng.SecApp).subscribe((res: any) => {
        //   let x:string = JSON.parse(res); 
        //   if (x != '0' && this.I_CICT == 0){
        //     this.I_CICT = Math.round((this.I_CICT + +x) * 100)/100
        //   }
        // })

        // this.srv_Results.GetPivotParamValue(pr.value.trim(),762,this.srv_StMng.SecApp).subscribe((res: any) => {
        //   let y:string = JSON.parse(res); 
        //   if (y != '0' && this.I_CEDC == 0){
        //     this.I_CEDC = Math.round((this.I_CEDC + +y) * 100)/100
        //   }
        // })

        this.srv_Results.GetPivotParamValue(pr.value.trim(),308,this.srv_StMng.SecApp).subscribe((res: any) => {
          let prMax:string = JSON.parse(res); 
          if (prMax != '0'){
            //this.MaxTol = Math.round((this.MaxTol + +prMax) * 100)/100
            this.MaxTol = this.MaxTol + +prMax ;
          }
        })       
      }
      }.bind(this));



    }
      


    }
  }

  if (this.selectedHelp.itemTypeRes == 'S'){
    this.resType = "S"
  }else if (this.Flutes < 2){
    this.resType = "I"
  }else{
    this.resType = "H"
  }
 


        //http
        let insetFamily = ''
        for (var col = this.selectedHelp.Families.length - 1; col > 0; col--){
          if (this.selectedHelp.Families[col].trim().length > 3){
            insetFamily = this.selectedHelp.Families[col]         
            break;   
          }
        }
        // let insetFamily = this.selectedHelp.Families[this.selectedHelp.Families.length - 1]
        let edgeGeometry = "''"
        //in(4297,2672,3087,3593,3156)
        switch (insetFamily){
            case '4297':
              edgeGeometry = "H3P"
            break;
            case '2672':
              edgeGeometry = "ICP"
            break;
            case '3087':
              edgeGeometry = "HCP"
            break;
            case '3593':
              edgeGeometry = "QCP"
            break;
            case '3156':
              edgeGeometry = "FCP"
            break;
        }
        
        
        
        let _d:number = +this.srv_StMng.IPL.GetItem('DiameterBoring').value
        let _z:number = this.Flutes
        let _f:number = +this.fr
        let _n:number = +this.n
        let _ɣ:number = 0
        let _Mc:number = 0 
        let _Kc:number = 0      
        let _k:number = 0
        let insertType:string = "StraightEdge"
        let insertBrandName:string = ""
        let kappaLeadAngel:number = this.selectedHelp.kappaLeadAngle || 90

//(material:number,  Units:number,  KappaLeadAngle:number,  Flutes:number,  Feed:number,  catalogNoList:String)
        this.srv_Results.GetMPowerParams77(+this.srv_StMng.IPL.GetItem('Material').value,this.srv_appsetting.Units,kappaLeadAngel,
        this.Flutes,+this.fr,this.catalogNo.toString()).subscribe((res: any) => {
          let paramsValues:string = JSON.parse(res); 
          var splitted = paramsValues.split(","); 
            if (splitted.length == 6){
              _Mc = +splitted[0]
              _Kc = +splitted[1]
              _k = +splitted[2]
              insertBrandName = splitted[3];
              this.I_CEDC = +splitted[4];
              this.I_CICT = +splitted[5];
              //this.srv_Results.gettoolliferesults(this.srv_appsetting.Units,this.selectedHelp.SecondaryAppOrig1 || this.srv_StMng.SecApp,this.selectedHelp.Grade.toString().split(",").join(""),this.srv_StMng.IPL.GetItem('Material').value,this.selectedHelp.itemType.includes('S')? 'S': 'T',this.Vc,+this.DH).subscribe((res: any) => {
              /* this.srv_Results.gettoolliferesults(this.srv_appsetting.Units,this.selectedHelp.SecondaryAppOrig1 || this.srv_StMng.SecApp,Array.from(new Set(this.selectedHelp.Grade)).toString().split(",").join("").trim(),this.srv_StMng.IPL.GetItem('Material').value,this.resType,this.Vc,+this.DH).subscribe((res: any) => { */
                //this.srv_Results.gettoolliferesults(this.srv_appsetting.Units,this.selectedHelp.SecondaryAppOrig1 || this.srv_StMng.SecApp,Array.from(new Set(this.selectedHelp.Grade)).toString().split(",")[1].trim(),this.srv_StMng.IPL.GetItem('Material').value,this.resType,this.Vc,+this.DH).subscribe((res: any) => {
                //let arr=Array.from(new Set(this.selectedHelp.Grade)).toString().split(",");
                let grade:string;
                if(this.selectedHelp.Grade.length ==1)  grade=this.selectedHelp.Grade[0];
                if(this.selectedHelp.Grade.length ==2)  grade=this.selectedHelp.Grade[1];
                if(this.selectedHelp.Grade.length >=3) 
                {
                  if(this.selectedHelp.Grade[1]!=undefined)  grade=this.selectedHelp.Grade[1];
                  if(this.selectedHelp.Grade[2]!=undefined)  grade=this.selectedHelp.Grade[2];
                  if(this.selectedHelp.Grade[3]!=undefined)  grade=this.selectedHelp.Grade[3];                   
                }                               
                this.srv_Results.gettoolliferesults(this.srv_appsetting.Units,this.selectedHelp.SecondaryAppOrig1 || this.srv_StMng.SecApp,grade.trim(),this.srv_StMng.IPL.GetItem('Material').value,this.resType,this.Vc,this.srv_StMng.SecAppSelected.MainApp,+this.DH).subscribe((res: any) => {
                var result:object[] = JSON.parse(res);
                this.TLL = result[0]['TLL'] || '0'
                this.TLT = result[0]['TLT'] || '0'

                    //calc
    this.B = +this.srv_StMng.IPL.GetItem('BatchSize').value;
    this.HPP = 1;
    this.HI_I = 30;
    // this.TLL = 50;
    // this.TLT = '50:00';
    let multiplication:number = (this.srv_appsetting.Units == 'I') ? 1 : 1000
    //this.H_HDH = Math.round(((this.TLL * multiplication)/ this.DOC) * 100)/100 || 0
   
    this.S_HPS = Math.round(((this.TLL * multiplication)/ this.DOC) * 100)/100 || 0
    //this.I_HPC = Math.round(((this.TLL * multiplication)/ this.DOC) * 100)/100 || 0
    this.CTH = (Math.round(((this.DOC/this.Vf) * 60)   * 100)/100 || 0).toString()
    if(this.CTH=='0') this.CTH  = '0.016666' ;           

    this.I_HPC = Math.floor(((+this.TLT )/ (Math.round(this.DOC/this.Vf*100)/100)) ) || 0
    if(this.I_HPC==Infinity) this.I_HPC=(+this.TLT )/ (this.DOC/this.Vf)  || 0
         
    this.H_HDH = Math.round((+this.TLT) /(+this.CTH)*60 ) || 0
    this.S_NSB=Math.ceil(this.B / this.S_HPS) || 0
    this.H_HPB = Math.ceil(this.B / this.H_HDH) || 0
    //     NIB=ROUNDUP( B / (HPC * CEDC ))  * CICT
    this.I_NIB=Math.ceil(this.B / (this.I_HPC * this.I_CEDC)) * this.I_CICT || 0
    this.H_DHC = Math.round(this.H_HPB * this.H_DHP * 100)/100
    this.I_TIC= Math.round(this.I_NIB * this.I_IP * 100)/100

//change Tool cost	TTC	TP * HPB / I)	Solid Tools cost	TTC	TP * NSB	Tools cost	TTC	TP * (NIB / I)
    if (this.resType == "H")
      this.TTC =Math.ceil((this.TP *  Math.ceil(this.H_HPB / this.HI_I) )) || 0
    if (this.resType == "S")
      this.TTC = Math.ceil(this.TP * this.S_NSB )
    if (this.resType == "I") //TP * ROUNDUP(HPB / I)
      this.TTC = Math.ceil((this.TP * Math.ceil(this.I_NIB / this.HI_I) )) || 0
        

    // this.H_CTB = Math.round(this.TTC+this.H_DHC * 100)/100
    // this.MTB = (Math.round((this.B * this.HPP * +this.CTH/ 3600)  * 100)/100 ).toString()
    this.I_TPT=Math.round(this.TTC * this.I_TIC * 100)/100
    // this.MCB = Math.round(+this.MTB * this.MCH * 100)/100
    
    // //change
    // if (this.resType == "H")
    // this.TCB = this.H_CTB+this.MCB
    // if (this.resType == "S")
    // this.TCB = this.TTC+this.MCB
    // if (this.resType == "I")
    // this.TCB = this.I_TPT+this.MCB

    // this.TCB = Math.round(this.TCB * 100)/100
    
    this.CTH = Math.floor(+this.CTH / 60).toString().padStart(2, '0') + ':' + Math.floor((+this.CTH  - Math.floor(+this.CTH / 60) * 60)).toString().padStart(2, '0');
    if(this.CTH=='00:00') this.CTH='00:01';
    
    // this.MTB = Math.floor(+this.MTB * 60).toString().padStart(2, '0') + ':' + Math.floor((+this.MTB  - Math.floor(+this.MTB * 60) / 60)).toString().padStart(2, '0');
    // this.CPU = Math.round((this.TCB / this.B) * 100)/100
    
              })              
              switch (insertBrandName.trim().toUpperCase()){
                  case 'SUMOCHAM FLAT HEAD': case 'SUMOCHAM CHAMDRILL LINE': case 'SUMOCHAMIQ':
                    insertType = 'Sumo'
                  break;
                  case 'FLASHCHAM':  case	'CHAMDRILL':
                    insertType = 'IDI'
                  break;
                  case 'CHAMDRILLJET':
                    insertType = 'Jet'
                  break;
                  case 'LOGIQ3CHAM':
                    insertType = 'Logic3'
                  break;
                  case 'DR-TWIST':
                    insertType = 'DR'
                  break;  
                  case 'SOLIDDRILL':
                    insertType = 'StraightEdge'
                  break;  
              }
//GetCuttingForcesDrilling(DD:number,d:number,z:number,f:number,n:number,Kc:number,Mc:number,ɣ:number,k:number)
              this.srv_Results.GetCuttingForcesDrilling(insertType,+this.DH,_d,_z,_f,_n,_Kc,_Mc,_ɣ,_k,edgeGeometry).subscribe((res: any) => {
                var result = res as MPResult;
                this.Fax = Math.round(result.ResultRowList[0].Value * 100)/100
              })
            }

        })

  }


 reset(){
   
  this.Vc=''
  this.fr=''
  this.DH=''
  this.MaxTol=0
  this.MinTol=0        
  this.DOC=0
  this.MRR=''
  this.O=0
  this.AW=0
  this.P=''
  this.T=''
  this.Vf=0
  this.n=''
  this.Fax=0
  this.MCH=0
  this.B=0
  this.HPP=0
  this.HI_I=0
  this.TLL=0
  this.TLT=''
  this.H_HDH=0
  this.CTH=''
  this.H_DHP=0
  this.H_HPB=0
  this.TP=0
  this.H_DHC=0
  this.TTC=0
  this.H_CTB=0
  this.MCB=0
  this.MTB=''
  this.TCB=0
  this.Flutes=0
  this.CPU =0
  this.catalogNo=[]


  this.S_HPS=0
  this.I_HPC=0
  this.I_CICT=0
  this.I_CEDC=0
  this.S_NSB=0
  this.I_IP=0
  this.I_NIB=0
  this.I_TIC=0
  this.I_TPT=0
 }

}



