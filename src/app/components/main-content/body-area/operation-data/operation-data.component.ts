import { Component, OnInit } from '@angular/core';
import { DatalayerService} from 'src/app/services/datalayer.service' ;
import { InputParameterItem } from 'src/app/models/operational-data/inputparameteritem';
import { InputParameterlist } from 'src/app/models/operational-data/inputparameterlist';
import { StateManagerService} from 'src/app/services/statemanager.service' ;

@Component({
  selector: 'app-operation-data',
  templateUrl: './operation-data.component.html',
  styleUrls: ['./operation-data.component.scss']
})

export class OperationDataComponent implements OnInit {
  
  Ipl:InputParameterlist =new InputParameterlist;
  SecApp:string;
  SecAppName:string;

  constructor(private srv_DataLayer:DatalayerService,private srv_StMng:StateManagerService) { }
  
  ngOnInit() {
    this.srv_DataLayer.getinputparameters().subscribe((data: any)=> {
      for (const d of JSON.parse(data)) {                            
            this.Ipl.items.push({
              name:d.name,
              value: d.value,
              type:d.type,
              valuedefault: d.valuedefault,              
              valuemin:d.valuemin ,
              valuemax: d.valuemax       
          })                        
    }
        //alert(this.InputParamList.items.length);
        //alert(this.InputParamList.GetItem('SecondaryApplication'));
        //this.SecApp=this.InputParamList.GetItem('SecondaryApplication').valuedefault.toString();
        this.SecApp = this.srv_StMng.SecAppSelected.ApplicationITAID;
        this.SecAppName = this.srv_StMng.SecAppSelected.MenuName;
  }
)

};

}