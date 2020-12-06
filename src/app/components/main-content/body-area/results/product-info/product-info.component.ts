import { Component, OnInit, Input, SimpleChanges,OnChanges, Output, EventEmitter  } from '@angular/core';
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
  startLoadingFrames:string;
  iframesCount:number;
  iframesLoadedCount:number;
  // @Output() showDownLoad = new EventEmitter<boolean>();
  _hideDownLoad5:boolean = false;

  constructor(private sanitizer: DomSanitizer,private srv_appsetting:AppsettingService,private srv_statemanage:StateManagerService) { }

  ngOnInit(): void {
    this.loadedFrames = '';
    this.startLoadingFrames ='';
    this.iframesLoadedCount = 0;
    this._hideDownLoad5 = false;
    if (this.SRC == "ITA2"){
      this._hideDownLoad5 = true
      // this.showDownLoad.emit(false);
    }
     
    // this.iframesCount = -1;
  }

  ngOnChanges(changes:SimpleChanges) {

    if (this.viewParamsChanged && changes.viewParamsChanged){
      this.selectedOption = this.viewParamsChanged.Res[0]
      this.iframesCount = this.selectedOption.CatalogNo.length
    }
  }

  // getUrl(post)
  // {
  //   return this.sanitizer.bypassSecurityTrustResourceUrl(post);
  // }

  getUrl1(row:string,PrtNum:number)
  {
    if (row.trim().length != 7 || this.startLoadingFrames.includes(PrtNum.toString())){
      return 'about:blank'
    }

    if (PrtNum > -1)
    this.startLoadingFrames = this.startLoadingFrames.concat(PrtNum.toString())


    let _index:number = this.selectedOption.CatalogNo.indexOf(row)
    let mapp:string = 'IT'
    if (this.selectedOption.itemType[_index].trim() != 'H'){
      mapp = this.srv_statemanage.SecAppSelected.MainApp
    }

    let url:string = environment.eCatItemPage + row.trim() + '&SRC=' + this.SRC  + '&fnum=' + this.selectedOption.Families[_index].trim()
     + '&mapp=' + mapp + '&GFSTYP=' + this.srv_appsetting.Units + '&lang=' + this.srv_appsetting.Lang

    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

//   getResolvedUrl(route: ActivatedRouteSnapshot): string {
//     return route.pathFromRoot
//         .map(v => v.url.map(segment => segment.toString()).join('/'))
//         .join('/');
// }

// getConfiguredUrl(route: ActivatedRouteSnapshot): string {
//     return '/' + route.pathFromRoot
//         .filter(v => v.routeConfig)
//         .map(v => v.routeConfig!.path)
//         .join('/');
// }

finishLoadingFrame(PrtNum:number){
  if (PrtNum > -1){
    this.loadedFrames = this.loadedFrames.concat(PrtNum.toString())
    this.iframesLoadedCount = this.iframesLoadedCount + 1;
    if(this.isLoadedAll()){
      // this.showDownLoad.emit(true);
      this._hideDownLoad5 = false
    }
     
  }
    
}

isLoaded(PrtNum:number){
  return this.loadedFrames.includes(PrtNum.toString())
}

isLoadedAll(){
  return this.iframesLoadedCount == this.iframesCount;
}

}
