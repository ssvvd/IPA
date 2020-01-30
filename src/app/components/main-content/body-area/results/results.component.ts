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
  
  ngOnInit() {
    this.GetResult();

  }

  GetResult() 
  {
   
     /*  this.srv_DataLayer.setinputparameters1().subscribe(
        res => console.log('ok' +res),
        err => console.log( err),
        () => console.log('yay')
      );   */

      this.SpinnerService.show();  
        this.srv_DataLayer.getresult('760','1').subscribe((res: any) => {
        this.arrResult = JSON.parse(res); 
        this.SpinnerService.hide(); 
      });   
        

    //alert(this.srv_StMng.IPLChanged);
    /* this.srv_DataLayer.setinputparameters1(this.srv_StMng.IPLChanged).subscribe( */
   /*    this.srv_DataLayer.setinputparameters1().subscribe(
        res => console.log('ok' +res),
        err => console.log( err),
        () => console.log('yay')
      );   */

       
  }
}
