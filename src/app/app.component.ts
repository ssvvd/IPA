import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import { AppsettingService} from 'src/app/services/appsetting.service';
import { LoginService } from 'src/app/services/login.service';
import { TranslateService } from '@ngx-translate/core';
import { HttpParams } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
//import { CookiesService } from 'src/app/services/cookies.service';

//import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import cssVars from 'css-vars-ponyfill';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'IscarToolAdvisor';
  environment=environment;

  constructor(private location: Location,private router: Router, private srv_appsetting:AppsettingService,
              public translate:TranslateService,
              private srv_login:LoginService,private SpinnerService: NgxSpinnerService) {
    if(!location.path().toLowerCase().startsWith('/materials')){
      router.navigate(['/home/machines']); 
    }
    else{
      environment.internal = false;
    }
    
  }

SetLanguges()
{
  this.translate.addLangs(['EN', 'RU','GM','JP','BS','WZ','DA','SP','WM','FR','WK','IT','WH','LH','WN','WP','PR','WR','WV','WS',
  'IN','SD','VT','WT','HK','WB','MK','WD','TH','WA','KR','LT']);
  //alert(this.srv_appsetting.LangName);
  this.translate.setDefaultLang(this.srv_appsetting.LangName);
}

ngOnInit()
{  

  console.log('get token app component');
  this.srv_appsetting.AfterToken=false;
  this.SpinnerService.show();
  let token:string='';  
  
  let isLogIn:string='-1'; //todo:!!!!!! -1!!!  
  const url = window.location.href; 
  
  if(this.location.path().toLowerCase().startsWith('/materials')) 
  {
    let paramValue;
    if(url.includes('?'))
    {
      const httpParams = new HttpParams({ fromString: url.split('?')[1] });
      paramValue = httpParams.get('lang');  
      if(paramValue==null) paramValue='EN';               
    }   
    this.SetLanguges();
    this.translate.use(paramValue);
    return;
  }    

  if (url.includes('?')) {
    let paramValue:string='';
    const httpParams = new HttpParams({ fromString: url.split('?')[1] });
    paramValue = httpParams.get('T'); 
    if(paramValue!=null) token =paramValue; 
    
    paramValue = httpParams.get('v');  
    if(paramValue!=null) isLogIn =paramValue; 
    
    let countryid:string;
    paramValue = httpParams.get('countryid'); 
    if(paramValue!=null) {
      countryid =paramValue; 
      localStorage.setItem("countryid",countryid);
    }

    let language:string;
    paramValue = httpParams.get('lang'); 
    if(paramValue!=null) {
      language =paramValue; 
      localStorage.setItem("language",language.toUpperCase());
    }
    //todo: country, language
  }
  
  //first time enter
  if(isLogIn!="-1")
  {
    if(isLogIn =='0')
    {       
        this.srv_appsetting.isLoggedIn=true;
        this.srv_login.FillDefaultUser();
        localStorage.setItem("isLogIn",null);
    }                                               
  }
  else
  {
    if(token!='')
    {
        this.srv_login.LogIn(token).subscribe(res=>{
          this.srv_appsetting.isLoggedIn=true;         
        }
      );   
    }
     else{
      this.srv_login.GetGeneralToken();
      this.srv_appsetting.isLoggedIn=true;
    }
    
  }
 
  this.translate.addLangs(['EN', 'RU','GM','JP','BS','WZ','DA','SP','WM','FR','WK','IT','WH','LH','WN','WP','PR','WR','WV','WS',
  'IN','SD','VT','WT','HK','WB','MK','WD','TH','WA','KR','LT']);
  //alert(this.srv_appsetting.LangName);
  this.translate.setDefaultLang(this.srv_appsetting.LangName);

  cssVars({
  onlyLegacy: false,
  watch: true,
  onComplete(cssText, styleNode, cssVariables) {
   
  }});
  
}


}


