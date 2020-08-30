import { Component, OnInit } from '@angular/core';
import { StateManagerService} from 'src/app/services/statemanager.service' ;
import { clsMaterial } from 'src/app/models/materials/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PpRequestMaterialComponent } from './pp-request-material/pp-request-material.component';
import { Location } from '@angular/common';
// import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.scss']
})
export class MaterialsComponent implements OnInit {

  internal:boolean;
  selectedCateg: string;
  selectedMatDeials:clsMaterial;
  curComponent:string;
  selectedSatnd:string;
  breadCrumb:string[]=[];
  searchText:String
  // environment = environment;

  constructor(private statemng:StateManagerService,private modalService: NgbModal,location: Location ) {
    // if(location.path().toLowerCase() == '/materials'){
    //   environment.internal = false;
    // }
  }
  
  receiveCategory(category:string) {
    if (category != "All"){
      this.selectedCateg = category;
      this.curComponent = "1";
      this.breadCrumb = [];
      if (this.statemng.GetMaterialSelected()!= null){
        var selMat = this.statemng.GetMaterialSelected();
        var selCateg = selMat.Category;
        if (selCateg.includes(category))
          this.breadCrumb = ['Group No. ' + selMat.group];
      }
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
    if (srch.trim() == ''){
      this.curComponent = "1";
      this.selectedCateg = "P";
    }
    else{
      this.curComponent = "4";
      this.selectedCateg = "All";
      this.breadCrumb = [];
    }
    
  }

/*   reciveClearSearch() {
    this.searchText = "";
  } */

  ngOnInit() {
    this.curComponent = "1";
    //alert(this.statemng.GetMachineHeaderCur().CostPerHour);    
  }

  openRequestMatM() {
    const modalRef = this.modalService.open(PpRequestMaterialComponent, { centered: true,windowClass:"customModalClass",backdrop: 'static' });
  }
}
