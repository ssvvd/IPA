import { Component, OnInit } from '@angular/core';
import { StateManagerService} from 'src/app/services/statemanager.service' ;
import { clsMaterial } from 'src/app/models/materials/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PpRequestMaterialComponent } from './pp-request-material/pp-request-material.component';

@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.scss']
})
export class MaterialsComponent implements OnInit {

  constructor(private statemng:StateManagerService,private modalService: NgbModal ) {}

  selectedCateg: string;
  selectedMatDeials:clsMaterial;
  curComponent:string;
  selectedSatnd:string;
  breadCrumb:string[]=[];
  searchText:String

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

  receiveMatDeials(material:clsMaterial) {
    this.selectedMatDeials = material;
    this.curComponent = "2";
    this.breadCrumb = [material.group,'Standard Conversion Chart'];
  }
  
  receiveStandard(standard:string) {
    this.selectedSatnd = standard;
    this.curComponent = "3";
/*     if (this.statemng.GetMaterialSelected()!= null){
      var selMat = this.statemng.GetMaterialSelected().group;
      if (selMat.includes(this.selectedCateg))
      this.breadCrumb = [selMat,standard];
    }
    else{ */
      this.breadCrumb = [standard];
    // }
    
  }

  receiveSearchText(srch:string) {
    this.searchText = srch;
  }

/*   reciveClearSearch() {
    this.searchText = "";
  } */

  ngOnInit() {
    this.curComponent = "1";
    //alert(this.statemng.GetMachineHeaderCur().CostPerHour);    
  }

  openRequestMatM() {
    const modalRef = this.modalService.open(PpRequestMaterialComponent, { centered: true,windowClass:"customModalClass" });
  }
}
