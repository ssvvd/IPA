import { Component, OnInit ,Input} from '@angular/core';
import { InputParamItemChanged} from 'src/app/models/operational-data/inputparameteritem';
import { DatalayerService} from 'src/app/services/datalayer.service' ;
import { StateManagerService} from 'src/app/services/statemanager.service' ;

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})

export class ResultsComponent implements OnInit { 

  constructor(private srv_DataLayer:DatalayerService,private srv_StMng:StateManagerService) { }

  ngOnInit() {
    this.GetResult();
  }

  GetResult() 
  {
    //alert(this.srv_StMng.IPLChanged);
    this.srv_DataLayer.setinputparameters1(this.srv_StMng.IPLChanged).subscribe(
        res => console.log('ok' +res),
        err => console.log( err),
        () => console.log('yay')
      );   
  }
}
