import { Component, OnInit, Input,SimpleChanges,ViewChild,OnDestroy,DoCheck } from '@angular/core';
import { MaterialService } from 'src/app/services/material.service'
import { StateManagerService } from 'src/app/services/statemanager.service' ;
import { clsMaterial } from 'src/app/models/materials/material'
import { environment } from 'src/environments/environment';
import { DataTableDirective } from 'angular-datatables';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-mat-details',
  templateUrl: './mat-details.component.html',
  styleUrls: ['./mat-details.component.scss','../materials.component.scss']
})
export class MatDetailsComponent implements OnInit, OnDestroy,DoCheck {
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  dtTriggerMat: Subject<any> = new Subject();
  allSubsMat$: Subscription;
  isDtInitialized:boolean = false;
  dtOptionsMat: any = {};
  detailsResult:any;
  headers:any;
  selectedMaterialCls:clsMaterial;
  selectedMatOrGrp:String = "";
  environment=environment;
  curPage:number;
  lastPage:number;
  curShownColumns:number[];
  @Input() selectedMaterial: clsMaterial ;

  constructor(private serv: MaterialService,private srv_statemanage:StateManagerService) { }

  ngOnInit() {

    this.dtOptionsMat = {
      pagingType: 'full_numbers',
       "searching": false,
       "lengthChange": false ,
       "paging":false,  
       "autoWidth":false,
       "scrollY": 'calc(100vh - 355px)',
       "info":false,
       "scrollCollapse" : true,
       "language": {
        "emptyTable": "",
        "zeroRecords": "",
        "infoEmpty": "",
        "info": ""
      } 
            
      }; 
    

    // this.fillDetailsTable();
  }

  fillDetailsTable(){
    this.curPage = 0;
    this.curShownColumns = [1,2,3,4,5,6,7,8];
    this.allSubsMat$ = this.serv.getmaterialsdetails(this.selectedMaterial.id).subscribe((res:any)=>{
      this.detailsResult =JSON.parse(res);
      this.headers = Object.keys(this.detailsResult[0]);
      this.lastPage = Math.ceil(this.headers.length / 8) - 1;
      this.selectedMaterialCls = this.srv_statemanage.GetMaterialSelected();
      if (this.selectedMaterialCls && this.selectedMaterialCls.group == this.selectedMaterial.group && this.selectedMaterialCls.material && this.selectedMaterialCls.material != ""){
          this.selectedMatOrGrp = this.selectedMaterialCls.material;
      }
      this.isDtInitializedFunc();
    });
      
      var a = 0;
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
    this.fillDetailsTable();
  }

  OnSelectMaterial(mat:string)
  {   
    this.selectedMaterialCls= new clsMaterial(this.selectedMaterial.group,this.selectedMaterial.desc,mat,this.selectedMaterial.Category,this.selectedMaterial.HardnessHBValue);
    this.srv_statemanage.SelectMaterial(this.selectedMaterialCls);
    this.srv_statemanage.GoOperationTab =true;

  }

  ngOnDestroy() {
    this.allSubsMat$.unsubscribe();
  }

  Next(){
    this.curPage = this.curPage + 1;
    this.setCurVisColumns();
  }

  Previous(){
    this.curPage = this.curPage - 1;
    this.setCurVisColumns();
  }

  setCurVisColumns(){
    let nextPageStart:number = this.curPage * 8;
    this.curShownColumns = [nextPageStart + 1,nextPageStart + 2,nextPageStart + 3,nextPageStart + 4,nextPageStart + 5,nextPageStart + 6,nextPageStart + 7,nextPageStart + 8];
  //   setTimeout(function(){
  //     if(true){
  //     this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //       dtInstance.columns.adjust();
  //       this.dtTriggerMat.next();
  //     });
  // }}, 1000);
  }
  
  ngDoCheck(){}

}
