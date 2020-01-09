import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter  } from '@angular/core';
import { clsMaterial } from 'src/app/models/materials/material'
import { MaterialService } from 'src/app/services/material.service'
import { StateManagerService } from 'src/app/services/statemanager.service' ;
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {PpSetDefaultComponent} from 'src/app/components/main-content/body-area/materials/pp-set-default/pp-set-default.component';
import {PpAddFavoritComponent} from 'src/app/components/main-content/body-area/materials/pp-add-favorit/pp-add-favorit.component';
import {PpEditParamsComponent} from 'src/app/components/main-content/body-area/materials/pp-edit-params/pp-edit-params.component';
import {PpRequestMaterialComponent} from 'src/app/components/main-content/body-area/materials/pp-request-material/pp-request-material.component';

@Component({
  selector: 'app-mat-main-table',
  templateUrl: './mat-main-table.component.html',
  styleUrls: ['./mat-main-table.component.scss','../materials.component.scss']
})
export class MatMainTableComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  materialsResult:clsMaterial[]=[];
  materialsResultFilterd:clsMaterial[]=[];
  selectedMaterial:string;
  environment = environment;
  @Input() selectedCategory: string ;
  @Input() filterSearchTextInput: string;
  @Output() matDetailSelectedEv = new EventEmitter<clsMaterial>();

  constructor(private serv: MaterialService,private srv_statemanage:StateManagerService,private modalService: NgbModal) { }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
       "searching": false,
       "lengthChange": false ,
       "paging":false,  
       "autoWidth":false,
       "language": {
        "emptyTable": "",
        "zeroRecords": "",
        "infoEmpty": ""
      } 
            
      }; 
    
    this.fillMainTable();

  }

  fillMainTable(){
    this.serv.getmaterialsbygrp('EN',this.selectedCategory).subscribe((res:any)=>{
      this.materialsResult=JSON.parse(res);
      this.materialsResultFilterd = this.materialsResult;
      this.filterTable();
      if (this.srv_statemanage.GetMaterialSelected()== null)
          this.selectedMaterial = "";
       else
          this.selectedMaterial = this.srv_statemanage.GetMaterialSelected().group;
    })
  }

  ngOnChanges(changes:SimpleChanges) {
    if (changes.selectedCategory){
      this.fillMainTable();
    }
    if (changes.filterSearchTextInput){
      this.filterTable();
    }
        

  }

  filterTable(){
    var searchText = this.filterSearchTextInput;
    if (searchText == null || searchText == '')
        this.materialsResultFilterd = this.materialsResult;
    else
         this.materialsResultFilterd = this.materialsResult.filter(_ => 
          (_.description.toUpperCase().indexOf(searchText.toUpperCase())>-1) ||
          (_.group.toUpperCase().indexOf(searchText.toUpperCase())>-1) ||
          (_.Condition.toUpperCase().indexOf(searchText.toUpperCase())>-1) ||
          (_.Hardness.toUpperCase().indexOf(searchText.toUpperCase())>-1)
          ); 
  }
  matDetailClick(material: clsMaterial) {
    this.matDetailSelectedEv.emit(material);
  }

  OnSelectMaterial(mat:clsMaterial)
  {   
    this.selectedMaterial = mat.group;
    this.srv_statemanage.SelectMaterial(mat);

  }

  addToFavorites(){
    let a =0;
  }
  
  setAsDefault(){
    let a =0;
  }
  openSetDefaultModal(mat:clsMaterial) {
    const modalRef = this.modalService.open(PpSetDefaultComponent, { centered: true });
    modalRef.componentInstance.modal_group = mat.group;
/*     modalRef.componentInstance.my_modal_title = 'I your title';
    modalRef.componentInstance.my_modal_content = 'I am your content'; */
  }

  openAddToFavM(mat:clsMaterial) {
    const modalRef = this.modalService.open(PpAddFavoritComponent, { centered: true });
    modalRef.componentInstance.modal_group = mat.group;
  }

  openEditParamsM(mat:clsMaterial) {
    const modalRef = this.modalService.open(PpEditParamsComponent, { centered: true });
    modalRef.componentInstance.modal_mat_id = mat.id;
    modalRef.componentInstance.modal_group = mat.group;
    modalRef.componentInstance.modal_hardness = mat.Hardness.replace(" HB","");
  }

  openRequestMatM() {
    const modalRef = this.modalService.open(PpRequestMaterialComponent, { centered: true });
  }
}
