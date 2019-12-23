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
  breadCrumb:string[]=[];

  receiveCategory(category:string) {
    this.selectedCateg = category;
    this.curComponent = "1";
    this.breadCrumb = [];
    if (this.statemng.GetMaterialSelected()!= null){
      var selMat = this.statemng.GetMaterialSelected().group;
      if (selMat.includes(category))
      this.breadCrumb = [selMat];
    }
  
  }

  receiveMatDeials(material:string) {
    this.selectedMatDeials = material;
    this.curComponent = "2";
    this.breadCrumb = [this.selectedCateg + material,'Standard Conversion Chart'];
  }
  
  receiveStandard(standard:string) {
    this.selectedSatnd = standard;
    this.curComponent = "3";
    this.breadCrumb = [standard];
  }

  ngOnInit() {
    this.curComponent = "1";
    //alert(this.statemng.GetMachineHeaderCur().CostPerHour);    
  }
}
