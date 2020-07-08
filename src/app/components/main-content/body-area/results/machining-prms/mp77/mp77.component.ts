import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import {clsPropertyValue} from 'src/app/models/results/property-value';
import { StateManagerService} from 'src/app/services/statemanager.service' ;
import { AppsettingService} from 'src/app/services/appsetting.service';
import { ResultsService} from 'src/app/services/results.service' ;
import {clsHelpProp} from 'src/app/models/results/help-prop';

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

Vc:string
fr:string
DC:string
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
 catalogNo:string[]=[]
resType:string = ''
  constructor(private srv_StMng:StateManagerService,public srv_appsetting:AppsettingService,private srv_Results:ResultsService) { }

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
    this.MCH = this.srv_StMng.SelectedMachine.CostPerHour

    //output
    for(var i = 0; this.selectedRes && i < this.selectedRes.length; i++) {
      var pr:clsPropertyValue = this.selectedRes[i][0];
      var value:string = '0'
      this.selectedRes[i].forEach(function (v) {
        if (v.value != '')
          value = v.value
      }); 
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
        case 'Tool_D1':{
          this.DC = value
          break;
        }
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
        case 'DetailsListPrice':{
          this.H_DHP = +value
          this.I_IP = +value
          break;
        }
        case 'HeaderListPrice':{
          this.TP = +value
          break;
        }
        case 'Flutes':{
          this.Flutes = +value
          break;
        }
      }

    if (pr.property.Field.toLowerCase().includes('catalogno') && pr.value.trim().length == 7){

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
  
        this.srv_Results.GetRatioLD(pr.value).subscribe((res: any) => {
          let prmRatioLD:string = JSON.parse(res); 
          if (prmRatioLD != '0'){
            this.AW = Math.round((this.AW + +prmRatioLD) * 100)/100
          }
        })
  
        this.srv_Results.GetPivotParamValue(pr.value.trim(),307,this.srv_StMng.SecApp).subscribe((res: any) => {
          let prmMin:string = JSON.parse(res); 
          if (prmMin != '0'){
            this.MinTol = Math.round((this.MinTol + +prmMin) * 100)/100
          }
        })
  
        this.srv_Results.GetPivotParamValue(pr.value.trim(),594,this.srv_StMng.SecApp).subscribe((res: any) => {
          let x:string = JSON.parse(res); 
          if (x != '0'){
            this.I_CICT = Math.round((this.I_CICT + +x) * 100)/100
          }
        })

        this.srv_Results.GetPivotParamValue(pr.value.trim(),762,this.srv_StMng.SecApp).subscribe((res: any) => {
          let y:string = JSON.parse(res); 
          if (y != '0'){
            this.I_CEDC = Math.round((this.I_CEDC + +y) * 100)/100
          }
        })

        this.srv_Results.GetPivotParamValue(pr.value.trim(),308,this.srv_StMng.SecApp).subscribe((res: any) => {
          let prMax:string = JSON.parse(res); 
          if (prMax != '0'){
            this.MaxTol = Math.round((this.MaxTol + +prMax) * 100)/100
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

    //calc
    this.B = 50000;
    this.HPP = 1;
    this.HI_I = 30;
    this.TLL = 50;
    this.TLT = '50:00';
    this.H_HDH = Math.round(((this.TLL * 1000)/ this.DOC) * 100)/100 || 0
    this.S_HPS = Math.round(((this.TLL * 1000)/ this.DOC) * 100)/100 || 0
    this.I_HPC = Math.round(((this.TLL * 1000)/ this.DOC) * 100)/100 || 0
    this.CTH = (Math.round(((this.DOC/this.Vf) * 60)   * 100)/100 || 0).toString()
    this.S_NSB=Math.round(this.B * this.HPP / this.S_HPS * 100)/100 || 0
    this.H_HPB = Math.round((this.B * this.HPP / this.H_HDH) * 100)/100 || 0
    this.I_NIB=Math.round(this.B * this.HPP * this.I_CICT / (this.I_HPC * this.I_CEDC) * 100)/100 || 0
    this.H_DHC = this.H_HPB * this.H_DHP
    this.I_TIC=this.I_NIB * this.I_IP

//change Tool cost	TTC	TP * HPB / I)	Solid Tools cost	TTC	TP * NSB	Tools cost	TTC	TP * (NIB / I)
    if (this.resType == "H")
    this.TTC = Math.round((this.TP * this.H_HPB / this.HI_I) * 100)/100 || 0
    if (this.resType == "S")
    this.TTC = this.TP * this.S_NSB
    if (this.resType == "I")
    this.TTC = Math.round((this.TP * this.I_NIB / this.HI_I) * 100)/100 || 0

    this.H_CTB = this.TTC+this.H_DHC
    this.MTB = (Math.round((this.B * this.HPP * +this.CTH/ 3600)  * 100)/100 ).toString()
    this.I_TPT=this.TTC * this.I_TIC
    this.MCB = Math.round(+this.MTB * this.MCH * 100)/100
    
    //change
    if (this.resType == "H")
    this.TCB = this.H_CTB+this.MCB
    if (this.resType == "S")
    this.TCB = this.TTC+this.MCB
    if (this.resType == "I")
    this.TCB = this.I_TPT+this.MCB


    
    this.CTH = Math.floor(+this.CTH / 60).toString().padStart(2, '0') + ':' + Math.floor((+this.CTH  - Math.floor(+this.CTH / 60) * 60)).toString().padStart(2, '0');
    this.MTB = Math.floor(+this.MTB * 60).toString().padStart(2, '0') + ':' + Math.floor((+this.MTB  - Math.floor(+this.MTB * 60) / 60)).toString().padStart(2, '0');
    
    


        //http
        let insetFamily = ''
        for (var col = this.selectedHelp.Families.length - 1; col > 0; col--){
          if (this.selectedHelp.Families[col].trim().length > 3){
            insetFamily = this.selectedHelp.Families[col]         
            break;   
          }
        }
        // let insetFamily = this.selectedHelp.Families[this.selectedHelp.Families.length - 1]
        let edgeGeometry = ""
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
        
        
        let _dd:number = +this.srv_StMng.IPL.GetItem('D_Hole').value
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

//(material:number,  Units:number,  KappaLeadAngle:number,  Flutes:number,  Feed:number,  catalogNoList:String)
        this.srv_Results.GetMPowerParams77(+this.srv_StMng.IPL.GetItem('Material').value,this.srv_appsetting.Units,this.selectedHelp.kappaLeadAngle,
        this.Flutes,+this.fr,this.catalogNo.toString()).subscribe((res: any) => {
          let paramsValues:string = JSON.parse(res); 
          var splitted = paramsValues.split(","); 
            if (splitted.length == 4){
              _Mc = +splitted[0]
              _Kc = +splitted[1]
              _k = +splitted[2]
              insertBrandName = splitted[3]



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
              this.srv_Results.GetCuttingForcesDrilling(insertType,_dd,_d,_z,_f,_n,_Kc,_Mc,_ɣ,_k,edgeGeometry).subscribe((res: any) => {
                var result = res as MPResult;
                this.Fax = Math.round(result.ResultRowList[0].Value * 100)/100
              })



            }

        })

  }


 reset(){
   
  this.Vc=''
  this.fr=''
  this.DC=''
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
