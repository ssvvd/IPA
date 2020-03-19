import { Component, OnInit ,Input} from '@angular/core';
import { InputParamItemChanged} from 'src/app/models/operational-data/inputparameteritem';
import { DatalayerService} from 'src/app/services/datalayer.service' ;
import { StateManagerService} from 'src/app/services/statemanager.service' ;
import { AppsettingService} from 'src/app/services/appsetting.service';
import { NgxSpinnerService } from "ngx-spinner"; 

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})

export class ResultsComponent implements OnInit { 

  constructor(private srv_DataLayer:DatalayerService,private srv_StMng:StateManagerService,
              private srv_appsetting:AppsettingService,private SpinnerService: NgxSpinnerService) { }

  arrResult:string[];
  ErrMsg:string="";

  ngOnInit() {
    this.GetResult();

  }

  GetResult() 
  {    
      this.SpinnerService.show();       
      this.srv_DataLayer.getresults(this.srv_StMng.SecAppSelected.ApplicationITAID,this.srv_appsetting.Units,this.srv_StMng.IPLChanged).subscribe((res: any) => {
        try{
        this.arrResult = JSON.parse(res); 
        this.SpinnerService.hide();
        }
        catch ( ex)
        {
          console.log(ex);
          this.SpinnerService.hide();
        }
         
        },   
        err => {this.ErrMsg ="Error Find";this.SpinnerService.hide()}        
        ); 
        
  }
}
