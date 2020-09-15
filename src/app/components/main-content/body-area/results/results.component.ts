import { Component, OnInit, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import { ResultsTableComponent } from 'src/app/components/main-content/body-area/results/results-table/results-table.component';
import {ResultPpDownloadComponent} from 'src/app/components/main-content/body-area/results/result-pp-download/result-pp-download.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DownloadresultService} from 'src/app/services/downloadresult.service';
import { DatalayerService} from 'src/app/services/datalayer.service' ;
import { NgxSpinnerService } from "ngx-spinner"; 
import { NavigationEnd, Router } from '@angular/router';

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
navigationSubscription;

@ViewChild('resTable', {static: false}) resTable: ResultsTableComponent;

  constructor(private modalService: NgbModal,private SpinnerService: NgxSpinnerService,
    private srv_down:DownloadresultService , private router: Router) {

      this.navigationSubscription = this.router.events.subscribe((e: any) => {
        // If it is a NavigationEnd event re-initalise the component
        if (e instanceof NavigationEnd) {
          this.initialiseInvites();
        }
      });

     }

     initialiseInvites() {
      this.MainPage = true;
     }

     ngOnDestroy() {
      // avoid memory leaks here by cleaning up after ourselves. If we  
      // don't then we will continue to run our initialiseInvites()   
      // method on every navigationEnd event.
      if (this.navigationSubscription) {  
         this.navigationSubscription.unsubscribe();
      }
    }

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
   const modalRef = this.modalService.open(ResultPpDownloadComponent, { centered: true });
      
   modalRef.result.then((result) => {
    //alert(result);
    if(result=='cancel') return;
    this.IsExport=true; 

    //this.SpinnerService.show();
    //window.print();    
    //setTimeout( () => {this.SpinnerService.hide()},7000);

    //setTimeout( () => {window.print();return;}, 10000 );
    
    setTimeout( () => {this.srv_down.DownLoadDataItem('PDF') ;}, 7000 );
  /*   this.srv_DataLayer.gethtmlpage("ALL").subscribe ((data:any)=>
    {
      this.dataCatalog1= data.toString();    
      this.srv_down.DownLoadDataItem('PDF');      
    }); */
    
    //this.srv_down.DownLoadDataItem('PDF') ;   
    
    //this.SpinnerService.show();
    //this.srv_down.DownLoadData(result) ;  
    //todo:with subscribe 
    //this.SpinnerService.hide();                      
   });
 }

 PrintResult()
 {
    setTimeout( () => {window.print();}, 7000 );    
 }
}
