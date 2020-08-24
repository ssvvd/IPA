import { Injectable } from '@angular/core';
import { CookiesService } from  'src/app/services/cookies.service' ;
import { DatalayerService} from 'src/app/services/datalayer.service' ;
import { AppsettingService} from 'src/app/services/appsetting.service';
import { Country,Language} from 'src/app/models/applications/applications';
import { TranslateService } from '@ngx-translate/core';
import { User } from 'src/app/models/users/user';
import { Observable,of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  constructor(private srv_cook:CookiesService,private srv_DataLayer:DatalayerService,
              public srv_appsetting:AppsettingService,public translate: TranslateService,) { }
  
  GetToken():any
  {
    this.srv_DataLayer.get_token().subscribe((res: any)=>{
      let s='https://sign.ssl.imc-companies.com/signin?t=' +res;
      //localStorage.setItem('token_login', res);
      window.open(s,'_self');
      return 'ok'    
    });
    return'ok';
  }

  LogIn(token:string):Observable<any>
  {     
    if(token!='')
    {      
      this.srv_DataLayer.login(token).subscribe ((data:any)=>
      {    
        console.log(data);         
        let d=JSON.parse(data);                                                         
        let u:User=
          {
            displayName:d[0].displayName,
            surname: d[0].surname,
            givenName: d[0].givenName,
            email: d[0].email,
            country:d[0].country,
            companyName:d[0].companyName,            
            isImc:d[0].isImc,
            CountryCode:d[0].CountryCode}
            localStorage.setItem("displayName",d[0].displayName);
            localStorage.setItem("surname",d[0].surname);
            localStorage.setItem("givenName",d[0].givenName);
            localStorage.setItem("email",d[0].email);
            localStorage.setItem("country",d[0].country);
            localStorage.setItem("companyName",d[0].companyName);
            localStorage.setItem("isImc",d[0].isImc);     
            this.srv_appsetting.User=u;  
            this.srv_appsetting.isLoggedIn=true;               
      });    
      return of('ok');  
    }
    else
    {  
      let u=new User;  
      let displayName:string='';
      let surname:string='';
      let givenName:string='';
      let email:string=''
      let country:string='';
      let companyName:string='';
      let isImc:string='';
      if(localStorage.getItem("displayName")!=null) displayName=localStorage.getItem("displayName");
      if(localStorage.getItem("surname")!=null) surname=localStorage.getItem("surname");
      if(localStorage.getItem("givenName")!=null) givenName=localStorage.getItem("givenName");
      if(localStorage.getItem("email")!=null) email=localStorage.getItem("email");
      if(localStorage.getItem("country")!=null) country=localStorage.getItem("country");
      if(localStorage.getItem("companyName")!=null) companyName=localStorage.getItem("companyName");
      if(localStorage.getItem("isImc")!=null) isImc=localStorage.getItem("isImc"); 
      u.displayName=displayName;
      u.surname=surname;
      u.givenName=givenName;
      u.email=email;
      u.country=country;
      u.companyName=companyName;
      u.isImc=isImc;
      if(country=='')
        this.srv_DataLayer.getGEOLocation().subscribe((d:any)=>
        {       
          {   
            //alert(d.countryCode) ;          
            this.srv_DataLayer.GetCountryLangBrifData(d.countryCode).subscribe((d:any)=>
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
                c.LanguageID =data[0].CATLAN;
                c.CountryCode =data[0].CountryCode;
                this.srv_appsetting.Country=c;
                this.SetExchangeRate1(c.BrifName);
             /*    this.srv_DataLayer.getcurrencyeciw(c.BrifName).subscribe((cur:any)=>
                {
                  if(JSON.parse(cur).length>0)       
                    if(JSON.parse(cur)[0].ECUR=='') 
                      c.Currency='USD';
                    else
                      c.Currency= JSON.parse(cur)[0].ECUR;              
                  else      
                    c.Currency='USD'; 
                    
                  this.srv_appsetting.Country=c;
                  this.srv_appsetting.Currency=c.Currency;
                });    */                          
              }
              
            }
            );
          }
        }
        );

    
      this.srv_appsetting.User=u;  
      this.srv_appsetting.isLoggedIn=true;              
    } 
    this.srv_appsetting.isLoggedIn=true;       
    return of('ok'); 
  } 
  
  LogOut()
  {
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
    localStorage.setItem("displayName",'');     
    this.srv_appsetting.User=u;  
    this.srv_appsetting.isLoggedIn=true;
  }

 /*  GetCurrencyByBrifName(brifname:string):any 
  {
    this.srv_DataLayer.getcurrencyeciw(brifname).subscribe((cur:any)=>
    {
      let currency:string;
      if(JSON.parse(cur).length>0)       
        if(JSON.parse(cur)[0].ECUR=='') 
          currency='USD';
        else
        currency= JSON.parse(cur)[0].ECUR;              
      else      
        currency='USD'; 
        
      this.srv_appsetting.Country.Currency=currency;
      this.srv_appsetting.Currency=currency;
    });     
  } */

  SelectCountryAndLang(c:Country,LanguageID:string) :any
  {
    let lan:Language;
    lan=this.srv_appsetting.lstLanguages.find(l=>l.LanguageCode == LanguageID);
    this.srv_appsetting.SelectedLanguage =lan;       
    if (this.translate.getLangs().indexOf(lan.LanguageCode) !== -1)
      this.translate.use(lan.LanguageCode);
    else
      this.translate.use(this.translate.getDefaultLang()); 
        
    this.srv_appsetting.Country=c;          
    this.SetExchangeRate1 (c.BrifName);
    /* this.srv_DataLayer.getcurrencyeciw(c.BrifName).subscribe((cur:any)=>
    {
      if(JSON.parse(cur).length>0)       
        if(JSON.parse(cur)[0].ECUR=='') 
          c.Currency='USD';
        else
          c.Currency= JSON.parse(cur)[0].ECUR;              
      else      
        c.Currency='USD'; 
        
      this.srv_appsetting.Country=c;
      this.srv_appsetting.Currency=c.Currency;

      this.SetExchangeRate();
    });    
     */
    this.srv_appsetting.FillLanguage(lan.LanguageCode).subscribe((data: any)=> {   
     });    
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
      //alert(rate);
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
        //alert(rate);
        });
     });
    }
}
