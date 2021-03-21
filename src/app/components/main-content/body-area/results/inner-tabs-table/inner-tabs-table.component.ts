import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import {clsHelpProp} from 'src/app/models/results/help-prop';
import { environment } from 'src/environments/environment';
import { StateManagerService} from 'src/app/services/statemanager.service' ;
import { AppsettingService} from 'src/app/services/appsetting.service';
import { ResultsService} from 'src/app/services/results.service' ;
@Component({
  selector: 'inner-tabs-table',
  templateUrl: './inner-tabs-table.component.html',
  styleUrls: ['./inner-tabs-table.component.scss']
})
export class InnerTabsTableComponent implements OnInit {

  @Input() viewParamsChanged: any ;
  @Input() exportPDF: boolean;
  selectedOption:clsHelpProp;
  environment = environment;

  IsExistIntoolShop:string[]=[];
  constructor(private srv_StMng:StateManagerService,public srv_appsetting:AppsettingService,
              private srv_results:ResultsService) { }

  ngOnInit(): void {

   
  }

  ngOnChanges(changes:SimpleChanges) {
    if (this.viewParamsChanged && changes.viewParamsChanged){
      this.selectedOption = this.viewParamsChanged.Res[0];
       //if(this.srv_appsetting.Country.FCSToolshopSite!='' && this.srv_appsetting.UserID!='')
    if(this.srv_appsetting.Country.FCSToolshopSite!='' )
    {
      this.IsExistIntoolShop=[];
      this.selectedOption.CatalogNo.forEach((cat) => {
        this.srv_results.getitemsdetailsfortoolshop (cat,this.srv_appsetting.Units,this.srv_appsetting.Lang,this.srv_appsetting.Country.LACNT).subscribe((res: any) => 
        { 
          this.IsExistIntoolShop.push(res);
        });
      });
    }
    }
  }

  changeSource(event, name) { event.target.src = name; }

  goToCatalog(itemIndex){
    let mapp:string = 'IT'
    if (this.selectedOption.itemType[itemIndex].trim() != 'H'){
      mapp = this.srv_StMng.SecAppSelected.MainApp
    }
  
    /* let url:string = environment.eCatItemPage + this.selectedOption.CatalogNo[itemIndex].trim()  + '&fnum=' + this.selectedOption.Families[itemIndex].trim()
     + '&mapp=' + mapp + '&GFSTYP=' + this.srv_appsetting.Units + '&lang=' + this.srv_appsetting.Lang + '&cf=ITA'
   */
  let url:string = environment.eCatItemPage + '&qw=' + this.selectedOption.CatalogNo[itemIndex].trim() + '&lang='
                   + this.srv_appsetting.Lang + '&GFSTYP=' + this.srv_appsetting.Units + '&cf=ITA'
  
    window.open(url, "_blank");

  }

  checkexistsitemintoolshop(catalogno:string) 
  {
    this.srv_results.getitemsdetailsfortoolshop (catalogno,this.srv_appsetting.Units,this.srv_appsetting.Lang,this.srv_appsetting.Country.LACNT).subscribe((res: any) => 
    { 
      if(JSON.parse(res).length>0)     
        return true;
      else
        return false;
    });
    //return false;     
  } 
  
}
