import { Component, OnInit } from '@angular/core';
import { StateManagerService} from 'src/app/services/statemanager.service' ;

@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.scss']
})
export class MaterialsComponent implements OnInit {

  constructor(private statemng:StateManagerService ) {}

  selectedCateg: string;

  receiveCategory(category:string) {
    this.selectedCateg = category;
  }

  ngOnInit() {
    //alert(this.statemng.GetMachineHeaderCur().CostPerHour);    
  }
}
