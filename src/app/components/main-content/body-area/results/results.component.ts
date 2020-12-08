import { Component, OnInit, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import { ResultsTableComponent } from 'src/app/components/main-content/body-area/results/results-table/results-table.component';
import {ResultPpDownloadComponent} from 'src/app/components/main-content/body-area/results/result-pp-download/result-pp-download.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DownloadresultService} from 'src/app/services/downloadresult.service';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from "ngx-spinner"; 
import { StateManagerService} from 'src/app/services/statemanager.service' ;
import { DatalayerService} from 'src/app/services/datalayer.service' ;
import { AppsettingService} from 'src/app/services/appsetting.service';
import { Subject } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

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
_hideFilter:boolean;

@ViewChild('resTable', {static: false}) resTable: ResultsTableComponent;

eventsSubject: Subject<void> = new Subject<void>();

  constructor(private modalService: NgbModal,private SpinnerService: NgxSpinnerService,
    private srv_down:DownloadresultService, public srv_statemanage:StateManagerService,private srv_DataLayer:DatalayerService,
    public srv_appsetting:AppsettingService,private router: Router,
    public translate:TranslateService) { 
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
    
    //this.srv_statemanage.onflgDownLoadPDF.subscribe(f => { if(f==2) {console.log('f==2'); setTimeout( () => {this.SpinnerService.hide();}, 3000 ); return;}});
    this.srv_appsetting.LangChanged.subscribe(l=>this.translate.use(l));
    this.MainPage = true;     
    this._hideFilter = false; 
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

  mat_desc:string;
  processdownload:boolean=false;

  hideFilter(event){
    this._hideFilter = true;
  }

  DownLoadResults()
  {  
    this.srv_appsetting.curDate= new Date().toString(); 
    //todo:
    this.srv_statemanage.onflgDownLoadPDF.subscribe(f => { f=0; if(f==2) {this.SpinnerService.hide(); return;}});
    //this.srv_down.PDFListLoaded.subscribe((res:any) => {alert(res);this.processdownload =false;});

    const modalRef = this.modalService.open(ResultPpDownloadComponent, { centered: true });
      
    modalRef.result.then((result) => {
    if(result=='cancel') return;
    
    if (result=='PDF')
    {
      this.processdownload=true;
      this.srv_statemanage.flgPDFLoading=1;

      let m:any;        
      m=this.srv_statemanage.GetMaterialSelected();
      if (typeof ( m.material) !== 'undefined')
        this.mat_desc=m.Category + m.group.toString() + " - " + m.material ;     
      else
        this.mat_desc=m.Category + m.group.toString() + " - " + m.description.toString(); 
  
      this.IsExport=true; 
      
      this.SpinnerService.show();
      setTimeout( () => {this.srv_down.DownLoadDataItem('PDF','',this.srv_statemanage);}, 6000 );               
      setTimeout(() => {this.SpinnerService.hide();}, 12000);
    }
    
    if(result=="P21" || result=="FP") 
    {      
      this.processdownload =true;
      let sCatalogNo:string ='';
      for (let c of this.viewParams.Res[0].CatalogNo)
      {
        c=c.replace(/\s/g, "");
        sCatalogNo = sCatalogNo +c + ',';
      } 

      if(sCatalogNo!='') sCatalogNo=sCatalogNo.substring(0,sCatalogNo.length-1);
      if(result=='P21')     
        return this.srv_DataLayer.downloadp21file(sCatalogNo,'M').subscribe( response=>       
        {      
          var downloadURL = window.URL.createObjectURL(response);
          var link = document.createElement('a');
          link.href = downloadURL;
          link.download = "P21.zip";
          link.click();
          this.processdownload =false;          
        }
      );
      if(result=='FP')     
      return this.srv_DataLayer.downloadfilepackage(sCatalogNo,'M').subscribe( response=>       
      {      
        var downloadURL = window.URL.createObjectURL(response);
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = "GTC.zip";
        link.click();
        this.processdownload =false;
      }
    );
    }
   });
 }
 
 OpenCNGenerator()
 {
   let strpar:string=this.srv_down.CreateURLparamCNCProgram(this.viewParams);
   window.open(this.environment.IscarSite + '/ITA/GCodeCreator.aspx?' +strpar);   
 }

}
