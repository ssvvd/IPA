import { Component, OnInit,OnDestroy, ViewChild } from '@angular/core';
import { StateManagerService} from 'src/app/services/statemanager.service' ;
import { clsMaterial } from 'src/app/models/materials/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PpRequestMaterialComponent } from './pp-request-material/pp-request-material.component';
import { Location } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { MatFilterComponent } from './mat-filter/mat-filter.component';
import { MatDetailsComponent } from './mat-details/mat-details.component';
import { TranslateService } from '@ngx-translate/core';
import { AppsettingService} from 'src/app/services/appsetting.service';
import { environment } from 'src/environments/environment';
// import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.scss']
})
export class MaterialsComponent implements OnInit,OnDestroy {
  @ViewChild('myChildFilter') private myChildFilter: MatFilterComponent;
  @ViewChild('myDetailsComponent') private myDetailsComponent: MatDetailsComponent;
  internal:boolean;
  selectedCateg: string;
  selectedMatDeials:clsMaterial;
  curComponent:string;
  selectedSatnd:string;
  breadCrumb:string[]=[];
  searchText:string
  navigationSubscription;
  
  // environment = environment;

  constructor(private statemng:StateManagerService,private modalService: NgbModal,
              location: Location , private router: Router,public translate: TranslateService,
              public srv_appsetting:AppsettingService) {
  
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.initialiseInvites();        
      }
    });
  }
  
  initialiseInvites() {
    // Set default values and re-fetch any data you need.   
    if(this.myChildFilter){
    var selCateg = "P"
    if (this.statemng.GetMaterialSelected()!= null){
      var selMat = this.statemng.GetMaterialSelected();
      selCateg = selMat.Category;
    }
    this.myChildFilter.categClick(selCateg)
  }    
  }

  ngOnDestroy() {
    // avoid memory leaks here by cleaning up after ourselves. If we  
    // don't then we will continue to run our initialiseInvites()   
    // method on every navigationEnd event.
    if (this.navigationSubscription) {  
       this.navigationSubscription.unsubscribe();
    }
  }
  
  GoToMyMaterials(event){
    this.myChildFilter.MyMatCheked = true;
    this.showMyMaterials(true)
  }

  receiveCategory(category:string) {
    if (category != "All"){
      this.selectedCateg = category;
      this.curComponent = "1";
      this.breadCrumb = [];
      if (this.statemng.GetMaterialSelected()!= null){
        var selMat = this.statemng.GetMaterialSelected();
        var selCateg = selMat.Category;
        if (selCateg.includes(category))
        {
          
          this.breadCrumb = [this.translate.instant('Group No') + '.' + selMat.group];
        }
          
      }
    }
   else
   {
     if(this.searchText!='')
      this.receiveSearchText(this.searchText)
   }
  }

  receiveMatDeials(material:clsMaterial) {
    this.selectedMatDeials = material;
    this.curComponent = "2";    
    this.breadCrumb = [material.group,this.translate.instant('Standard Conversion Chart')];

    this.statemng.SelectedMatStandard='';
    this.statemng.SelectedMatText ='';
  }
  
  receiveStandard(standard:string) {
    this.selectedSatnd = standard;
    this.curComponent = "3";
      this.breadCrumb = [standard];  
  }

  OpenStandardsWithFilter($event) {
    this.selectedMatDeials = $event.material;
    this.curComponent = "2";    
    this.breadCrumb = [$event.material.group,this.translate.instant('Standard Conversion Chart')];

    //if(this.myDetailsComponent) this.myDetailsComponent.selectfoundmaterial( $event.material.Standard,$event.searchtext);
    this.statemng.SelectedMatStandard=$event.material.Standard;
    this.statemng.SelectedMatText =$event.searchtext;
  }

  receiveSearchText(srch:string) {
    this.searchText = srch;
    if (srch.trim() == ''){
      this.curComponent = "1";
      this.selectedCateg = "P";
    }
    else{
      this.curComponent = "4";
      this.selectedCateg = "All";
      this.breadCrumb = [];
    }    
  }

  showMyMaterials(checked:boolean){
    if (checked){
      this.curComponent = "5";
      this.selectedCateg = "All";
      this.breadCrumb = [];
    }
    else{
      this.curComponent = "1";
      this.selectedCateg = "P";
    }
  }


  ngOnInit() {    
    this.srv_appsetting.LangChanged.subscribe(l=>{if(l!=null) this.translate.use(l)});
    if(!environment.internal)
    {
      if(localStorage.getItem("language")!=null && localStorage.getItem("language")!='')
        this.translate.use(localStorage.getItem("language"));        
    }
    this.curComponent = "1";   
    //alert(this.statemng.GetMachineHeaderCur().CostPerHour);    
  }

  openRequestMatM() {
    const modalRef = this.modalService.open(PpRequestMaterialComponent, { centered: true,windowClass:"customModalClass",backdrop: 'static' });
  }
}
