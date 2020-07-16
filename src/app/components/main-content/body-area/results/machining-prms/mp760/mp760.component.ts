import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import {clsPropertyValue} from 'src/app/models/results/property-value';
import { StateManagerService} from 'src/app/services/statemanager.service' ;
import { AppsettingService} from 'src/app/services/appsetting.service';
import { ResultsService} from 'src/app/services/results.service' ;
import {clsHelpProp} from 'src/app/models/results/help-prop';

@Component({
  selector: 'mp760',
  templateUrl: './mp760.component.html',
  styleUrls: ['./mp760.component.scss']
})
export class Mp760Component implements OnInit {

  @Input() selectedRes:clsPropertyValue[][];
  @Input() selectedHelp:clsHelpProp;

  DC:string
  D:number
  W:number
  L:number
  Vc:string
  fz:string
  ap:string
  NOPP:string
  ae:string
  NOPE:string
  hm:number
  MCT:number
  MRR:string
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
  S_SPB:number
  S_TSC:number
  MCB:number
  MTB:number
  TCB:number
  THeH_I:number
  He_Is:number
  catalogNo:string[]=[]
  resType:string = ''





  constructor(private srv_StMng:StateManagerService,public srv_appsetting:AppsettingService,private srv_Results:ResultsService) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes:SimpleChanges) {

    if (this.selectedRes && changes.selectedRes){
      this.fillParams()
    }
  }


  fillParams(){
    this.reset()


    this.D = +this.srv_StMng.IPL.GetItem('Depth').value
    this.W = +this.srv_StMng.IPL.GetItem('Width').value
    this.L = +this.srv_StMng.IPL.GetItem('Length').value
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
          this.fz = value
          break;
        }
        case 'Tool_D':{
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
        case 'DetailsListPrice':{
         this.H_SHB = +value
          this.THe_IP = +value
          break;
        }
        case 'HeaderListPrice':{
          this.T_TP = +value
          this.He_HP = +value
          this.He_HHP = +value
          this.S_SP = +value
          this.H_SKB = +value
          break;
        }
        case 'Flutes':{
          this.NOF = +value
          break;
        }
        case 'NoOfTeeth':{
          this.THe_CICT = +value
          break;
        }
        case 'NoOfCorners':{
          this.THe_CEDC = +value
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
  
      }
      }.bind(this));



    }
      


    }
  }



this.B = 100
this.He_Is = 100
this.THeH_I = 110
this.CTF = +this.NOPE * +this.NOPP * this.L / this.Vf //NOPE * NOPP * L / Vf
this.TLL = 50
this.TLT = 50
this.FCE = this.TLT / this.CTF
this.THe_IPB = Math.ceil((this.B / this.FCE / this.THe_CEDC) * this.THe_CICT)
this.T_TPB = Math.ceil(this.B / this.FCE / this.THe_CEDC / this.THeH_I)
this.He_TPB = this.T_TPB
this.He_THH = Math.ceil(this.He_TPB / this.He_Is)
this.THe_TIC = this.THe_IP * this.THe_IPB
this.He_THSC = (this.He_HP * this.He_TPB) + (this.He_HHP * this.He_THH)
this.T_TTC = this.T_TP * this.T_TPB
this.T_TGC = this.THe_TIC + this.T_TTC
this.He_TGC = this.THe_TIC + this.He_THSC
this.S_SPB = Math.ceil(this.B / this.FCE)
this.S_TSC = this.S_SP * this.S_SPB
this.H_SHB = Math.ceil(this.B / this.FCE)
this.H_SKB = this.H_SHB
this.H_TSHC = this.H_SHP * this.H_SHB
this.H_TSKC = this.H_SKP * this.H_SKB
this.H_TGC = this.H_TSHC + this.H_TSKC

this.MTB = this.B * this.FCE * this.CTF / 60
this.MCB = this.MTB * this.MCH

if (this.selectedHelp.itemTypeRes == 'S'){
  this.resType = "S"
  this.TCB = this.S_TSC + this.MCB
}else if (this.selectedHelp.itemTypeRes == 'H'){
  this.resType = "H"
  this.TCB = this.H_TGC + this.MCB
}else{
  this.resType = "T"
  this.TCB = this.T_TGC + this.MCB
  for (let entry of this.selectedHelp.CatalogNoT) {
    this.srv_Results.getfzminf(entry.trim()).subscribe((res: any) => {
        let _FzminF = JSON.parse(res)
        if (_FzminF == '02' || _FzminF == '01'){
          this.resType = "He"
          this.TCB = this.He_TGC + this.MCB
        }     
      })
}
}

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









  }





  reset(){

this.DC	=	''
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
this.S_SPB	=	0
this.S_TSC	=	0
this.MCB	=	0
this.MTB	=	0
this.TCB	=	0

  }

}
