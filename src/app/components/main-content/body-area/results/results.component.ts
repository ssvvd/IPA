<<<<<<< HEAD
import { Component, OnInit} from '@angular/core';

=======
import { Component, OnInit ,Input} from '@angular/core';
import { InputParamItemChanged} from 'src/app/models/operational-data/inputparameteritem';
import { DatalayerService} from 'src/app/services/datalayer.service' ;
import { StateManagerService} from 'src/app/services/statemanager.service' ;
import { AppsettingService} from 'src/app/services/appsetting.service';
import { NgxSpinnerService } from "ngx-spinner"; 
>>>>>>> 91098349ceab9aacbd8aecb0284a430b906e110a

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})

export class ResultsComponent implements OnInit { 

<<<<<<< HEAD
  constructor() { }

=======
  constructor(private srv_DataLayer:DatalayerService,private srv_StMng:StateManagerService,
              private srv_appsetting:AppsettingService,private SpinnerService: NgxSpinnerService) { }
>>>>>>> 91098349ceab9aacbd8aecb0284a430b906e110a


  ngOnInit() {


<<<<<<< HEAD
=======
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
        
>>>>>>> 91098349ceab9aacbd8aecb0284a430b906e110a
  }


}
