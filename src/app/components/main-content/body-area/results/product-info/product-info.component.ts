import { Component, OnInit, Input, SimpleChanges,OnChanges  } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {clsHelpProp} from 'src/app/models/results/help-prop';
import { environment } from 'src/environments/environment';
import { AppsettingService} from 'src/app/services/appsetting.service';
import { StateManagerService } from 'src/app/services/statemanager.service';
import { ActivatedRouteSnapshot } from '@angular/router';

@Component({
  selector: 'product-info',
  templateUrl: './product-info.component.html',
  styleUrls: ['./product-info.component.scss']
})
export class ProductInfoComponent implements OnInit,OnChanges  {

  @Input() viewParamsChanged: any ;
  @Input() SRC: string ;
  selectedOption:clsHelpProp;
  environment = environment;
  loadedFrames:string;

  constructor(private sanitizer: DomSanitizer,private srv_appsetting:AppsettingService,private srv_statemanage:StateManagerService) { }

  ngOnInit(): void {
    this.loadedFrames = '';
  }

  ngOnChanges(changes:SimpleChanges) {

    if (this.viewParamsChanged && changes.viewParamsChanged){
      this.selectedOption = this.viewParamsChanged.Res[0]
    }
  }

  getUrl(post)
  {
    return this.sanitizer.bypassSecurityTrustResourceUrl(post);
  }

  getUrl1(row:string)
  {
    if (row.trim().length != 7){
      return this.sanitizer.bypassSecurityTrustResourceUrl('')
    }
    let _index:number = this.selectedOption.CatalogNo.indexOf(row)
    let mapp:string = 'IT'
    if (this.selectedOption.itemType[_index].trim() != 'H'){
      mapp = this.srv_statemanage.SecAppSelected.MainApp
    }

    let url:string = environment.eCatItemPage + row.trim() + '&SRC=' + this.SRC  + '&fnum=' + this.selectedOption.Families[_index].trim()
     + '&mapp=' + mapp + '&GFSTYP=' + this.srv_appsetting.Units + '&lang=' + this.srv_appsetting.Lang

    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  getResolvedUrl(route: ActivatedRouteSnapshot): string {
    return route.pathFromRoot
        .map(v => v.url.map(segment => segment.toString()).join('/'))
        .join('/');
}

getConfiguredUrl(route: ActivatedRouteSnapshot): string {
    return '/' + route.pathFromRoot
        .filter(v => v.routeConfig)
        .map(v => v.routeConfig!.path)
        .join('/');
}

finishLoadingFrame(PrtNum:number){
  if (PrtNum > -1)
    this.loadedFrames = this.loadedFrames.concat(PrtNum.toString())
}

isLoaded(PrtNum:number){
  return this.loadedFrames.includes(PrtNum.toString())
}



}
