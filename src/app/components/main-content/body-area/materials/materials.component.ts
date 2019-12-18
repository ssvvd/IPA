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
  selectedMatDeials:String;
  curComponent:string;
  selectedSatnd:string;

  receiveCategory(category:string) {
    this.selectedCateg = category;
    this.curComponent = "1";
  }

  receiveMatDeials(material:string) {
    this.selectedMatDeials = material;
    this.curComponent = "2";
  }
  
  receiveStandard(standard:string) {
    this.selectedSatnd = standard;
    this.curComponent = "3";
  }

  ngOnInit() {
    this.curComponent = "1";
    //alert(this.statemng.GetMachineHeaderCur().CostPerHour);    
  }
}
