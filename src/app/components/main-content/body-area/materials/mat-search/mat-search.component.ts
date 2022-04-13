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
import {MachinesPpLoginComponent} from      'src/app/components/main-content/body-area/machines/machines-pp-login/machines-pp-login.component';
import { NgxSpinnerService } from "ngx-spinner"; 
import { LoginService } from 'src/app/services/login.service';
import { AppsettingService} from 'src/app/services/appsetting.service';
import { StringDecoder } from 'string_decoder';

@Component({
  selector: 'app-mat-search',
  templateUrl: './mat-search.component.html',
  styleUrls: ['./mat-search.component.scss','../materials.component.scss']
})
export class MatSearchComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  dtOptionsMat: any = {};
  materialsResult:clsMaterial[]=[];
  materialsResultFilterd:clsMaterial[]=[];
  materialsResultSorted:clsMaterial[]=[];
  selectedMaterial:string;
  FavName:String;
  environment = environment;
  dtTriggerMat: Subject<any> = new Subject();
  allSubsMat$: Subscription;
  isDtInitialized:boolean = false;
  firstInt:boolean = false;
  _timeout: any = null;

  @Input() filterSearchTextInput: string;
  @Output() myMaterialClickEv = new EventEmitter<clsMaterial>();
  @Output() OpenMaterialStandard = new EventEmitter<{material: clsMaterial,searchtext: string}>();
  constructor(private serv: MaterialService,private srv_statemanage:StateManagerService,private modalService: NgbModal,private SpinnerService: NgxSpinnerService,private srv_login:LoginService,private srv_appsetting:AppsettingService) { }

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
       "scrollY": 'calc(100vh - 355px)',
       "info":false,
       "scrollCollapse" : true,
       "columnDefs":[{"targets": environment.internal ? myColumns1 : myColumns2,"orderable": false},{ targets: environment.internal ? sortHardnessCol1 : sortHardnessCol2, type: 'num' }, { "iDataSort": environment.internal ? sortHardnessCol1 : sortHardnessCol2, "aTargets": [ 5 ] }],
       "language": {
        "emptyTable": "No data available in table",
        "zeroRecords": "",
        "infoEmpty": "",
        "info": "",
        "order": [[ 2, 'asc' ]] 
      } 
            
      }; 

  }


  fillMainTable(){
    this.SpinnerService.show();
    this.allSubsMat$ = this.serv.searchmaterial(this.filterSearchTextInput)
    .subscribe((data: any) => {
      this.materialsResult = JSON.parse(data);
      this.materialsResultSorted = this.materialsResult;
      this.materialsResultFilterd = this.materialsResult;
      if (this.srv_statemanage.GetMaterialSelected()== null){
        this.selectedMaterial = "";
        this.FavName = ""
      }    
       else{
        this.selectedMaterial = this.srv_statemanage.GetMaterialSelected().material;
        this.FavName = this.srv_statemanage.GetMaterialSelected().FavName;
       }
          
          
       this.isDtInitializedFunc();
       this.SpinnerService.hide();
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
      // this._timeout  = null;
      if(this._timeout){ //if there is already a timeout in process cancel it
        window.clearTimeout(this._timeout);
      }
      this._timeout = window.setTimeout(() => {
         this._timeout = null;
         this.fillMainTable();
      },1000);
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
    this.FavName = ""
    this.srv_statemanage.SelectMaterial(mat);
    this.srv_statemanage.GoOperationTab =true;

  }

  addToFavorites(){
    let a =0;
  }
  
  setAsDefault(){
    let a =0;
  }

  openAddToFavM(mat:clsMaterial) {
    if(this.srv_appsetting.UserID=='')
    {
      //alert('Only for registered user');
      const modalRef = this.modalService.open(MachinesPpLoginComponent, { centered: true });
      modalRef.componentInstance.title = "Add To My Materials";
      modalRef.componentInstance.Msg = 'Please login to add the material to "My Materials"';
      //modalRef.componentInstance.MachineName = mach.MachineName;
      modalRef.result.then((result) => {
        if(result=='cancel') return;
        if(result=='login')
        {
          this.SpinnerService.show();
          this.srv_login.GetToken().subscribe(res=>{this.SpinnerService.hide();}); 
          return;
        }});
      
    } 
    else{
      const modalRef = this.modalService.open(PpAddFavoritComponent, { centered: true });
      modalRef.componentInstance.modal_group = mat.Category + mat.group + ' ' + mat.material;
      modalRef.componentInstance.selectedMat = mat;
      modalRef.componentInstance.edit = false;

      modalRef.result.then((result) => {
        if(result=='GoToMyMaterials')
        {
          this.goToMyMaterial();
          return;
        }});

    }

  }

  goToMyMaterial(){
    this.myMaterialClickEv.emit();
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
      //console.log(result);
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

  OpenMaterialStandarts(m:clsMaterial)
  {
    //alert();
    this.OpenMaterialStandard.emit({material :m,searchtext:m.material})
    //this.curSelectedCategory = "All";
    //this.selectDisabled = true;
  //}
    //  this.standardSelected = '';
      //this.MaterialSearchChanged.emit(this.searchText);   

  }


}
