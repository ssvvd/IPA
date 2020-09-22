import { Component, OnInit, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import { ResultsTableComponent } from 'src/app/components/main-content/body-area/results/results-table/results-table.component';
import {ResultPpDownloadComponent} from 'src/app/components/main-content/body-area/results/result-pp-download/result-pp-download.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DownloadresultService} from 'src/app/services/downloadresult.service';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from "ngx-spinner"; 
import { StateManagerService} from 'src/app/services/statemanager.service' ;
import { Subject } from 'rxjs';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})

export class ResultsComponent implements OnInit, AfterViewInit { 

filterChanged:any;
viewParams:any;
MainPage:boolean = true;
active = 1;
IsExport:boolean;
environment = environment;  
navigationSubscription;

@ViewChild('resTable', {static: false}) resTable: ResultsTableComponent;

eventsSubject: Subject<void> = new Subject<void>();

  constructor(private modalService: NgbModal,private SpinnerService: NgxSpinnerService,
    private srv_down:DownloadresultService, public srv_statemanage:StateManagerService) { }
  ngAfterViewInit() {
    console.log(this.resTable); 
  }

  ngOnInit() {
    this.MainPage = true;    
  }

  receiveFilterChange(value){
    this.filterChanged = value;
  }

  getHelpFilter(){

  }
  goToView(value){
    this.MainPage = false;
    this.viewParams = value;
    this.active = 1;
  }

  switchPage(){
    this.MainPage = true;
  }
  
  dataCatalog1:string;

  DownLoadData()
  {
    this.srv_down.DownLoadDataItem('PDF') ;    
  }

  mat_desc:string;
  loadingPDF:boolean=false;

  CreateComponentsForPDF()
{  
   const modalRef = this.modalService.open(ResultPpDownloadComponent, { centered: true });
      
   modalRef.result.then((result) => {
    //alert(result);
    if(result=='cancel') return;

    this.loadingPDF=true;
    let m:any;        
    m=this.srv_statemanage.GetMaterialSelected();
    if (typeof ( m.material) !== 'undefined')
      this.mat_desc=m.Category + m.group.toString() + " - " + m.material ;     
    else
      this.mat_desc=m.Category + m.group.toString() + " - " + m.description.toString(); 

    this.IsExport=true; 

    setTimeout( () => {this.DownLoadData();this.loadingPDF=false;}, 5000 );    
                     
   });
 }

}
