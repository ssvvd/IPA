import { Component, OnInit,ViewChild, Input, SimpleChanges, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { ResultsService} from 'src/app/services/results.service' ;
import { ResultsStoreService} from 'src/app/services/results-store.service' ;
import { StateManagerService} from 'src/app/services/statemanager.service' ;
import { clsGroups } from 'src/app/models/results/groups';
import { clsProperties } from 'src/app/models/results/properties';
import {clsPropertyValue} from 'src/app/models/results/property-value';
import {clsHelpProp} from 'src/app/models/results/help-prop';
import { AppsettingService} from 'src/app/services/appsetting.service';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from "ngx-spinner"; 
import { Subject, Subscription, forkJoin } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {PpSelectColumnsComponent} from 'src/app/components/main-content/body-area/results/pp-select-columns/pp-select-columns.component';
import {ResultPpDownloadComponent} from 'src/app/components/main-content/body-area/results/result-pp-download/result-pp-download.component';
import { DownloadresultService} from 'src/app/services/downloadresult.service';
import { ResultPpInventoryComponent } from 'src/app/components/main-content/body-area/results/result-pp-inventory/result-pp-inventory.component';

@Component({
  selector: 'app-results-table',
  templateUrl: './results-table.component.html',
  styleUrls: ['./results-table.component.scss']
})
export class ResultsTableComponent implements OnInit {
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject();
  allSubs$: Subscription;
  environment = environment;
  dtOptions: any = {};
  dtRsults:object[];
  dtRsultsVisble:object[];
  dtFullTable:object[];
  dtPropertiesTable:clsProperties[];
  dtPropertiesTableVisible:clsProperties[];
  dtGroups:clsGroups[];
  promotionFamilies:string[]=[]
  dtDefaultFields:string[]=[]
  arrCurShownFields:string[]=[]
  dtResultsObjects:clsPropertyValue[][];
  dtResultsObjects3d:clsPropertyValue[][][];
  dtResultsObjects3dToShow:clsPropertyValue[][][]
  dtResultsObjectsHelp:clsHelpProp[]=[];
  dtResultShow:any;
  headers:clsProperties[] = [];
  headersOrig:clsProperties[] = [];
  arrResult:string[];
  arrResultImgsItem:string[]=[];
  arrResultImgsFamily:string[]=[];
  arrResultImgsAll:any;
  ErrMsg:string="";
  lasTypeFeed:string="";
  sortProp:string="";

  @Input() filterChangedRec: any ;
  @Output() goToViewEvent = new EventEmitter<any>();
  
  constructor(public translate: TranslateService,private srv_Results:ResultsService,private srv_StMng:StateManagerService,private srv_appsetting:AppsettingService,
    private SpinnerService: NgxSpinnerService,private modalService: NgbModal,private cdr: ChangeDetectorRef, 
    private srv_ResultsStore :ResultsStoreService,private srv_down:DownloadresultService) { }

  ngOnInit() {
     this.dtOptions = {
      pagingType: 'full_numbers',
       "searching": false,
       "lengthChange": false ,
       "paging":false,  
       "autoWidth":false,
      //  "scrollY": '65vh',
       "scrollCollapse" : true,
       "language": {
        "emptyTable": "",
        "zeroRecords": "",
        "infoEmpty": "",
        "info": ""
      }           
  }; 

  this.lasTypeFeed == 'BothFeed';
  this.sortProp = 'index';
  this.GetResult();
  }

  GetResult() 
  {
       
      this.getShowTable()
  }

getShowTable(){
  this.SpinnerService.show(); 
  if (this.srv_ResultsStore.checkChanged(this.srv_StMng.SecApp,this.srv_appsetting.Units,this.srv_StMng.IPLChanged))
  {
    this.srv_ResultsStore.setParams(this.srv_StMng.SecApp,this.srv_appsetting.Units,this.srv_StMng.IPLChanged)
  this.allSubs$ = forkJoin(
          this.srv_Results.getresults(this.srv_StMng.SecApp,this.srv_appsetting.Units,this.srv_StMng.IPLChanged),
          this.srv_Results.getoolproperties(this.srv_StMng.SecApp,this.srv_appsetting.Units,this.srv_StMng.IPLChanged),
          this.srv_Results.getgroups(this.srv_StMng.SecApp),
          this.srv_Results.getdefaultfields(this.srv_StMng.SecApp),
          this.srv_Results.Getfamilymovies(),
          this.srv_Results.GetPromotionFamilies()
        )
        .subscribe(([res1, res2, res3, res4,res5, res6]:[any,any,any,any,any,any]) => {
          this.srv_ResultsStore.setResults(res1, res2, res3, res4,res5, res6)
          this.renderTable(res1, res2, res3, res4,res5, res6)
        // let a =0
        });
      }
      else{
        this.renderTable(this.srv_ResultsStore.getRes1(), this.srv_ResultsStore.getRes2(), this.srv_ResultsStore.getRes3(), this.srv_ResultsStore.getRes4(),this.srv_ResultsStore.getRes5(), this.srv_ResultsStore.getRes6())
      }
}


renderTable(res1:any, res2:any, res3:any, res4:any,res5:any, res6:any){
  if (res1 == 'Error'){
    this.SpinnerService.hide();
    return;
  }
  this.dtRsults =JSON.parse(res1);
  this.dtPropertiesTable = JSON.parse(res2); 
  this.dtGroups = JSON.parse(res3);
  this.dtDefaultFields = JSON.parse(res4); 
  this.arrResultImgsAll = JSON.parse(res5);
  var obj = JSON.parse(res6);
  this.promotionFamilies = obj.map(ele=>ele.GFNUM);

  if (this.dtRsults.length < 1){
    this.SpinnerService.hide();
    return;
  }
  this.arrCurShownFields = this.dtDefaultFields 
  var columnsCount = this.dtPropertiesTable.length
  var rowsCount = this.dtRsults.length

  this.dtResultsObjects = []
  var groupsOrder:number [] =[]
  let index:number = 0;
  for(var i: number = 0; i < rowsCount; i++) {
      this.dtResultsObjects[i] = [];
      this.dtResultsObjectsHelp[i] = new clsHelpProp(this.srv_Results,i);           
      index = 0

      for(var j: number = 0; j< columnsCount; j++) {
        
        //Build Helper
        if (this.dtPropertiesTable[j].FieldDescriptionSmall == 'Average Usage')
        this.dtResultsObjectsHelp[i].AverageUse = this.dtRsults[i][Object.keys(this.dtRsults[i])[j]];

        if (this.dtPropertiesTable[j].Field.toLowerCase() == 'kappaleadangle')
        this.dtResultsObjectsHelp[i].kappaLeadAngle = this.dtRsults[i][Object.keys(this.dtRsults[i])[j]];

        if (this.dtPropertiesTable[j].Field == 'DetailsIsExpand'){
          if (rowsCount < 4)
          this.dtResultsObjectsHelp[i].IsExpand = "True";
          else
          this.dtResultsObjectsHelp[i].IsExpand = this.dtRsults[i][Object.keys(this.dtRsults[i])[j]];
          this.filterRecommended(this.dtResultsObjectsHelp[i]);
        }
        
        if (this.dtPropertiesTable[j].FieldDescriptionSmall == 'Brand Name')
        this.dtResultsObjectsHelp[i].BrandName.push(this.dtRsults[i][Object.keys(this.dtRsults[i])[j]]);

        if (this.dtPropertiesTable[j].Field.toLowerCase().includes('info'))
        this.dtResultsObjectsHelp[i].info.push(this.dtRsults[i][Object.keys(this.dtRsults[i])[j]]);

        if (this.dtPropertiesTable[j].FieldDescriptionSmall == 'Family'){
          if (this.promotionFamilies.indexOf(this.dtRsults[i][Object.keys(this.dtRsults[i])[j]]) > -1){
            this.dtResultsObjectsHelp[i].Promotion = true;
          }            
        }
        

        if (this.dtPropertiesTable[j].Field == 'SecondaryAppOrig1')
        this.dtResultsObjectsHelp[i].SecondaryAppOrig1 = this.dtRsults[i][Object.keys(this.dtRsults[i])[j]];


       if (this.dtPropertiesTable[j].Field == 'ItemType'){
          this.dtResultsObjectsHelp[i].itemTypeRes = this.dtRsults[i][Object.keys(this.dtRsults[i])[j]]
        }


        if (this.dtPropertiesTable[j].Field.toLowerCase().includes('catalogno') && this.dtRsults[i][Object.keys(this.dtRsults[i])[j]]){
          let catNo:string = this.dtRsults[i][Object.keys(this.dtRsults[i])[j]]
          this.dtResultsObjectsHelp[i].CatalogNo.push(catNo);  
          this.dtResultsObjectsHelp[i].GroupText.push(this.dtPropertiesTable[j].GroupText); 

          let index:number = i
          this.srv_Results.getitemtype(catNo).subscribe((res: any) => {
            let typeRes:object[] = JSON.parse(res)
            let type:string = typeRes[0]['ItemType'] || ''
            let family:string= typeRes[0]['Family'] || ''
            let catNoLoc:number = this.dtResultsObjectsHelp[index].CatalogNo.indexOf(catNo)
            this.dtResultsObjectsHelp[index].itemType.splice(catNoLoc, 0, type); 
            this.dtResultsObjectsHelp[index].Families.splice(catNoLoc, 0,family); 
             switch (type){
              //  case 'H':
              //   if (this.srv_StMng.SecApp == '57' && this.dtResultsObjectsHelp[index].GroupText[catNoLoc] == 'Tool'){
              //     this.dtResultsObjectsHelp[index].GroupText[catNoLoc] = 'Shank'
              //   }
              //  break;
               case 'T':
                this.dtResultsObjectsHelp[index].CatalogNoT.push(catNo);
                this.dtResultsObjectsHelp[index].DesgT.push(this.dtResultsObjectsHelp[index].Designation[catNoLoc]);

                var url:string = environment.eCatItemPictures + catNo.toString().trim() + ".gif ";
                this.arrResultImgsItem.splice(index, 0,url);
                this.dtResultsObjectsHelp[index].itemImg = url

                let toolFamily = family.toString().trim()
                let curFamilyPic = this.arrResultImgsAll.find(i => i['Family'] == toolFamily);
                if (curFamilyPic)
                toolFamily = curFamilyPic['GFPIC'];

                  var url:string = environment.eCatFamilyPictures + toolFamily.toString().trim() + ".gif ";
                  this.arrResultImgsFamily.splice(index, 0,url);
                  this.dtResultsObjectsHelp[index].familyImg = url

                break;
               case 'I': 
                this.dtResultsObjectsHelp[index].CatalogNoSI.push(catNo);
                this.dtResultsObjectsHelp[index].DesgSI.push(this.dtResultsObjectsHelp[index].Designation[catNoLoc]);
                // if (catNoLoc > 0 && this.dtResultsObjectsHelp[index].itemType[catNoLoc - 1] == 'T'){

                // }
                break;
                case 'S':
                  this.dtResultsObjectsHelp[index].CatalogNoSI.push(catNo);
                  this.dtResultsObjectsHelp[index].DesgSI.push(this.dtResultsObjectsHelp[index].Designation[catNoLoc]);
                  this.dtResultsObjectsHelp[index].DesgS.push(this.dtResultsObjectsHelp[index].Designation[catNoLoc]);
                  
                  if (this.arrResultImgsItem.length < index + 1){
                    var url:string = environment.eCatItemPictures + catNo.toString().trim() + ".gif ";
                    this.arrResultImgsItem.splice(index, 0,url);
                    this.dtResultsObjectsHelp[index].itemImg = url

                    let curFamilyPic = this.arrResultImgsAll.find(i => i['Family'] == family.toString().trim());
                    if (curFamilyPic)
                      family = curFamilyPic['GFPIC'];

                      var url:string = environment.eCatFamilyPictures + family.toString().trim() + ".gif ";
                      this.arrResultImgsFamily.splice(index, 0,url);
                      this.dtResultsObjectsHelp[index].familyImg = url
                  }
                  
                  // if (this.srv_StMng.SecApp == '57'){
                  //   this.dtResultsObjectsHelp[index].GroupText[catNoLoc] = 'Solid Head'
                  // }
                break;
             } 

             this.updateGroupText(type,this.dtResultsObjectsHelp[index].itemTypeRes,this.dtResultsObjectsHelp[index].desgFieldName[catNoLoc],catNoLoc,index,catNo)
          })
        }
          // if (i == 0){
          //   groupsOrder.push(this.dtPropertiesTable[j].GroupID)
          // }            
        //   if (this.dtResultsObjectsHelp[i].itemType == 'H'){
        //     // this.dtResultsObjectsHelp[i].DesgSI.push(this.dtResultsObjectsHelp[i].Designation[this.dtResultsObjectsHelp[i].Designation.length - 1]);
        //     this.dtResultsObjectsHelp[i].CatalogNoSI.push(this.dtResultsObjectsHelp[i].CatalogNo[this.dtResultsObjectsHelp[i].Designation.length - 1]);
        //     // this.dtResultsObjectsHelp[i].DesgS.push(this.dtResultsObjectsHelp[i].Designation[this.dtResultsObjectsHelp[i].Designation.length - 1]);
        //   }
        //   else if (this.dtResultsObjectsHelp[i].itemType == 'T'){
        //     // this.dtResultsObjectsHelp[i].DesgSI.push(this.dtResultsObjectsHelp[i].Designation[this.dtResultsObjectsHelp[i].Designation.length - 1]);
        //     this.dtResultsObjectsHelp[i].CatalogNoSI.push(this.dtResultsObjectsHelp[i].CatalogNo[this.dtResultsObjectsHelp[i].Designation.length - 1]);
        //   }
        // }
        

        if (this.dtPropertiesTable[j].FieldDescriptionSmall == 'Grade'){
          this.dtResultsObjectsHelp[i].Grade[this.dtResultsObjectsHelp[i].CatalogNo.length - 1] =  this.dtRsults[i][Object.keys(this.dtRsults[i])[j]]
        }
        

        if (this.dtPropertiesTable[j].Field == 'ShankDiameter')
        this.dtResultsObjectsHelp[i].Dconms.push(this.dtRsults[i][Object.keys(this.dtRsults[i])[j]]);

        if (this.dtPropertiesTable[j].Field.toLowerCase().includes('designation') && this.dtRsults[i][Object.keys(this.dtRsults[i])[j]]){
          this.dtResultsObjectsHelp[i].Designation.push(this.dtRsults[i][Object.keys(this.dtRsults[i])[j]]);
          this.dtResultsObjectsHelp[i].desgFieldName.push(this.dtPropertiesTable[j].Field)
        }
        //   if (this.dtResultsObjectsHelp[i].itemType == 'H'){
        //     this.dtResultsObjectsHelp[i].DesgSI.push(this.dtResultsObjectsHelp[i].Designation[this.dtResultsObjectsHelp[i].Designation.length - 1]);
        //     // this.dtResultsObjectsHelp[i].CatalogNoSI.push(this.dtResultsObjectsHelp[i].CatalogNo[this.dtResultsObjectsHelp[i].Designation.length - 1]);
        //     this.dtResultsObjectsHelp[i].DesgS.push(this.dtResultsObjectsHelp[i].Designation[this.dtResultsObjectsHelp[i].Designation.length - 1]);
        //   }
        //   else if (this.dtResultsObjectsHelp[i].itemType == 'T'){
        //     this.dtResultsObjectsHelp[i].DesgSI.push(this.dtResultsObjectsHelp[i].Designation[this.dtResultsObjectsHelp[i].Designation.length - 1]);
        //     // this.dtResultsObjectsHelp[i].CatalogNoSI.push(this.dtResultsObjectsHelp[i].CatalogNo[this.dtResultsObjectsHelp[i].Designation.length - 1]);
        //   }
        // }
        

        // if (this.dtPropertiesTable[j].FieldDescriptionSmall == 'ItemType'){
        //   this.dtResultsObjectsHelp[i].itemType = this.dtRsults[i][Object.keys(this.dtRsults[i])[j]]
        //   if (this.dtRsults[i][Object.keys(this.dtRsults[i])[j]] == 'T'){
        //   this.dtResultsObjectsHelp[i].DesgT.push(this.dtResultsObjectsHelp[i].Designation[this.dtResultsObjectsHelp[i].Designation.length - 1]);
        //   this.dtResultsObjectsHelp[i].CatalogNoT.push(this.dtResultsObjectsHelp[i].CatalogNo[this.dtResultsObjectsHelp[i].Designation.length - 1]);
        // }
        // else if (this.dtRsults[i][Object.keys(this.dtRsults[i])[j]] == 'S'){
        //   this.dtResultsObjectsHelp[i].DesgSI.push(this.dtResultsObjectsHelp[i].Designation[this.dtResultsObjectsHelp[i].Designation.length - 1]);
        //   this.dtResultsObjectsHelp[i].CatalogNoSI.push(this.dtResultsObjectsHelp[i].CatalogNo[this.dtResultsObjectsHelp[i].Designation.length - 1]);
        //   this.dtResultsObjectsHelp[i].DesgS.push(this.dtResultsObjectsHelp[i].Designation[this.dtResultsObjectsHelp[i].Designation.length - 1]);
        // }
        // //   else if (this.dtRsults[i][Object.keys(this.dtRsults[i])[j]] == 'S'){
        // //   this.dtResultsObjectsHelp[i].DesgS.push(this.dtResultsObjectsHelp[i].Designation[this.dtResultsObjectsHelp[i].Designation.length - 1]);
        // //   // this.dtResultsObjectsHelp[i].CatalogNoS.push(this.dtResultsObjectsHelp[i].CatalogNo[this.dtResultsObjectsHelp[i].Designation.length - 1]);
        // // }
        // }
        

        // if (((this.srv_StMng.SecApp == '760' && this.dtPropertiesTable[j].Field == 'DMin') || (this.srv_StMng.SecApp != '760' && this.dtPropertiesTable[j].Field == 'Tool_D')) && this.dtRsults[i][Object.keys(this.dtRsults[i])[j]])
        // this.dtResultsObjectsHelp[i].DC = this.dtRsults[i][Object.keys(this.dtRsults[i])[j]];


        //End Build Helper
        if (this.dtPropertiesTable[j].IsVisible){

          if (this.dtPropertiesTable[j].Field.toLowerCase().includes('catalogno') && i == 0 && this.dtRsults[i][Object.keys(this.dtRsults[i])[j]]){
              groupsOrder.push(this.dtPropertiesTable[j].GroupID)
            }  


          let fieldsmallSplit = this.dtPropertiesTable[j].FieldDescriptionSmall.split(" ")[0].trim();
          let value = this.dtRsults[i][Object.keys(this.dtRsults[i])[j]];
          switch (fieldsmallSplit){
            case 'DC': case 'DCX': case 'KAPR': case 'APMX':case 'RE':case 'CHW':case 'PSIR':case 'L':case 'IC':case 'CEDC':case 'CW':case 'CSP':case 'CP':case 'ZEFF':
              if (value && value > 0){
              this.dtResultsObjectsHelp[i][fieldsmallSplit] = value;
              }
              break;
            case 'LU':
              if (value && value > 0){
                this.dtResultsObjectsHelp[i][fieldsmallSplit] = value;
              }
              break;
            // case 'LH':
            //   if (typeof this.dtResultsObjectsHelp[i].LU == 'undefined'){
            //     this.dtResultsObjectsHelp[i].LU = value;
            //   }
            //   break;
            case 'LF':
              break;
            case 'LB':
              break;
            case 'NOF':
              if (value && value > 0){
                this.dtResultsObjectsHelp[i][fieldsmallSplit] = value;
              }
              break;
            case 'CICT':
              if (typeof this.dtResultsObjectsHelp[i].NOF == 'undefined'){
                this.dtResultsObjectsHelp[i].NOF = value;
              }
              break;
          }

          this.dtResultsObjects[i][index] = new clsPropertyValue()
          this.dtResultsObjects[i][index].property = this.dtPropertiesTable[j]
          if (!this.dtRsults[i][Object.keys(this.dtRsults[i])[j]])
          this.dtRsults[i][Object.keys(this.dtRsults[i])[j]] = '';
          this.dtResultsObjects[i][index].value = this.dtRsults[i][Object.keys(this.dtRsults[i])[j]]

          if (this.dtDefaultFields.indexOf(this.dtPropertiesTable[j].FieldDescriptionSmall) === -1){
            this.dtResultsObjects[i][index].property.IsShow = false;
          }
          else{
            this.dtResultsObjects[i][index].property.IsShow = true;
          }

          index++

          
        //   if (this.dtPropertiesTable[j].FieldDescriptionSmall == "Catalog No" && '/Tool/Blade/Square shank'.indexOf(this.dtPropertiesTable[j].GroupText) !== -1){
        //     var url:string = environment.eCatItemPictures + this.dtRsults[i][Object.keys(this.dtRsults[i])[j]].toString().trim() + ".gif ";
        //     this.arrResultImgsItem.push(url);

        // }
      }
        // if (this.dtPropertiesTable[j].FieldDescriptionSmall.includes('Family')  && '/Tool/Blade/Square shank'.indexOf(this.dtPropertiesTable[j].GroupText) !== -1){
        //   let family:string = this.dtRsults[i][Object.keys(this.dtRsults[i])[j]].toString().trim();
          
          
        //   let curFamilyPic = this.arrResultImgsAll.find(i => i['Family'] == family.toString().trim());
        //   if (curFamilyPic)
        //     family = curFamilyPic['GFPIC'];

        //     var url:string = environment.eCatFamilyPictures + family.toString().trim() + ".gif ";
        //     this.arrResultImgsFamily.push(url);

        // }

     
          
      }

    }


  var visColumnsCount = this.dtResultsObjects[0].length
  this.dtResultsObjects3d = []
  let index3:number = 0;
  var dupColumns:number [] = []
  
  for(var i: number = 0; i < rowsCount; i++) {
    this.dtResultsObjects3d[i] = []
    index = 0
    dupColumns = []
    // groupsOrder = []
  for(var col1: number = 0; col1 < visColumnsCount; col1++) {
    if(dupColumns.indexOf(col1) == -1){
      this.dtResultsObjects3d[i][index] = []
      index3 = 0
     
      if (this.dtResultsObjects[i][col1].property.FieldDescriptionSmall == 'Brand Name'){
        let grpID:number = this.dtResultsObjects[i][col1].property.GroupID
        let order:number = groupsOrder.indexOf(grpID, 0)
        index3 = order
        for(var brandNamePos: number = 0; brandNamePos < index3; brandNamePos++) {
          this.dtResultsObjects3d[i][index][brandNamePos] = new clsPropertyValue() 
        }
        for(var brandNamePos: number = index3 + 1; brandNamePos < groupsOrder.length; brandNamePos++) {
          this.dtResultsObjects3d[i][index][brandNamePos] = new clsPropertyValue() 
        }
      }
      this.dtResultsObjects3d[i][index][index3] = this.dtResultsObjects[i][col1]
      if (i==0)
        this.headers.push(this.dtResultsObjects[i][col1].property);
      
  for(var col2: number = col1 +  1; col2 < visColumnsCount; col2++) {
    if (dupColumns.indexOf(col2) == -1 
    && (this.dtResultsObjects[i][col1].property.FieldDescriptionSmall == this.dtResultsObjects[i][col2].property.FieldDescriptionSmall
      ||(this.dtResultsObjects[i][col1].property.Field.toLowerCase().includes('catalogno') && this.dtResultsObjects[i][col2].property.Field.toLowerCase().includes('catalogno'))
      ||(this.dtResultsObjects[i][col1].property.Field.toLowerCase().includes('designation') && this.dtResultsObjects[i][col2].property.Field.toLowerCase().includes('designation'))))
    {
      if (this.dtResultsObjects[i][col2].value
   &&  this.dtResultsObjects[i][col2].value.toString().trim() !== this.dtResultsObjects3d[i][index][0].value.toString().trim()){
    index3++
    // if (index == 0)
    // {
    //   groupsOrder.push(this.dtResultsObjects[i][col2].property.GroupID)
    // }
    if (this.dtResultsObjects[i][col2].property.FieldDescriptionSmall == 'Brand Name'){
      let grpID:number = this.dtResultsObjects[i][col2].property.GroupID
      let order:number = groupsOrder.indexOf(grpID, 0)
      index3 = order
    }
    this.dtResultsObjects3d[i][index][index3] = this.dtResultsObjects[i][col2] 
   }      
      dupColumns.push(col2)     
    }
  }
  index++
    }
    
  }
  
}

this.headersOrig = JSON.parse(JSON.stringify(this.headers));
this.dtTrigger.next();
this.SpinnerService.hide();
}
// private async checkImgExists(image_url:string){
//   const data = await this.srv_Results.checkImgExists(image_url).toPromise();
//   console.log("Data: " + JSON.stringify(data));

// }

changeSource(event, name) { event.target.src = name; }

openSelectColumns(){
  const modalRef = this.modalService.open(PpSelectColumnsComponent, { centered: true });
  modalRef.componentInstance.modal_columns = this.headers;
  modalRef.componentInstance.modal_columns_Org = this.headersOrig
  modalRef.result.then((result) => {
    if (result) {
    console.log(result);
      if(result != 'A'){
         this.headers = result
         this.cdr.detectChanges();
        // this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        //   dtInstance.destroy();
        //   this.dtTrigger.next();
        // });
      }
    }
    }, () => console.log('Rejected!'));
}


 trackItem (index: number, item: clsProperties):boolean {
  return item.IsShow;
}

customTB(index, song) { return `${index}-${song.id}`; }

// trackHelp(index: number, item: clsHelpProp):number {
//   return item.isHidden;
// }

updateGroupText(itemType:string,resultType:string,field:string,catalogNoLoc:number,index:number,catalogNo:string){
switch(this.srv_StMng.SecApp.toString()){
    case '760':  case '770': case '780': case '790': case '57': case '119': case '120':
      switch(field){
        case 'HolderDesignation' :
          this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Adaptor'
          break;
        case 'HolderDesignationCollet':
          this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Collet'
          break;
        case 'HeaderDesignation':
          switch(itemType){
            case 'T':
              this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Tool'
            break;
            case 'H':
              this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Shank'
            break;
          }
          break;
        case 'DetailsDesignation':
          switch(itemType){
            case 'I':
              this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Insert'
            break;
            case 'S':
              switch(resultType){
                case 'H':
                  this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Solid Head'
                break;
                case 'S':
                  this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Solid'
                break;
              }
            break;
          }
          break;
      }
    break
    case '960':  case '970': case '980': case '990':
      switch(field){
        case 'HeaderDesignation' :
          this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Holder'
          break;
        case 'HeaderDesignation1':
          this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Square Shank'
          break;
        case 'DetailsDesignation':
          this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Insert'
          break;
      }
    break
    case '850':  case '860': case '870': case '880': case '890': 
    switch(field){
      case 'HeaderDesignation' :
        this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Holder'
        break;
      case 'HeaderDesignation1':
        this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Round shank holder'
        break;
      case 'HeaderDesignation2':
          this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Tool'
        break;
      case 'DetailsDesignation':
        switch(itemType){
          case 'S':
            this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Solid'
          break;
          case 'I':
            this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Insert'
          break;
        }
        break;
    }
    break
    case '52':  case '1': case '51': case '54': case '19': 
    switch(field){
      case 'HeaderDesignation' :
        this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Holder'
        break;
      case 'HeaderDesignation1':
        this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Square Shank'
        break;
      case 'HeaderDesignation2':
        this.srv_Results.GetFlatDataField('OperationType',catalogNo,this.srv_StMng.SecApp,this.srv_appsetting.Units).subscribe((res: any) => {
          let fieldValue:string = JSON.parse(res)
          switch(fieldValue){
            case 'BLADE':
              this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Blade'
              break;
            case 'ADAPTER':
              this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Adaptor'
              break;
          }
        })
        break;
      case 'DetailsDesignation':
        this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Insert'
        break;
    }
    break
    case '188':  case '53': case '50': 
    switch(field){
      case 'HeaderDesignation' :
        this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Holder'
        break;
      case 'HeaderDesignation1':
        this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Round shank holder'
        break;
      case 'HeaderDesignation2':
        this.srv_Results.GetFlatDataField('OperationType',catalogNo,this.srv_StMng.SecApp,this.srv_appsetting.Units).subscribe((res: any) => {
          let fieldValue:string = JSON.parse(res)
          switch(fieldValue){
            case 'BLADE':
              this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Blade'
              break;
            case 'ADAPTER':
              this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Adaptor'
              break;
            case 'BORING BAR':
              this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Tool'
              break;
          }
        })
        break;
      case 'DetailsDesignation':
        this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Insert'
        break;
    }
    break
    case '77': 
    switch(field){
      case 'HolderDesignation' :
        this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Holder'
        break;
      case 'HolderDesignationCollet':
        this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Collet'
        break;
      case 'HeaderDesignation':
        this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Tool'
        break;
      case 'DetailsDesignation':
        if (this.dtResultsObjectsHelp[index].itemType.indexOf('S') != -1){
          this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Solid'
        }
        else{
          if (this.dtResultsObjectsHelp[index].ZEFF >= 2) 
          this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Head'
          else
          this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'External Insert'
        }
        
        
        break;
      case 'DetailsIntDesignation':
        this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Internal insert'
        break;
      case 'EccenterDesignation':
        this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Eccenter'
        break;
      case 'CartridgeIntDesignation':
        this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Cartridge Int'
        break;
      case 'CartridgeExtDesignation':
        this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Cartridge Ext'
        break;
      case 'ShimPartDesignation':
        this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Shim Part'
        break;
    }
    break
}
}

ngOnChanges(changes:SimpleChanges) {

  if (this.filterChangedRec && changes.filterChangedRec){
    
    for(var i: number = 0; i < this.dtResultsObjectsHelp.length; i++){
      switch (this.filterChangedRec.control){
        case 'ST':
          if (this.srv_StMng.SecApp == '77')
          {
            if (this.dtResultsObjectsHelp[i].itemType.indexOf('S') != -1){
              if (!this.filterChangedRec.Res)
                  this.dtResultsObjectsHelp[i].isHidden++
              else
                  this.dtResultsObjectsHelp[i].isHidden--
            }
          }
          else{
            if (this.dtResultsObjectsHelp[i].DesgS.filter(s => !s.startsWith('MM')).length > 0){
              if (!this.filterChangedRec.Res)
                  this.dtResultsObjectsHelp[i].isHidden++
              else
                  this.dtResultsObjectsHelp[i].isHidden--
             }  
          }    
          break;
       case 'SH':
        if (this.srv_StMng.SecApp == '77')
        {
          if (this.dtResultsObjectsHelp[i].itemType.indexOf('T') != -1 && this.dtResultsObjectsHelp[i].ZEFF >= 2){
            if (!this.filterChangedRec.Res)
                this.dtResultsObjectsHelp[i].isHidden++
            else
                this.dtResultsObjectsHelp[i].isHidden--
          }
        }
        else{
          if (this.dtResultsObjectsHelp[i].DesgS.filter(s => s.startsWith('MM')).length > 0){
            if (!this.filterChangedRec.Res)
                this.dtResultsObjectsHelp[i].isHidden++
            else
                this.dtResultsObjectsHelp[i].isHidden--
          }}
          break;
        case 'IT':
          if (this.srv_StMng.SecApp == '77'){
            if (this.dtResultsObjectsHelp[i].itemType.indexOf('T') != -1 && this.dtResultsObjectsHelp[i].ZEFF < 2){
              if (!this.filterChangedRec.Res)
                  this.dtResultsObjectsHelp[i].isHidden++
              else
                  this.dtResultsObjectsHelp[i].isHidden--
            }
          }
          else{
            this.dtResultsObjectsHelp[i].checkFzminF(this.filterChangedRec.Res,this.filterChangedRec.control);
          }
          break;  
        case 'IH':
          this.dtResultsObjectsHelp[i].checkFzminF(this.filterChangedRec.Res,this.filterChangedRec.control);
          break;   
        case 'TypeFeed':
          switch (this.filterChangedRec.Res){
            case 'BothFeed':
              if (this.lasTypeFeed == 'HightFeed'){
                if (this.srv_StMng.SecApp == '760' && this.dtResultsObjectsHelp[i].SecondaryAppOrig1 != '700')
                  {this.dtResultsObjectsHelp[i].isHidden--}
                if (this.srv_StMng.SecApp == '770' && this.dtResultsObjectsHelp[i].SecondaryAppOrig1 != '710')
                  {this.dtResultsObjectsHelp[i].isHidden--}
                if (this.srv_StMng.SecApp == '780' && this.dtResultsObjectsHelp[i].SecondaryAppOrig1 != '730')
                  {this.dtResultsObjectsHelp[i].isHidden--}                                    
                if (this.srv_StMng.SecApp == '790' && this.dtResultsObjectsHelp[i].SecondaryAppOrig1 != '740')
                  {this.dtResultsObjectsHelp[i].isHidden--}    
              }
              if (this.lasTypeFeed == 'NormalFeed'){
                if (this.srv_StMng.SecApp == '760' && this.dtResultsObjectsHelp[i].SecondaryAppOrig1 != '59')
                  {this.dtResultsObjectsHelp[i].isHidden--}
                if (this.srv_StMng.SecApp == '770' && this.dtResultsObjectsHelp[i].SecondaryAppOrig1 != '61')
                  {this.dtResultsObjectsHelp[i].isHidden--}
                if (this.srv_StMng.SecApp == '780' && this.dtResultsObjectsHelp[i].SecondaryAppOrig1 != '720')
                  {this.dtResultsObjectsHelp[i].isHidden--}                                    
                if (this.srv_StMng.SecApp == '790' && this.dtResultsObjectsHelp[i].SecondaryAppOrig1 != '750')
                  {this.dtResultsObjectsHelp[i].isHidden--}   
              }
              break;
            case 'HightFeed':
              
                  if (this.srv_StMng.SecApp == '760' && this.dtResultsObjectsHelp[i].SecondaryAppOrig1 != '700')
                    {this.dtResultsObjectsHelp[i].isHidden++}
                  if (this.srv_StMng.SecApp == '770' && this.dtResultsObjectsHelp[i].SecondaryAppOrig1 != '710')
                    {this.dtResultsObjectsHelp[i].isHidden++}
                  if (this.srv_StMng.SecApp == '780' && this.dtResultsObjectsHelp[i].SecondaryAppOrig1 != '730')
                    {this.dtResultsObjectsHelp[i].isHidden++}                                    
                  if (this.srv_StMng.SecApp == '790' && this.dtResultsObjectsHelp[i].SecondaryAppOrig1 != '740')
                    {this.dtResultsObjectsHelp[i].isHidden++}    
                    if (this.lasTypeFeed == 'NormalFeed'){
                      if (this.srv_StMng.SecApp == '760' && this.dtResultsObjectsHelp[i].SecondaryAppOrig1 != '59')
                        {this.dtResultsObjectsHelp[i].isHidden--}
                      if (this.srv_StMng.SecApp == '770' && this.dtResultsObjectsHelp[i].SecondaryAppOrig1 != '61')
                        {this.dtResultsObjectsHelp[i].isHidden--}
                      if (this.srv_StMng.SecApp == '780' && this.dtResultsObjectsHelp[i].SecondaryAppOrig1 != '720')
                        {this.dtResultsObjectsHelp[i].isHidden--}                                    
                      if (this.srv_StMng.SecApp == '790' && this.dtResultsObjectsHelp[i].SecondaryAppOrig1 != '750')
                        {this.dtResultsObjectsHelp[i].isHidden--}   
                    }           
              break;
            case 'NormalFeed':          
                  if (this.srv_StMng.SecApp == '760' && this.dtResultsObjectsHelp[i].SecondaryAppOrig1 != '59')
                    {this.dtResultsObjectsHelp[i].isHidden++}
                  if (this.srv_StMng.SecApp == '770' && this.dtResultsObjectsHelp[i].SecondaryAppOrig1 != '61')
                    {this.dtResultsObjectsHelp[i].isHidden++}
                  if (this.srv_StMng.SecApp == '780' && this.dtResultsObjectsHelp[i].SecondaryAppOrig1 != '720')
                    {this.dtResultsObjectsHelp[i].isHidden++}                                    
                  if (this.srv_StMng.SecApp == '790' && this.dtResultsObjectsHelp[i].SecondaryAppOrig1 != '750')
                    {this.dtResultsObjectsHelp[i].isHidden++}   
                    if (this.lasTypeFeed == 'HightFeed'){
                      if (this.srv_StMng.SecApp == '760' && this.dtResultsObjectsHelp[i].SecondaryAppOrig1 != '700')
                        {this.dtResultsObjectsHelp[i].isHidden--}
                      if (this.srv_StMng.SecApp == '770' && this.dtResultsObjectsHelp[i].SecondaryAppOrig1 != '710')
                        {this.dtResultsObjectsHelp[i].isHidden--}
                      if (this.srv_StMng.SecApp == '780' && this.dtResultsObjectsHelp[i].SecondaryAppOrig1 != '730')
                        {this.dtResultsObjectsHelp[i].isHidden--}                                    
                      if (this.srv_StMng.SecApp == '790' && this.dtResultsObjectsHelp[i].SecondaryAppOrig1 != '740')
                        {this.dtResultsObjectsHelp[i].isHidden--}    
                    }
              break;
          }   
          break;  
          case 'optFilter':
            switch (this.filterChangedRec.Res){
              case 'FilterRec':
                this.filterRecommended(this.dtResultsObjectsHelp[i]);
                this.sortProp = 'index';
                  // if (this.dtResultsObjectsHelp[i].IsExpand == "False")
                  // this.dtResultsObjectsHelp[i].isHidden++
                break;
              case 'FilteAllRes':
                  if (this.dtResultsObjectsHelp[i].IsExpand == "False" || this.dtResultsObjectsHelp[i].AverageUse < 1)
                  this.dtResultsObjectsHelp[i].isHidden--
                  this.sortProp = 'index';
                break;
              case 'FilterSeller':
                if (this.dtResultsObjectsHelp[i].AverageUse < 1)
                  this.dtResultsObjectsHelp[i].isHidden++
                  this.sortProp = 'AverageUse';
                break;
            }
            break;   
            // case 'optSort':
            //   switch (this.filterChangedRec.Res){
            //     case 'SortRec':
            //       this.sortProp = 'index';
            //       break;
            //     case 'SortSeller':
            //       this.sortProp = 'AverageUse';
            //       break;
            //   }
            //   return;  
              
            case 'filterList':
              let field:string = this.filterChangedRec.Res[0];
              let value:string = this.filterChangedRec.Res[1];
              switch (this.filterChangedRec.Res[2]){
                case 'T':
                  if (this.dtResultsObjectsHelp[i][field].filter(s => s == value).length > 0)
                        this.dtResultsObjectsHelp[i].isHidden--
                  break;
                case 'F':
                  if (this.dtResultsObjectsHelp[i][field].filter(s => s == value).length > 0)
                      this.dtResultsObjectsHelp[i].isHidden++
                  break;
                case 'S':
                  if (this.dtResultsObjectsHelp[i][field].filter(s => !s.toUpperCase().includes(value)).length > 0)
                      this.dtResultsObjectsHelp[i].isHidden++
                  break;
                case 'CS':
                  if (this.dtResultsObjectsHelp[i][field].filter(s => !s.toUpperCase().includes(value)).length > 0)
                        this.dtResultsObjectsHelp[i].isHidden--
                  break;
              }
              console.log(i + " " + this.dtResultsObjectsHelp[i].isHidden);
              break;

              case 'scrolList':
                let fieldS:string = this.filterChangedRec.Res[0];
                let minValue:string = this.filterChangedRec.Res[1];
                let maxValue:string = this.filterChangedRec.Res[2];
                if (this.dtResultsObjectsHelp[i][fieldS] < minValue || this.dtResultsObjectsHelp[i][fieldS] > maxValue)
                        {this.dtResultsObjectsHelp[i].isHidden++}    
                else
                        {this.dtResultsObjectsHelp[i].isHidden--}  
                console.log(i + " " + this.dtResultsObjectsHelp[i].isHidden);
                break;
                case 'ClearAll':
                  this.dtResultsObjectsHelp[i].isHidden = 0;
                  this.sortProp = 'index';
                  this.filterRecommended(this.dtResultsObjectsHelp[i]);
                  break;


                  case 'Promotion':
                    if (this.filterChangedRec.Res){
                      if (!this.dtResultsObjectsHelp[i].Promotion)
                        this.dtResultsObjectsHelp[i].isHidden++
                    }
                    else{
                      if (!this.dtResultsObjectsHelp[i].Promotion)
                        this.dtResultsObjectsHelp[i].isHidden--
                    }
                    break;
      }
    
      
    }
    if (this.filterChangedRec.control == 'TypeFeed')
      this.lasTypeFeed = this.filterChangedRec.Res;
  }
  
}

filterRecommended(prop:clsHelpProp){
    if (prop.IsExpand == "False")
        prop.isHidden++
    else
        prop.isHidden--
}


viewInfo(index:number)
{
  this.goToViewEvent.emit({control:'View',Res:[this.dtResultsObjectsHelp[index],this.dtResultsObjects3d[index]]})
}

getPropWithoutUnits(pr:string){
  let indexOfU:number = pr.lastIndexOf('(')
  if (indexOfU != -1){
    return pr.substring(0,indexOfU)
  }
  else{
    return pr;
  }
}

DownLoadPDF()
{  
    this.srv_down.DownLoadData('PDF') ;      
}

DownLoadData()
{
  const modalRef = this.modalService.open(ResultPpDownloadComponent, { centered: true });
      
  modalRef.result.then((result) => {
    if(result=='cancel') return;
    //this.SpinnerService.show();
    this.srv_down.DownLoadData(result) ;  
    //todo:with subscribe 
    //this.SpinnerService.hide();                      
  });
}

viewInventory(index:number)
{    
  const modalRef = this.modalService.open(ResultPpInventoryComponent, { centered: true });
  modalRef.componentInstance.objHelpProp = this.dtResultsObjectsHelp[index];
  //this.goToViewEvent.emit({control:'View',Res:[this.dtResultsObjectsHelp[index],this.dtResultsObjects3d[index]]})
}
}

