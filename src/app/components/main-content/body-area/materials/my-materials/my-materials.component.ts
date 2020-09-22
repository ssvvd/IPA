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
import { NgxSpinnerService } from "ngx-spinner"; 
import { AppsettingService} from 'src/app/services/appsetting.service';

@Component({
  selector: 'my-materials',
  templateUrl: './my-materials.component.html',
  styleUrls: ['./my-materials.component.scss','../materials.component.scss']
})
export class MyMaterialsComponent implements OnInit, OnDestroy {

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  dtOptionsMat: any = {};
  materialsResult:clsMaterial[]=[];
  materialsResultFilterd:clsMaterial[]=[];
  materialsResultSorted:clsMaterial[]=[];
  selectedMaterial:string;
  environment = environment;
  dtTriggerMat: Subject<any> = new Subject();
  allSubsMat$: Subscription;
  isDtInitialized:boolean = false;
  firstInt:boolean = false;
  _timeout: any = null;
  
  constructor(private serv: MaterialService,private srv_statemanage:StateManagerService,private modalService: NgbModal,private SpinnerService: NgxSpinnerService,public srv_appsetting:AppsettingService) { }

  ngOnInit() {
    let myColumns1 = [6,7];
    let myColumns2 = [];
    let sortHardnessCol1 = 8;
    let sortHardnessCol2 = 6;

    this.dtOptionsMat = {
      pagingType: 'full_numbers',
       "searching": false,
       "lengthChange": false ,
       "paging":false,  
       "autoWidth":false,
       "scrollY": '65vh',
       "scrollCollapse" : true,
       "aaSorting": [],
       "columnDefs":[{"targets": environment.internal ? myColumns1 : myColumns2,"orderable": false},{ targets: environment.internal ? sortHardnessCol1 : sortHardnessCol2, type: 'num' }, { "iDataSort": environment.internal ? sortHardnessCol1 : sortHardnessCol2, "aTargets": [ 5 ] }],
       "language": {
        "emptyTable": "No data available in table",
        "zeroRecords": "",
        "infoEmpty": "",
        "info": ""
      } 
            
      }; 

      this.fillMainTable();

  }


  fillMainTable(){
    if (this.srv_appsetting.UserID != ''){
    this.SpinnerService.show();
    this.allSubsMat$ = this.serv.getMatFav(this.srv_appsetting.UserID)
    .subscribe((data: any) => {
      this.materialsResult = JSON.parse(data);
      this.materialsResultSorted = this.materialsResult;
      this.materialsResultFilterd = this.materialsResult;
      if (this.srv_statemanage.GetMaterialSelected()== null)
          this.selectedMaterial = "";
       else
          this.selectedMaterial = this.srv_statemanage.GetMaterialSelected().FavName;
          
       this.isDtInitializedFunc();
       this.SpinnerService.hide();
    }); 
  }
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

  // ngOnChanges(changes:SimpleChanges) {
  //     if(this._timeout){ //if there is already a timeout in process cancel it
  //       window.clearTimeout(this._timeout);
  //     }
  //     this._timeout = window.setTimeout(() => {
  //        this._timeout = null;
  //        this.fillMainTable();
  //     },1000);
  //  }

  ngOnDestroy() {
    if(this.allSubsMat$)
    this.allSubsMat$.unsubscribe();
  }

  OnSelectMaterial(mat:clsMaterial)
  {   
    this.selectedMaterial = mat.FavName;
    this.srv_statemanage.SelectMaterial(mat);

  }

  openAddToFavM(mat:clsMaterial) {
    const modalRef = this.modalService.open(PpAddFavoritComponent, { centered: true });
    modalRef.componentInstance.modal_group = mat.Category + mat.group + ' ' + mat.material;
    modalRef.componentInstance.selectedMat = mat;
    modalRef.componentInstance.edit = true;
    modalRef.result.then((result) => {
      if (result) {
      console.log(result);
        if(result == 'refresh'){
          this.fillMainTable();
        }
      }
      }, () => console.log('Rejected!'));
  }

  openEditParamsM(mat:clsMaterial) {
    if (!mat.HardnessOrigin)
      mat.HardnessOrigin = mat.Hardness;
    const modalRef = this.modalService.open(PpEditParamsComponent, { centered: true,backdrop: 'static' });
    modalRef.componentInstance.modal_mat_id = mat.id;
    modalRef.componentInstance.modal_group = mat.Category + mat.group;
    modalRef.componentInstance.origin_hardness = mat.HardnessOrigin;
    modalRef.componentInstance.modal_hardness = mat.Hardness;
    modalRef.componentInstance.unit_hardness = mat.HardnessUnits?mat.HardnessUnits:"HB";
    modalRef.result.then((result) => {
      if (result) {
      console.log(result);
        if(result != 'A'){
          let spletter = result.split(",");
          mat.Hardness = spletter[0];
          mat.HardnessUnits = spletter[1];
          mat.HardnessHBValue = spletter[2];
          this.SpinnerService.show();
          this.serv.EditMaterialFavorit( this.srv_appsetting.UserID || 'HIBAHAWARI',  mat.FavName,  mat.FavName ,  mat.Hardness,   mat.HardnessUnits || 'HB',mat.HardnessHBValue || mat.Hardness).subscribe((data: any) => {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              dtInstance.destroy();
              this.dtTriggerMat.next();
            });
            this.SpinnerService.hide();
          });
        }
      }
      }, () => console.log('Rejected!'));
  }


}
