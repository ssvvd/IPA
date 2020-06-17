import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter, OnDestroy,ViewChild  } from '@angular/core';
import { clsMaterial } from 'src/app/models/materials/material'
import { MaterialService } from 'src/app/services/material.service'
import { StateManagerService } from 'src/app/services/statemanager.service' ;
import { AppsettingService} from 'src/app/services/appsetting.service';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { ActivatedRoute} from '@angular/router';
import {PpSetDefaultComponent} from 'src/app/components/main-content/body-area/materials/pp-set-default/pp-set-default.component';
import {PpAddFavoritComponent} from 'src/app/components/main-content/body-area/materials/pp-add-favorit/pp-add-favorit.component';
import {PpEditParamsComponent} from 'src/app/components/main-content/body-area/materials/pp-edit-params/pp-edit-params.component';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-mat-main-table',
  templateUrl: './mat-main-table.component.html',
  styleUrls: ['./mat-main-table.component.scss','../materials.component.scss']
})
export class MatMainTableComponent implements OnInit, OnDestroy {
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
  lang:string;
  @Input() selectedCategory: string ;
  @Input() filterSearchTextInput: string;
  @Output() matDetailSelectedEv = new EventEmitter<clsMaterial>();

  private eventsSubscription: Subscription=new Subscription();

  constructor(private serv: MaterialService,private srv_statemanage:StateManagerService,private modalService: NgbModal,private srv_appsetting:AppsettingService
    ,private router: ActivatedRoute ) { 
      this.eventsSubscription.add(this.router.params.subscribe(params => {
        this.lang = params["lang"];
        if (!this.lang){
          this.lang = this.srv_appsetting.Lang
          if (!this.lang)
            this.lang = "EN"
        }
          
        }));
    }

  ngOnInit() {
    let myColumns1 = [5,6,7,8];
    let myColumns2 = [];
    let sortHardnessCol1 = 9;
    let sortHardnessCol2 = 5;

    this.dtOptionsMat = {
      pagingType: 'full_numbers',
       "searching": false,
       "lengthChange": false ,
       "paging":false,  
       "autoWidth":false,
       "scrollY": '65vh',
       "scrollCollapse" : true,
       "columnDefs":[{"targets": environment.internal ? myColumns1 : myColumns2,"orderable": false},{ targets: environment.internal ? sortHardnessCol1 : sortHardnessCol2, type: 'num' }, { "iDataSort": environment.internal ? sortHardnessCol1 : sortHardnessCol2, "aTargets": [ 4 ] }],
       "language": {
        "emptyTable": "",
        "zeroRecords": "",
        "infoEmpty": "",
        "info": ""
      } 
            
      }; 

  }


  // initHardness(mat:clsMaterial){
  //   mat.HardnessOrigin = mat.Hardness;
  // }
  // ngAfterContentInit(){
  //   this.isDtInitializedFunc();
  // }


  fillMainTable(){
    this.allSubsMat$ = this.serv.getmaterialsbygrp(this.lang,this.selectedCategory)
    .subscribe((data: any) => {
      this.materialsResult = JSON.parse(data);
      this.materialsResultSorted = this.materialsResult;
      this.materialsResultFilterd = this.materialsResult;
      // this.filterTable();
      if (this.srv_statemanage.GetMaterialSelected()== null)
          this.OnSelectMaterial(this.materialsResult[6]);
       else
          this.selectedMaterial = this.srv_statemanage.GetMaterialSelected().group;
          
       this.isDtInitializedFunc();


    });

    // this.serv.getmaterialsbygrp('EN',this.selectedCategory).subscribe((res:any)=>{
    //   this.materialsResult=JSON.parse(res);
    //   this.materialsResultFilterd = this.materialsResult;
    //   this.filterTable();
    //   if (this.srv_statemanage.GetMaterialSelected()== null)
    //       this.selectedMaterial = "";
    //    else
    //       this.selectedMaterial = this.srv_statemanage.GetMaterialSelected().group;
    // })
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
    if (changes.selectedCategory){
      this.fillMainTable();
    }
    // else{
    //   if (changes.filterSearchTextInput){
    //     this.filterTable();
    //  }
    // }
        

  }

  ngOnDestroy() {
    this.allSubsMat$.unsubscribe();
  }

  filterTable(){
    var searchText = this.filterSearchTextInput;
    if (searchText == null || searchText == ''){
      this.materialsResultSorted = this.materialsResult;
    }
        
    else
         this.materialsResultSorted = this.materialsResult.filter(_ => 
          (_.description.toUpperCase().indexOf(searchText.toUpperCase())>-1) ||
          (_.group.toUpperCase().indexOf(searchText.toUpperCase())>-1) ||
          (_.Condition.toUpperCase().indexOf(searchText.toUpperCase())>-1)
          //  ||
          // (_.Hardness.indexOf(searchText.toUpperCase())>-1)
          ); 

          // this.isDtInitializedFunc();
          // if(this.dtElement.dtInstance){
          //   this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          //     dtInstance.destroy();
          //     this.dtTriggerMat.next();
          //   });
          // }


          // if(this.firstInt)
          // this.isDtInitializedFunc();

          // if (!this.firstInt)
          // this.firstInt = true;

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
    modalRef.componentInstance.modal_group = this.selectedCategory + mat.group;
/*     modalRef.componentInstance.my_modal_title = 'I your title';
    modalRef.componentInstance.my_modal_content = 'I am your content'; */
  }

  openAddToFavM(mat:clsMaterial) {
    const modalRef = this.modalService.open(PpAddFavoritComponent, { centered: true });
    modalRef.componentInstance.modal_group = this.selectedCategory + mat.group;
  }

  openEditParamsM(mat:clsMaterial) {
    if (!mat.HardnessOrigin)
      mat.HardnessOrigin = mat.Hardness;
    const modalRef = this.modalService.open(PpEditParamsComponent, { centered: true });
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
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTriggerMat.next();
          });
        }
      }
      }, () => console.log('Rejected!'));
  }

}
