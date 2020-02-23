import { Component, OnInit ,Input} from '@angular/core';
import { InputParamItemChanged} from 'src/app/models/operational-data/inputparameteritem';
import { DatalayerService} from 'src/app/services/datalayer.service' ;
import { StateManagerService} from 'src/app/services/statemanager.service' ;
import { NgxSpinnerService } from "ngx-spinner"; 

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})

export class ResultsComponent implements OnInit { 

  constructor(private srv_DataLayer:DatalayerService,private srv_StMng:StateManagerService,
    private SpinnerService: NgxSpinnerService) { }

  arrResult:string[];
  ErrMsg:string="";

  ngOnInit() {
    this.GetResult();

  }

  GetResult() 
  {
     
    /*     this.srv_DataLayer.setinputparameters1().subscribe(
        res => console.log(res),
        err => console.log( err),
        () => console.log('yay')
      );   */  

      this.SpinnerService.show();  
        /* this.srv_DataLayer.getresult('760','1').subscribe((res: any) => {
        this.arrResult = JSON.parse(res); 
        this.SpinnerService.hide(); 
      });  
         */

      let strpar:string='';
      this.srv_StMng.IPL_ListChanged.forEach(par => {
        strpar = strpar + par.name + "=" + par.value + ";";
        //strpar = strpar + "/" +  par.name + "/" + par.value ;
      });
      //strpar = "Material=1;HardnessHB=125;AdaptorType=BT;AdaptorSize=40;PW_AX=100;PW_AY=0.5;PW_BX=1000;PW_BY=7.5;PW_CX=12000;PW_CY=7.5";          
      //strpar=strpar.split('.').join('xxx'); 
      //console.log(strpar);
      strpar =encodeURIComponent(strpar); 
      
       this.srv_DataLayer.getresults('760','M',strpar).subscribe((res: any) => {
        this.arrResult = JSON.parse(res); 
        this.SpinnerService.hide(); 
        },   
        err => {this.ErrMsg ="Error Find";this.SpinnerService.hide()}); 
  }
}
