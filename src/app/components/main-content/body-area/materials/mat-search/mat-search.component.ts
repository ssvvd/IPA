import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter, OnDestroy,ViewChild  } from '@angular/core';
import { clsMaterial } from 'src/app/models/materials/material'
import { MaterialService } from 'src/app/services/material.service'
import { StateManagerService } from 'src/app/services/statemanager.service' ;
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import {PpAddFavoritComponent} from 'src/app/components/main-content/body-area/materials/pp-add-favorit/pp-add-favorit.component';
import {PpEditParamsComponent} from 'src/app/components/main-content/body-area/materials/pp-edit-params/pp-edit-params.component';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-mat-search',
  templateUrl: './mat-search.component.html',
  styleUrls: ['./mat-search.component.scss','../materials.component.scss']
})
export class MatSearchComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  dtOptionsMat: DataTables.Settings = {};
  materialsResult:clsMaterial[]=[];
  materialsResultFilterd:clsMaterial[]=[];
  materialsResultSorted:clsMaterial[]=[];
  selectedMaterial:string;
  environment = environment;
  dtTriggerMat: Subject<any> = new Subject();
  allSubsMat$: Subscription;
  isDtInitialized:boolean = false;
  firstInt:boolean = false;
  @Input() filterSearchTextInput: string;

  constructor(private serv: MaterialService,private srv_statemanage:StateManagerService,private modalService: NgbModal) { }

  ngOnInit() {
    let myColumns1 = [6,7];
    let myColumns2 = [];

    this.dtOptionsMat = {
      pagingType: 'full_numbers',
       "searching": false,
       "lengthChange": false ,
       "paging":false,  
       "autoWidth":false,
       "columnDefs":[{"targets": environment.internal ? myColumns1 : myColumns2,"orderable": false}],
       "language": {
        "emptyTable": "No data available in table",
        "zeroRecords": "",
        "infoEmpty": ""
      } 
            
      }; 

  }


  fillMainTable(){
    this.allSubsMat$ = this.serv.searchmaterial(this.filterSearchTextInput)
    .subscribe((data: any) => {
      this.materialsResult = JSON.parse(data);
      this.materialsResultSorted = this.materialsResult;
      this.materialsResultFilterd = this.materialsResult;
      if (this.srv_statemanage.GetMaterialSelected()== null)
          this.selectedMaterial = "";
       else
          this.selectedMaterial = this.srv_statemanage.GetMaterialSelected().material;
          
       this.isDtInitializedFunc();


    });
  }

  isDtInitializedFunc(){
    if (this.isDtInitialized){
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTriggerMat.next();
      });
    }
    else{
       this.isDtInitialized = true;
      this.dtTriggerMat.next();
    }
  }

  ngOnChanges(changes:SimpleChanges) {
      this.fillMainTable();
  }

  ngOnDestroy() {
    this.allSubsMat$.unsubscribe();
  }

  // filterTable(){
  //   var searchText = this.filterSearchTextInput;
  //   if (searchText == null || searchText == ''){
  //     this.materialsResultSorted = this.materialsResult;
  //   }
        
  //   else
  //        this.materialsResultSorted = this.materialsResult.filter(_ => 
  //         (_.description.toUpperCase().indexOf(searchText.toUpperCase())>-1) ||
  //         (_.group.toUpperCase().indexOf(searchText.toUpperCase())>-1) ||
  //         (_.Condition.toUpperCase().indexOf(searchText.toUpperCase())>-1) ||
  //         (_.Hardness.toUpperCase().indexOf(searchText.toUpperCase())>-1)
  //         ); 

  // }

  OnSelectMaterial(mat:clsMaterial)
  {   
    this.selectedMaterial = mat.material;
    this.srv_statemanage.SelectMaterial(mat);

  }

  addToFavorites(){
    let a =0;
  }
  
  setAsDefault(){
    let a =0;
  }

  openAddToFavM(mat:clsMaterial) {
    const modalRef = this.modalService.open(PpAddFavoritComponent, { centered: true });
    modalRef.componentInstance.modal_group = mat.Category + mat.group + ' ' + mat.material;
  }

  openEditParamsM(mat:clsMaterial) {
    if (!mat.HardnessOrigin)
      mat.HardnessOrigin = mat.Hardness;
    const modalRef = this.modalService.open(PpEditParamsComponent, { centered: true });
    modalRef.componentInstance.modal_mat_id = mat.id;
    modalRef.componentInstance.modal_group = mat.Category + mat.group;
    modalRef.componentInstance.origin_hardness = mat.HardnessOrigin.replace(" HB","");
    modalRef.componentInstance.modal_hardness = mat.Hardness.replace(" HB","");
    modalRef.result.then((result) => {
      if (result) {
      console.log(result);
        if(result != 'A'){
          mat.Hardness = result;
        }
      }
      }, () => console.log('Rejected!'));
  }


}
