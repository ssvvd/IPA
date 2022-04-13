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
  SelectedStandard:String='';
  SelectedTxet:String='';
  SelectedIndexRow:number;

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
        //,
        //"order": [ 3, 'asc' ]
      }             
      };     
     //this.fillDetailsTable();
  }

  fillDetailsTable(){
    this.curPage = 0;
    this.curShownColumns = [1,2,3,4,5,6,7,8];
    this.allSubsMat$ = this.serv.getmaterialsdetails(this.selectedMaterial.id).subscribe((res:any)=>{
      //this.detailsResult =JSON.parse(res);  
      let detailsResult1 = JSON.parse(res);     
      this.headers = Object.keys(detailsResult1[0]);
      if(this.srv_statemanage.SelectedMatText!='')
      {
        let iii:number= (this.headers.findIndex (i => i.indexOf(this.srv_statemanage.SelectedMatStandard.trim())>-1));
        let indexrow:number=1;
        let minGWCNUM:number;
        for(let o of detailsResult1)
        {                
          if(indexrow==1) minGWCNUM = o.GWCNUM;
          let v:string=o[this.headers[iii]];   
              
          if(v.trim().indexOf(this.srv_statemanage.SelectedMatText)>-1)
          {
            this.SelectedIndexRow=indexrow;
            o.numberrow=0;
            o.GWCNUM= minGWCNUM-1;
            
          }
          else
            o.numberrow= indexrow;       

          indexrow++;
        }
        this.detailsResult = JSON.parse(JSON.stringify(detailsResult1.sort((one, two) => (one.numberrow<two.numberrow? -1 : 1))));
      }
      else
        this.detailsResult =detailsResult1;
      //this.detailsResult = Object.assign({}, this.detailsResult.sort((one, two) => (one.numberrow<two.numberrow? -1 : 1)));
      //this.detailsResult=this.detailsResult.sort((one, two) => (one.numberrow==this.SelectedIndexRow && two.numberrow!=this.SelectedIndexRow? -1 : 1));       
      //this.detailsResult=this.detailsResult.sort((one, two) => (one.numberrow<two.numberrow? -1 : 1));             
      
      console.log(this.detailsResult);
      this.lastPage = Math.ceil(this.headers.length / 8) - 1;
      this.selectedMaterialCls = this.srv_statemanage.GetMaterialSelected();
      if (this.selectedMaterialCls && this.selectedMaterialCls.group == this.selectedMaterial.group && this.selectedMaterialCls.material && this.selectedMaterialCls.material != ""){
          this.selectedMatOrGrp = this.selectedMaterialCls.material;
      }
      this.isDtInitializedFunc();
          
    });
      
    var a = 0;
  }


  ngAfterViewInit()
  {
    /* var element =document.getElementsByClassName("dataTables_scroll")[0];
    element.scrollTop = 300;
    element =document.getElementsByClassName("dataTables_scrollBody")[0];
    element.scrollTop = 300; */
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

   /*  var element =document.getElementsByClassName("dataTables_scroll")[0];
    element.scrollTop = 500;
    element =document.getElementsByClassName("dataTables_scrollBody")[0];
    element.scrollTop = 500; */
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

  selectfoundmaterial(standard:String,searchtext:string)
  {
    this.SelectedStandard = standard;
    this.SelectedTxet = searchtext; 
    var element =document.getElementById('dtDetails');
    element.scrollTop = 200;
    
    //this.datatable.element.getElementsByTagName('datatable-body')[0].scrollTop = 100;
  }

}
