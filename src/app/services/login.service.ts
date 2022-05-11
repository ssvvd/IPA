import { Injectable } from '@angular/core';
import { DatalayerService} from './datalayer.service' ;
import { AppsettingService} from './appsetting.service';
import { Country,Language} from '../models/applications/applications';
import { TranslateService } from '@ngx-translate/core';
import { User } from 'src/app/models/users/user';
import { Observable,of} from 'rxjs';
import { environment } from '../../environments/environment';
import { NgxSpinnerService } from "ngx-spinner"; 
import { Meta } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { HttpClient} from '@angular/common/http';

import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  private API_ROUTE = 'api/login/';
  private obsLanguageChanged = new BehaviorSubject<boolean>(true);
  CurrentLanguageChanged = this.obsLanguageChanged.asObservable();   
  
  constructor(private srv_DataLayer:DatalayerService,private httpClient: HttpClient,
              public srv_appsetting:AppsettingService,public translate: TranslateService,private SpinnerService: NgxSpinnerService,
              private meta: Meta) { }
  
  GetToken():any
  {
    console.log('before token');
    this.srv_DataLayer.get_token().subscribe((res: any)=>{
    
        //https://www.iscar.com/imcLogin/checkcookie.aspx  
        let s=environment.urlCheckCookies + "?sId=iscita21&sitetype=local&lang=EN";    
        console.log(s);    
        window.open(s,'_self');          
        return 'ok'    
      
    });
  }
  
  SignIn():any
  {
    console.log('before token');
    //this.srv_appsetting.AfterToken=false;    
    //let s='https://sign.ssl.imc-companies.com/signin?t=' +res;     
    //let s= environment.signinURL + '?t=' +token; 
    let sitetype:string ="local";
    //let sitetype:string ="debug";
    if(environment.production)  sitetype="global";
    //sitetype ="debug";//todo: temp 
    let s= environment.urlLogIn + "?sId=iscita21&sitetype=" +sitetype +"&lang=" +this.srv_appsetting.Lang;
    
    window.open(s,'_self');
    console.log('after token');
 
    return'ok';
  }


  GetTokenwithoutlogin():any
  {
    console.log('before token');
    //this.srv_appsetting.AfterToken=false;
    return this.srv_DataLayer.get_token();
  }

 
  FillDataCountryByData(data:any)
  {
    let c:Country =new Country;
    c.BrifName =data[0].BrifName;
    c.CountryFlag ='';
    c.CountryGlobalId = 0;
    c.CountryID = data[0].CountryId;
    c.CountryName =data[0].CountryName;              
    c.LanguageID.push(data[0].CATLAN);
    c.CountryCode =data[0].CountryCode;
    c.ShowPrice =data[0].ShowPrice==null?0:1;
    c.LACNT = data[0].LACNT;
    c.FCSToolshopSite =data[0].FCSToolshopSite;
    this.srv_appsetting.Country=c;    
    this.SetExchangeRate1(c.BrifName);
    this.SelectLanguage(data[0].CATLAN);                          
  }

  UpdateCurrentCountry(countrycode:string)
  {
    this.srv_DataLayer.GetCountryLangBrifData(countrycode).subscribe((d:any)=>
    {
      let data = JSON.parse(d);
      if(data.length==0)
        this.srv_DataLayer.GetCountryLangBrifData('US').subscribe((d:any)=>
        {
          data = JSON.parse(d);
          this.FillDataCountryByData(data);
        });
      else
      {
        this.FillDataCountryByData(data);
      }});     
  }

  FillDefaultUser()
  {
    //alert('login');
    let u=new User;  
    let displayName:string='';
    let surname:string='';
    let givenName:string='';
    let email:string=''
    let country:string='';
    let companyName:string='';
    let isImc:string='';
    let countrycode:string='';
    let countryname:string='';
    {
      u.displayName=displayName;
      u.surname=surname;   
      u.givenName=givenName;
      u.email=email;
      u.country=country;
      u.companyName=companyName;
      u.isImc=isImc;
      u.CountryCode=countrycode;
      u.CountryName=countryname;
      if(u.CountryCode=='')
        this.srv_DataLayer.getGEOLocation().subscribe((d:any)=>
        {                    
        if(d.country==undefined)  
            this.UpdateCurrentCountry('US');          
          else 
          {
            this.UpdateCurrentCountry(d.country);
            //this.UpdateCurrentCountry('DE');
          }        
                                                
        }
      );
    else      
      this.UpdateCurrentCountry(u.CountryCode); 
    }
       
    this.srv_appsetting.User=u;  
    this.srv_appsetting.isLoggedIn=true;
    this.srv_appsetting.AfterToken=true;  
    this.SpinnerService.hide();
  }
  
  LogIn(token:string):Observable<any>
  { 
     
    if(token!='')
    {     
      if(token.indexOf('user name is not valid')>-1)  
      {
        console.log('token');
        console.log(token);
        
        this.FillDefaultUser();        
        this.srv_appsetting.AfterToken=true; 
        this.FillCountryLanguageByURLParameters();
        this.SpinnerService.hide();        
        return;
      } 

      this.srv_DataLayer.login(token).subscribe ((data:any)=>
      { 
          let d=JSON.parse(data); 
          console.log(data);
          
          if( d[0].email==undefined)   
          {
            console.log('login subscribe');
            console.log(data);
            this.FillDefaultUser();
            this.srv_appsetting.AfterToken=true; 
            this.FillCountryLanguageByURLParameters();
            this.SpinnerService.hide();    
          }
          else
          {    
            let countrycode:string=""; 
            if((d[0].countryCode!=undefined && d[0].countryCode!=null) || (d[0].usageLocation !=undefined && d[0].usageLocation!=null))
            {             
              if(d[0].countryCode!=undefined && d[0].countryCode!=null) countrycode=d[0].countryCode;
              if(d[0].usageLocation!=undefined && d[0].usageLocation!=null)  countrycode=d[0].usageLocation;  
              this.FillUserData(d,countrycode,d[0].country);
              this.FillCountryLanguageByURLParameters();
            }
            else
            {
              this.srv_DataLayer.getcountryCodebycountryName(d[0].country).subscribe((rr:any)=>
              {
                countrycode=rr.alpha2Code;
                this.FillUserData(d,countrycode,d[0].country);
                this.FillCountryLanguageByURLParameters();
              });
            }
          }                                                                       
           return of('ok');
          });                              
    }
    else
    {  
      this.SpinnerService.hide(); 
      return;                
    } 
    this.srv_appsetting.isLoggedIn=true;       
    return of('ok'); 
  } 

  FillUserData(d:any,countrycode:string,countryname:string)
  {
    let cn:string='';      
    let u:User=
    {
    displayName:d[0].displayName,
    surname: d[0].surname,
    givenName: d[0].givenName,
    email: d[0].email,
    country:countryname,            
    companyName:d[0].companyName,            
    isImc:d[0].isImc,
    CountryCode:countrycode,
    CountryName:cn}
    localStorage.setItem("displayName",d[0].displayName);
    localStorage.setItem("surname",d[0].surname);
    localStorage.setItem("givenName",d[0].givenName);
    localStorage.setItem("email",d[0].email);
    localStorage.setItem("country",d[0].country);
    localStorage.setItem("companyName",d[0].companyName);
    localStorage.setItem("isImc",d[0].isImc); 
    localStorage.setItem("countryCode",countrycode);
    localStorage.setItem("countryName",cn);
    this.srv_appsetting.User=u;  
    if(countrycode!='' && countrycode!=null)
      this.UpdateCurrentCountry(countrycode);
    this.srv_appsetting.isLoggedIn=true;
    this.srv_appsetting.AfterToken=true;  
    this.SpinnerService.hide(); 
  }
  LogOutNew()
  {
    let sitetype:string;
      if(environment.production)    
        sitetype ='global';   
      else
        sitetype ='local';
      //sitetype ='debug';  //todo:
    let strLogOut:string=environment.urlSignOut + '&sitetype=' + sitetype + "&lang=" + this.srv_appsetting.Lang;
    window.open(strLogOut,'_self');
  }
  
  /* LogOut()
  {
     this.srv_DataLayer.get_token().subscribe((res: any)=>{      
      let s= environment.LoginURLogOut + '?t=' +res;  
      window.open(s,'_self');
      let u=new User;  
      u.displayName='';
      u.surname='';
      u.givenName='';
      u.email=''
      u.country='';
      u.companyName='';
      u.isImc='';
      localStorage.setItem("displayName",'');
      localStorage.setItem("surname",'');
      localStorage.setItem("givenName",'');
      localStorage.setItem("email",'');
      localStorage.setItem("country",'');
      localStorage.setItem("companyName",'');
      localStorage.setItem("isImc",''); 
      localStorage.setItem("countryCode",'');
      localStorage.setItem("countryName",'');   
      this.srv_appsetting.User=u;  
      
      this.srv_appsetting.isLoggedIn=true;         
    });
         
  } */
  SelectLanguage(LanguageID:string)
  {
    let lan:Language;
    lan=this.srv_appsetting.lstLanguages.find(l=>l.LanguageCode == LanguageID);
    if(lan!==undefined)
    {
      this.srv_appsetting.SelectedLanguage =lan;       
      if (this.translate.getLangs().indexOf(lan.LanguageCode) !== -1)
        this.translate.use(lan.LanguageCode);
      else
        this.translate.use(this.translate.getDefaultLang());
    }             
  }

  SelectCountryAndLang(c:Country,LanguageID:string) :any
  {
    let lan:Language;
    lan=this.srv_appsetting.lstLanguages.find(l=>l.LanguageCode == LanguageID);
    let flgChangeGerany:boolean =false;
    if(lan!==undefined)
    {
      //if((lan.LanguageCode!=this.srv_appsetting.SelectedLanguage.LanguageCode) && lan.LanguageCode=='GM' || this.srv_appsetting.SelectedLanguage.LanguageCode =='GM') flgChangeGerany=true;
      this.srv_appsetting.SelectedLanguage =lan;       
      if (this.translate.getLangs().indexOf(lan.LanguageCode) !== -1)
        this.translate.use(lan.LanguageCode);
      else
        this.translate.use(this.translate.getDefaultLang());
         
      localStorage.setItem("language",lan.LanguageName.toUpperCase());
    }         
    this.srv_appsetting.Country=c;    
    localStorage.setItem("countryid",c.CountryID.toString());        
    this.SetExchangeRate1 (c.BrifName);     
  }

  ChangedLanguageGermany()
  {
     this.obsLanguageChanged.next(true);
  }

  SetExchangeRate()
  {
    this.srv_appsetting.getexchangerate(this.srv_appsetting.Currency).subscribe((res: any) =>
    { 
      if(res.length>0)
      {
        let rate :any=JSON.parse(res)[0].Exchange; 
        this.srv_appsetting.CurrRate=rate;        
      }                  
    });
  }

  SetExchangeRate1(BrifName:string)
  {
    this.srv_DataLayer.getcurrencyeciw(BrifName).subscribe((cur:any)=>
    {
      let c:string;
      if(JSON.parse(cur).length>0)       
        if(JSON.parse(cur)[0].ECUR=='') 
          c='USD';
        else
          c= JSON.parse(cur)[0].ECUR;              
      else      
        c='USD'; 
        
      this.srv_appsetting.Country.Currency=c;
      this.srv_appsetting.Currency=c;
      this.srv_appsetting.getexchangerate(this.srv_appsetting.Currency).subscribe((res: any) =>
      { 
        if(res.length>0)
        {
          let rate :any=JSON.parse(res)[0].Exchange; 
          this.srv_appsetting.CurrRate=rate;          
        }                    
        });
     });
    }

    FillCountryLanguageByURLParameters()
    {
      if(localStorage.getItem("countryid")!=null && localStorage.getItem("countryid")!='')
      {
        this.srv_DataLayer.getcountry(localStorage.getItem("countryid")).subscribe((d:any)=>
        {
          this.FillDataCountry(d);     
        }      
        );    
      }
      if(localStorage.getItem("language")!=null && localStorage.getItem("language")!='')
        {
          this.SelectLanguage(localStorage.getItem("language"));
        
        }
    }
    
    FillDataCountry(d:any)
    {
      let data = JSON.parse(d);
      if(data.length>0)
      {
        let c:Country =new Country;
        c.BrifName =data[0].BrifName;
        c.CountryFlag ='';
        c.CountryGlobalId = 0;
        c.CountryID = data[0].CountryId;
        c.CountryName =data[0].CountryName;              
        c.LanguageID.push(data[0].CATLAN);
        c.CountryCode =data[0].CountryCode;
        c.LACNT = data[0].LACNT;
  
    
        this.SelectCountryAndLang(c,c.LanguageID[0]);          
        this.SelectLanguage(c.LanguageID[0]);
              
        this.SetExchangeRate1(c.BrifName);
        localStorage.setItem("countryid","");  // todo:               
      }
      if(localStorage.getItem("language")!=null && localStorage.getItem("language")!='')
      {
        this.SelectLanguage(localStorage.getItem("language"));          
      }
    }  

     //geturlthreadcompass  
    public  geturlthreadcompass() : any
    {     
      return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'get-threadcompassurl');
    }
}
