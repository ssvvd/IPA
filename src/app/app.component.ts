import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import { AppsettingService} from 'src/app/services/appsetting.service';
import { LoginService } from 'src/app/services/login.service';
import { TranslateService } from '@ngx-translate/core';
import { HttpParams } from '@angular/common/http';

import cssVars from 'css-vars-ponyfill';
//import { User } from './models/users/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'IscarToolAdvisor';
  environment=environment;

  constructor(location: Location, router: Router, private srv_appsetting:AppsettingService,
              public translate:TranslateService,
              private srv_login:LoginService) {
    if(!location.path().toLowerCase().startsWith('/materials')){
      router.navigate(['/home/machines']); 
    }
    else{
      environment.internal = false;
    }
    
  }

ngOnInit()
{  
  console.log('get token app component');
  this.srv_appsetting.AfterToken=false;
  let token:string=''; 

  //localStorage.setItem("isLogIn",null); //for test

  let isLogIn:string='-1'; //todo:!!!!!! -1!!!  
  const url = window.location.href;    
  if (url.includes('?')) {
    let paramValue:string='';
    const httpParams = new HttpParams({ fromString: url.split('?')[1] });
    paramValue = httpParams.get('T'); 
    if(paramValue!=null) token =paramValue; 
    
    paramValue = httpParams.get('v');  
    if(paramValue!=null) isLogIn =paramValue; 
                    
  }
  
  //first time enter
  if(isLogIn!="-1")
  {
    if(isLogIn =='0')
    {
        //this.srv_appsetting.AfterToken=true;
        this.srv_appsetting.isLoggedIn=true;
        this.srv_login.FillDefaultUser();
        localStorage.setItem("isLogIn",null);
    }     
   /*  if(isLogIn =='1')
    {
      this.srv_login.SignIn(token);
        //this.srv_appsetting.isLoggedIn=true;
        //this.srv_appsetting.AfterToken=true; 
        localStorage.setItem("isLogIn",null);           
            
    }   */                                              
  }
  else
  {
    if(token!='')
    {
        this.srv_login.LogIn(token).subscribe(res=>{
          this.srv_appsetting.isLoggedIn=true;
          //this.srv_appsetting.AfterToken=true;         
        }
      );   
    }
     else{
      this.srv_login.GetGeneralToken();
      this.srv_appsetting.isLoggedIn=true;
    }
    
  }
 
  this.translate.addLangs(['EN', 'RU','GM','JP','BS','WZ','DA','SP','WM','FR','WK','IT','WH','LH','WN','WP','PR','WR','WV','WS',
  'IN','SD','VT','WT','HK','WB','MK','WD','TH','WA','KR']);
  this.translate.setDefaultLang(this.srv_appsetting.LangName);

  cssVars({
  onlyLegacy: false,
  watch: true,
  onComplete(cssText, styleNode, cssVariables) {
   
  }});
  
}

GetUserData()
{
  //this.srv_login.GetUserData();
  
}

}


