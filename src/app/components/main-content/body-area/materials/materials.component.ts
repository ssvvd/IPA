import { Component, OnInit } from '@angular/core';
import { StateManagerService} from 'src/app/services/statemanager.service' ;

@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.scss']
})
export class MaterialsComponent implements OnInit {

  constructor(private statemng:StateManagerService ) {}

  ngOnInit() {
    //alert(this.statemng.GetMachineHeaderCur().CostPerHour);    
  }
}
