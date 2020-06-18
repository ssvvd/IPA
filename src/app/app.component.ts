import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import { AppsettingService} from 'src/app/services/appsetting.service';
import { VisitorsService} from 'src/app/services/visitors.service';
import { TranslateService } from '@ngx-translate/core';
import cssVars from 'css-vars-ponyfill';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'IscarToolAdvisor';
  environment=environment;
  
  constructor(location: Location, router: Router,private srv_visitors:VisitorsService, private srv_appsetting:AppsettingService,
              public translate:TranslateService) {
    if(location.path().toLowerCase() != '/materials'){
      router.navigate(['/home/machines']); 
    }
    else{
      environment.internal = false;
    }
    // console.log(location.path());

  }

ngOnInit()
{
  cssVars({
  onlyLegacy: false,
  watch: true,
  onComplete(cssText, styleNode, cssVariables) {
    //console.log(cssText);
  }});
  
  this.translate.addLangs(['EN', 'RU','GM','JP','BS','WZ','DA','SP','WM','FR','WK','IT','WH','LH','WN','WP','PR','WR','WV','WS',
                           'IN','SD','VT','WT','HK','WB','MK','WD','TH','WA','KR']);
  this.translate.setDefaultLang(this.srv_appsetting.LangName);

  //check with HTTPS:// -TODO:
  this.srv_appsetting.Country ="35";
}
}


