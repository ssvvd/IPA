import { Component,OnInit } from '@angular/core';
import { Router,NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import { AppsettingService} from 'src/app/services/appsetting.service';
import { LoginService } from 'src/app/services/login.service';
import { TranslateService } from '@ngx-translate/core';
import { HttpParams } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
declare let gtag: Function;
import { Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta } from '@angular/platform-browser';

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
              private srv_login:LoginService,private SpinnerService: NgxSpinnerService,
              private renderer2: Renderer2,@Inject(DOCUMENT) private _document, 
              private meta: Meta) {
    if(!location.path().toLowerCase().startsWith('/materials')){
      router.navigate(['/home/machines']); 
    }
    else{
      environment.internal = false;
    }
    
   /*  this.router.events.subscribe(event => {
       if(environment.production)
          if(event instanceof NavigationEnd){
            console.log (event.urlAfterRedirects);
            gtag('config', 'UA-155960-40', 
                      {
                        'page_path': event.urlAfterRedirects
                      }
                      );         
            
          }
        }
 ); */
  }

SetLanguges()
{
  this.translate.addLangs(['EN', 'RU','GM','JP','BS','WZ','DA','SP','WM','FR','WK','IT','WH','LH','WN','WP','PR','WR','WV','WS',
  'IN','SD','VT','WT','HK','WB','MK','WD','TH','WA','KR','LT']); 
  this.translate.setDefaultLang(this.srv_appsetting.LangName);
}

ngOnInit()
{    
  var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    console.log(time);
  console.log('get token app component');
  this.srv_appsetting.AfterToken=false;
  this.SpinnerService.show();
  let token:string='';  
  
  let isLogIn:string='-1'; //todo:!!!!!! -1!!!  
  const url = window.location.href; 
 
    //meta data index.html - disable login
    const enablelogin = this.meta.getTag('name=enablelogin');
    if(enablelogin.content=='0') isLogIn ='0';
  if(this.location.path().toLowerCase().startsWith('/materials')) 
  {
    let paramValue;
    if(url.includes('?'))
    {
      const httpParams = new HttpParams({ fromString: url.split('?')[1] });
      paramValue = httpParams.get('lang');        
      if(paramValue==null) paramValue='GM';   
      localStorage.setItem("language",paramValue.toUpperCase());            
    }   
    this.SetLanguges();
    this.translate.use(paramValue);  
    return;
   
  } 
  let result:string="";

  if (url.includes('?')) {
    
    let paramValue:string='';
    const httpParams = new HttpParams({ fromString: url.split('?')[1] });     
    
    let countryid:string;
    paramValue = httpParams.get('countryid'); 
    
    if(paramValue!=null) {
      countryid =paramValue; 
      localStorage.setItem("countryid",countryid);
      /* if(countryid=='7')
        this.CreateScriptGermanyChat(); */
    }

    let language:string;
    paramValue = httpParams.get('lang'); 
    if(paramValue!=null) {
      language =paramValue; 
      localStorage.setItem("language",language.toUpperCase());
    } 
    if(httpParams.get('result')!=null) result = httpParams.get('result');     
  }

    if(result=="" && this.meta.getTag('name=enablelogin').content =='1') 
    {
        let sitetype:string ="local";
        //let sitetype:string ="debug";
        if(environment.production)  sitetype="global";
        //sitetype ="debug";//todo: temp
        //alert(2);
        let s_checkcookies:string=environment.urlCheckCookies+ "?sId=ingITA&sitetype=" + sitetype + "&lang=" +this.srv_appsetting.Lang;
        window.open(s_checkcookies,'_self'); 
        //window.location.href = s_checkcookies
    }
    if(result=='0' || this.meta.getTag('name=enablelogin').content =='0')
    {
      this.srv_appsetting.isLoggedIn=true;          
      this.srv_login.FillDefaultUser();      
      localStorage.setItem("isLogIn",null);
    }
    if(result!='1' && result!='' && result!='0')
    {
       //this.srv_login.LogIn(result);
       token=result;
    }
  

  var XHR;
  XHR = window.XMLHttpRequest;
  //alert(XHR);
  
  


  /* if(isLogIn!="-1")
  { */
  if(isLogIn =='0') //enable login
    {       
        this.srv_appsetting.isLoggedIn=true;
        this.srv_login.FillDefaultUser();
        this.srv_login.FillCountryLanguageByURLParameters();
        localStorage.setItem("isLogIn",null);
    }                                               
  /* } */
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
      //this.srv_login.GetGeneralToken();
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


CreateScriptGermanyChat()
{
  const s = this.renderer2.createElement('script');
  s.type = 'text/javascript';
  s.async = true;
  s.src="https://userlike-cdn-widgets.s3-eu-west-1.amazonaws.com/e79cf993609f4b9fa9d4067183a806791ef00b4ae85c480a94f330e12c66684b.js";
  s.text = "";
  this.renderer2.appendChild(this._document.body, s);
}


}


