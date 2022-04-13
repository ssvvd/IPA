import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter, OnDestroy,ViewChild  } from '@angular/core';
import { clsMaterial } from 'src/app/models/materials/material'
import { MaterialService } from 'src/app/services/material.service'
import { MaterialsmService } from 'src/app/services/materialsm.service'
import { StateManagerService } from 'src/app/services/statemanager.service' ;
import { AppsettingService} from 'src/app/services/appsetting.service';
import { CookiesService } from 'src/app/services/cookies.service';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { ActivatedRoute} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {PpSetDefaultComponent} from 'src/app/components/main-content/body-area/materials/pp-set-default/pp-set-default.component';
import {PpAddFavoritComponent} from 'src/app/components/main-content/body-area/materials/pp-add-favorit/pp-add-favorit.component';
import {PpEditParamsComponent} from 'src/app/components/main-content/body-area/materials/pp-edit-params/pp-edit-params.component';
import {MachinesPpLoginComponent} from      'src/app/components/main-content/body-area/machines/machines-pp-login/machines-pp-login.component';
import { NgxSpinnerService } from "ngx-spinner"; 
import { LoginService } from 'src/app/services/login.service';
import { Subject, Subscription } from 'rxjs';
import 'rxjs/add/operator/catch'

@Component({
  selector: 'app-mat-main-table',
  templateUrl: './mat-main-table.component.html',
  styleUrls: ['./mat-main-table.component.scss','../materials.component.scss']
})
export class MatMainTableComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective;

  dtOptionsMat: any = {};
  materialsResult:clsMaterial[]=[];
  materialsResultFilterd:clsMaterial[]=[];
  materialsResultSorted:clsMaterial[]=[];
  selectedMaterial:string;
  FavMat:String;
  environment = environment;
  dtTriggerMat: Subject<any> = new Subject();
  allSubsMat$: Subscription;
  isDtInitialized:boolean = false;
  firstInt:boolean = false;
  lang:string;
  DefaultMat:number = 0;
  @Input() selectedCategory: string ;
  @Input() filterSearchTextInput: string="";
  @Output() matDetailSelectedEv = new EventEmitter<clsMaterial>();
  @Output() myMaterialClickEv = new EventEmitter<clsMaterial>();

  @Output() MaterialSearchChangedMobile = new EventEmitter<String>();

  Group:string='P';
  SearchTextMobile:string="";
  
  private eventsSubscription: Subscription=new Subscription();

  constructor(public translate: TranslateService,private servsm: MaterialsmService,private serv: MaterialService,private srv_statemanage:StateManagerService,private modalService: NgbModal,public srv_appsetting:AppsettingService
    ,private router: ActivatedRoute ,private srv_login:LoginService,private SpinnerService: NgxSpinnerService,private srv_cook:CookiesService) { 
      this.eventsSubscription.add(this.router.params.subscribe(params => {
        this.lang = params["lang"];
        if (!this.lang){
          this.lang = this.srv_appsetting.Lang
          if (!this.lang)
            this.lang = "EN"
        } 
          
        }));
        if(!environment.internal)
        {
          if(localStorage.getItem("language")!=null && localStorage.getItem("language")!='')
            this.lang = localStorage.getItem("language");
          else
          this.lang ='EN';
        }
    }

  ngOnInit() {


    let scrollYdiff :string;
    if(!this.srv_appsetting.isMobileResolution) 
      scrollYdiff='355px';  
    else
     scrollYdiff='250px'; 

    let myColumns1 = [5,6,7,8];
    let myColumns2 = [];
    let sortHardnessCol1 = 9;
    let sortHardnessCol2 = 5;
    let aTargets:number=4;
    if(this.srv_appsetting.isMobileResolution)  sortHardnessCol2=0;
    if(this.srv_appsetting.isMobileResolution)  aTargets=0;

    this.dtOptionsMat = {
      destroy: true,
      pagingType: 'full_numbers',
       "searching": false,
       "lengthChange": false ,
       "paging":false,  
       "autoWidth":false,      
       "scrollY": 'calc(100vh - '+ scrollYdiff +')',      
       "info":false,
       "scrollCollapse" : true,
       "order": [[ 0, 'asc' ]],
       "columnDefs":[{"targets": environment.internal && !this.srv_appsetting.isMobileResolution? myColumns1 : myColumns2,"orderable": false},{ targets: environment.internal && !this.srv_appsetting.isMobileResolution? sortHardnessCol1 : sortHardnessCol2, type: 'num' }, { "iDataSort": environment.internal && !this.srv_appsetting.isMobileResolution? sortHardnessCol1 : sortHardnessCol2, "aTargets": [ aTargets ] }],
       "language": {
        "emptyTable": "",
        "zeroRecords": "",
        "infoEmpty": "",
        "info": ""
      } 
            
      }; 


      if(this.srv_cook.get_cookie("def_mat")!='')
      this.DefaultMat =+this.srv_cook.get_cookie("def_mat"); 

  }


  // initHardness(mat:clsMaterial){
  //   mat.HardnessOrigin = mat.Hardness;
  // }
  // ngAfterContentInit(){
  //   this.isDtInitializedFunc();
  // }


  fillMainTable(){

    
    if(this.srv_appsetting.isMobileResolution)
    {
      if(this.selectedCategory==undefined && this.srv_statemanage.GetMaterialSelected()==null) 
        this.selectedCategory ='P';
      else 
        if(this.selectedCategory==null) 
          this.selectedCategory = this.srv_statemanage.GetMaterialSelected().Category;      
    }
    

    if (this.servsm.checkCategoryTableExists(this.lang,this.selectedCategory)){
      this.setResults(this.servsm.getCategoryTable(this.lang,this.selectedCategory),false)
    }
    else{
      this.allSubsMat$ = this.serv.getmaterialsbygrp(this.lang,this.selectedCategory)
      .subscribe((data: any) => {
        this.servsm.setNewCategoryTable(this.lang,this.selectedCategory,JSON.parse(data))
        this.setResults(this.servsm.getCategoryTable(this.lang,this.selectedCategory),true) 
      });    
    } 

  }


  sort_arr(a:clsMaterial,b:clsMaterial)
  {
          
      if(a.group == this.selectedMaterial && b.group != this.selectedMaterial) return -1;
      if(b.group == this.selectedMaterial && a.group != this.selectedMaterial) return 1;
      
      return 0;
  }

  fillMainTableMobile(){    
    

    if(this.filterSearchTextInput!="" && this.filterSearchTextInput!=null  && this.filterSearchTextInput!=undefined)
    {
      this.srv_appsetting.IsSearchMaterial=true;
      this.SpinnerService.show();
      this.allSubsMat$ = this.serv.searchmaterial(this.filterSearchTextInput)
      .subscribe((data: any) => {
        if(data=='e')
        {
          this.clearData();
          this.SpinnerService.hide();  
        }                  
        else
        { 
        this.materialsResult = JSON.parse(data);
        //this.materialsResultSorted = this.materialsResult;

        this.materialsResultSorted=this.materialsResult.sort((a,b)=> this.sort_arr(a,b));  
        this.materialsResultFilterd = this.materialsResult;
        if (this.srv_statemanage.GetMaterialSelected()== null || this.srv_statemanage.GetMaterialSelected()== undefined){
          this.selectedMaterial = "";
          //this.FavName = ""
        }    
        else{
          this.selectedMaterial = this.srv_statemanage.GetMaterialSelected().group;
          //this.FavName = this.srv_statemanage.GetMaterialSelected().FavName;
        }
            
            
        //this.isDtInitializedFunc();
        this.srv_appsetting.IsSearchMaterial=false;
        this.SpinnerService.hide();
      }
    }
    ); 
    }
    else{

      
        if(this.selectedCategory==undefined && this.srv_statemanage.GetMaterialSelected()==null) 
          this.selectedCategory ='P';
        else 
          if(this.selectedCategory==null) 
            this.selectedCategory = this.srv_statemanage.GetMaterialSelected().Category;      
        
        this.allSubsMat$ = this.serv.getmaterialsbygrp(this.lang,this.selectedCategory)
        .subscribe((data: any) => {
          this.servsm.setNewCategoryTable(this.lang,this.selectedCategory,JSON.parse(data))
          this.setResultsMobile(this.servsm.getCategoryTable(this.lang,this.selectedCategory),true) 
        });    
    
    }

  }

  clearData(){
    this.materialsResult = [];
    this.materialsResultSorted = [];
    this.materialsResultFilterd = [];
  }

  setResults(data:clsMaterial[],initTable:boolean){
    this.clearData();
    this.materialsResult = data.slice();
    this.materialsResultSorted = this.materialsResult.slice();
    
    this.materialsResultFilterd = this.materialsResult.slice();
    // this.filterTable();
    if (this.srv_statemanage.GetMaterialSelected()== null){
      
      if (this.DefaultMat != 0){
        let defMat:clsMaterial = this.materialsResult.find(x => x.id === this.DefaultMat)
        if(defMat)
          this.OnSelectMaterial(defMat);
          else
          this.OnSelectMaterial(this.materialsResult[6]);
      }
      else
      this.OnSelectMaterial(this.materialsResult[6]);
      this.materialsResultSorted=this.materialsResultSorted.slice().sort((a,b)=> this.sort_arr(a,b));  
     
    }
        
     else{
      this.selectedMaterial = this.srv_statemanage.GetMaterialSelected().group;
      this.materialsResultSorted=this.materialsResultSorted.slice().sort((a,b)=> this.sort_arr(a,b));  
     
      this.FavMat = this.srv_statemanage.GetMaterialSelected().FavName || ''
     }
        
        if(initTable) 
            this.isDtInitializedFunc();
        else
        this.dtTriggerMat = null

  }

  setResultsMobile(data:clsMaterial[],initTable:boolean){
    this.clearData();
    this.materialsResult = data.slice();
    this.materialsResultSorted = this.materialsResult.slice();
    this.materialsResultSorted=this.materialsResultSorted.sort((a,b)=> this.sort_arr(a,b));  
    this.materialsResultFilterd = this.materialsResult.slice();
    // this.filterTable();
    if (this.srv_statemanage.GetMaterialSelected()== null){
      
      if (this.DefaultMat != 0){
        let defMat:clsMaterial = this.materialsResult.find(x => x.id === this.DefaultMat)
        if(defMat)
          this.OnSelectMaterial(defMat);
          else
          this.OnSelectMaterial(this.materialsResult[6]);
      }
      else
      this.OnSelectMaterial(this.materialsResult[6]);
      
     
    }
        
     else{
      this.selectedMaterial = this.srv_statemanage.GetMaterialSelected().group;
      this.FavMat = this.srv_statemanage.GetMaterialSelected().FavName || ''
     }
        
       /*  if(initTable) 
            this.isDtInitializedFunc();
        else
        this.dtTriggerMat = null */

  }

  isDtInitializedFunc(){
    
    if (this.isDtInitialized){
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        if(this.dtTriggerMat!=null)this.dtTriggerMat.next();
      });
    }
    else{
        this.isDtInitialized = true;
        if(this.dtTriggerMat!=null) this.dtTriggerMat.next();
        //this.dtTriggerMat.next();
    }
  }

  ngOnChanges(changes:SimpleChanges) {
    if (changes.selectedCategory){
      this.fillMainTable();
    }
  }
  

  ngOnDestroy() {
    if (this.allSubsMat$)
    this.allSubsMat$.unsubscribe();
  }


  FilterChangeMobile() {   
      this.fillMainTableMobile();
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
          
          );          
  }

  matDetailClick(material: clsMaterial) {
    this.OnSelectMaterial(material)
    this.matDetailSelectedEv.emit(material);
  }
 
  goToMyMaterial(){
    this.myMaterialClickEv.emit();
  }

  OnSelectMaterial(mat:clsMaterial)
  {   
    this.selectedMaterial = mat.group;
    this.FavMat = '';
    this.srv_statemanage.SelectMaterial(mat);
    this.srv_statemanage.GoOperationTab =true;

  }

  addToFavorites(){
    let a =0;
  }
  
  setAsDefault(){
    let a =0;
  }
  openSetDefaultModal(mat:clsMaterial) {
    this.srv_cook.set_cookie("def_mat",mat.id.toString());
    this.DefaultMat=mat.id;

    mat.isDefault = true;
    this.OnSelectMaterial(mat);
    // const modalRef = this.modalService.open(PpSetDefaultComponent, { centered: true });
    // modalRef.componentInstance.modal_group = this.selectedCategory + mat.group;
  }

  openAddToFavM(mat:clsMaterial) {
    if(this.srv_appsetting.UserID=='')
    {
      //alert('Only for registered user');
      const modalRef = this.modalService.open(MachinesPpLoginComponent, { centered: true });
      modalRef.componentInstance.title = "Add To My Materials";
      modalRef.componentInstance.Msg = 'Please login to add the material to My Materials';
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
    modalRef.componentInstance.modal_group = this.selectedCategory + mat.group;
    modalRef.componentInstance.selectedMat = mat;
    modalRef.componentInstance.edit = false;
    //GoToMyMaterials
    modalRef.result.then((result) => {
      if(result=='GoToMyMaterials')
      {
        this.goToMyMaterial();
        return;
      }});
  }
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
          if(mat.HardnessUnits=='HB')  
            mat.HardnessHBValue = spletter[0];
          else
           mat.HardnessHBValue = spletter[2];
          //this.isDtInitializedFunc();
      /*     this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();           
             this.dtTriggerMat.next();
          }); */
        }
      }
      }, () => console.log('Rejected!'));
  }

  ApplyFilterMobile(group:string)
  {
    this.filterSearchTextInput ="";
    this.selectedCategory=group; 
    this.fillMainTableMobile();    
  }
  
}
