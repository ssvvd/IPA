import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import {clsPropertyValue} from 'src/app/models/results/property-value';
import { StateManagerService} from 'src/app/services/statemanager.service' ;
import { AppsettingService} from 'src/app/services/appsetting.service';
import { ResultsService} from 'src/app/services/results.service' ;

@Component({
  selector: 'mp77',
  templateUrl: './mp77.component.html',
  styleUrls: ['./mp77.component.scss']
})
export class Mp77Component implements OnInit {

 @Input() selectedRes:clsPropertyValue[][];

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
I:number
TLL:number
TLT:number
HDH:number
CTH:number
DHP:number
HPB:number
TP:number
DHC:number
TTC:number
CTB:number
MCB:number
MTB:number
TCB:number
catalogNo:string[]=[]

  constructor(private srv_StMng:StateManagerService,public srv_appsetting:AppsettingService,private srv_Results:ResultsService) { }

  ngOnInit(): void {

// this.fillParams()

this.O = 0

  }


  ngOnChanges(changes:SimpleChanges) {

    if (this.selectedRes && changes.selectedRes){
      this.fillParams()
    }
  }

  fillParams(){
    this.DOC = +this.srv_StMng.IPL.GetItem('Depth').value
    this.MCH = this.srv_StMng.SelectedMachine.CostPerHour

    //??
    this.MaxTol
    this.MinTol    

    //output
    for(var i = 0; this.selectedRes && i < this.selectedRes.length; i++) {
      var pr:clsPropertyValue = this.selectedRes[i][0];
      if (pr && pr.property){
      switch (pr.property.Field){
        case 'CuttingSpeed':{
          this.Vc = pr.value
          break;
        }
        case 'Feed':{
          this.fr = pr.value
          break;
        }
        case 'Tool_D1':{
          this.DC = pr.value
          break;
        }
        case 'MetalRemovalRate':{
          this.MRR = pr.value
          break;
        }
        case 'PowerConsumption':{
          this.P = pr.value
          break;
        }
        case 'MaxTorque':{
          this.T= pr.value
          break;
        }
        case 'FeedTable':{
          this.Vf = +pr.value
          break;
        }
        case 'RPM':{
          this.n = pr.value
          break;
        }
        case 'DetailsListPrice':{
          this.DHP = +pr.value
          break;
        }
        case 'HeaderListPrice':{
          this.TP = +pr.value
          break;
        }
      }

    if (pr.property.Field.toLowerCase().includes('catalogno') && pr.value.trim().length == 7){
      this.catalogNo.push(pr.value);
      this.srv_Results.GetItemParameterValueSpecial(pr.value,'774',this.srv_appsetting.Units).subscribe((res: any) => {
        let prmLta:string = JSON.parse(res); 
        if (prmLta != '9999'){
          this.O = this.O + +prmLta
        }
      })

      this.srv_Results.GetRatioLD(pr.value).subscribe((res: any) => {
        let prmRatioLD:string = JSON.parse(res); 
        if (prmRatioLD != '0'){
          this.AW = this.AW + +prmRatioLD
        }
      })

    }
      


    }
  }


    //http
    this.Fax

    //calc
    this.B = 50000;
    this.HPP = 1;
    this.I = 30;
    this.TLL = 50;
    this.TLT = 50;
    this.HDH = Math.round(((this.TLL * 1000)/ this.DOC) * 100)/100
    this.CTH = Math.round(((this.DOC/this.Vf) * 60)   * 100)/100
    this.HPB = Math.round((this.B * this.HPP / this.HDH) * 100)/100
    this.DHC = this.HPB * this.DHP
    this.TTC = Math.round((this.TP * this.HPB / this.I) * 100)/100
    this.CTB = this.TTC+this.DHC
    this.MTB = Math.round((this.B * this.HPP * this.CTH/ 3600)  * 100)/100
    this.MCB = this.MTB * this.MCH
    this.TCB = this.CTB+this.MCB

    








  }

}
