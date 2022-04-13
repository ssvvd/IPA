import { Component, Input, OnInit,SimpleChanges } from '@angular/core';
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
  selector: 'mp-threading',
  templateUrl: './mp-threading.component.html',
  styleUrls: ['./mp-threading.component.scss']
})
export class MpThreadingComponent implements OnInit {

  @Input() selectedRes:clsPropertyValue[][];
  @Input() selectedHelp:clsHelpProp;

  DC:number
  TS:string
  P:number
  NSDo:string
  NSDoUnits:string
  LTH:number
  Vc:number
  fz:number
  O:number
  AW:number
  n:number
  F:number
  Vf:number
  IP:number
  TP:number
  HP:number
  HHP:number
  SP:number
  SHP:number
  SKP:number
  catalogNo:string[]=[]
  resType:string = ''
  lead:number=0;
  TPT:string;
  constructor(public srv_StMng:StateManagerService,public srv_appsetting:AppsettingService,private srv_Results:ResultsService) { }

  ngOnInit(): void {    
  }

  ngOnChanges(changes:SimpleChanges) {

    if (this.selectedRes && changes.selectedRes){
      {
      this.fillParams();
      this.CalculateLead();
      }
    }
  }

  fillParams(){
    this.reset()


    //IHead
    //I
    //SHead
    //S
    if (this.selectedHelp.itemType.indexOf('S') == -1){//Tool
      this.resType = "I" 
      for (let entry of this.selectedHelp.CatalogNoT) {
        this.srv_Results.getfzminf(entry.trim(),this.selectedHelp.SecondaryAppOrig1).subscribe((res: any) => {
            let _FzminF:string = JSON.parse(res)
            if (_FzminF.trim().startsWith('02,307-01,SAI') || _FzminF == '01,307-01,SAI'){
              this.resType = "IH"
            }     
          })
    }
    }
    else{//Solid
      this.resType = "S" //Solid
      for (let entry of this.selectedHelp.CatalogNoT) {
        this.srv_Results.getfzminf(entry.trim(),this.selectedHelp.SecondaryAppOrig1).subscribe((res: any) => {
            let _FzminF:string = JSON.parse(res)
            if (_FzminF.trim().startsWith('02,307-01,SAI') || _FzminF == '01,307-01,SAI'){
              this.resType = "SH"
            }     
          })
    }
    }

    //input
    this.TS = this.srv_StMng.IPL.GetItem('ThreadForm').value
    this.P = +this.srv_StMng.IPL.GetItem('Pitch').value
    this.NSDo = this.srv_StMng.IPL.GetItem('D_Hole').value || this.srv_StMng.IPL.GetItem('Size').value
    
    if(this.srv_StMng.IPL.GetItem('Size').value){
      this.NSDoUnits = this.srv_appsetting.UnitslengthDesc
      this.NSDo = this.NSDo.toString().replace('***', '"')
    }
    
    this.LTH = +this.srv_StMng.IPL.GetItem('LengthOfShoulder_L').value

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
        this.SHP = +(value.split(' ')[0])
         this.IP = +(value.split(' ')[0])
         this.SP = +(value.split(' ')[0])
         break;
       }
       case 'HeaderListPrice':{
         this.TP = +(value.split(' ')[0])
         this.HHP = +(value.split(' ')[0])
         this.SKP = +(value.split(' ')[0])
         break;
       }
      }
    }
      
  }.bind(this)); 

  if (pr && pr.property){
    switch (pr.property.Field){

      case 'Tool_D':{
        this.DC = +value
        break;
      }
      case 'CuttingSpeed':{
        this.Vc = +value
        break;
      }
      case 'Feed':{
        this.fz = +value
        break;
      }
      case 'FeedTable':{
        this.F = +value
        break;
      }
      case 'FeedG':{
        this.Vf = +value
        break;
      }
      case 'RPM':{
        this.n = +value
        break;
      }
      case 'OperationType':{
        this.TPT = value;
        break;
      }
      
    }



  }


 }




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
          var roundDigits:number = this.srv_appsetting.Units == 'I' ? 1000 : 100;
          if((this.AW + +prmRatioLD)<0.01) roundDigits = 1000;
          this.AW = Math.round((this.AW + +prmRatioLD) * roundDigits)/roundDigits
        }
      })
  
    }
    // itemIndex++
    }.bind(this));

  }

  reset(){
    this.DC = 0
    this.TS = ''
    this.P = 0
    this.NSDo = ''
    this.LTH = 0
    this.Vc = 0
    this.fz = 0
    this.O = 0
    this.AW = 0
    this.n = 0
    this.F = 0
    this.Vf = 0
    this.IP = 0
    this.TP = 0
    this.HP = 0
    this.HHP = 0
    this.SP = 0
    this.SHP = 0
    this.SKP = 0
    this.catalogNo=[]
    this.resType = ''
    this.NSDoUnits = ''
  }

  
CalculateLead()
{
    let start:number;
    start=Number(this.srv_StMng.IPL.GetItem('NumberStarts').value);
    if (this.srv_StMng.IPL.GetItem('ThreadForm').value == 'M60' || this.srv_StMng.IPL.GetItem('ThreadForm').value == 'MJ60')
      this.lead=Math.round(((+this.srv_StMng.IPL.GetItem('Pitch').value)* start*10))/10;
    else
    if(this.srv_appsetting.Units=='M')
        this.lead= Math.round((25.4/(+this.srv_StMng.IPL.GetItem('Pitch').value)* start)*10)/10;
    else
        this.lead=Math.round((1/(+this.srv_StMng.IPL.GetItem('Pitch').value)* start)*100)/100;   
}
}
