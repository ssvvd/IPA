import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import {clsHelpProp} from 'src/app/models/results/help-prop';
import { environment } from 'src/environments/environment';
import { StateManagerService} from 'src/app/services/statemanager.service' ;
import { AppsettingService} from 'src/app/services/appsetting.service';

@Component({
  selector: 'inner-tabs-table',
  templateUrl: './inner-tabs-table.component.html',
  styleUrls: ['./inner-tabs-table.component.scss']
})
export class InnerTabsTableComponent implements OnInit {

  @Input() viewParamsChanged: any ;
  selectedOption:clsHelpProp;
  environment = environment;

  constructor(private srv_StMng:StateManagerService,private srv_appsetting:AppsettingService) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes:SimpleChanges) {
    if (this.viewParamsChanged && changes.viewParamsChanged){
      this.selectedOption = this.viewParamsChanged.Res[0]
    }
  }

  changeSource(event, name) { event.target.src = name; }

  goToCatalog(itemIndex){
    let mapp:string = 'IT'
    if (this.selectedOption.itemType[itemIndex].trim() != 'H'){
      mapp = this.srv_StMng.SecAppSelected.MainApp
    }
  
    let url:string = environment.eCatItemPage + this.selectedOption.CatalogNo[itemIndex].trim()  + '&fnum=' + this.selectedOption.Families[itemIndex].trim()
     + '&mapp=' + mapp + '&GFSTYP=' + this.srv_appsetting.Units + '&lang=' + this.srv_appsetting.Lang
  
     window.open(url, "_blank");

  }

}
