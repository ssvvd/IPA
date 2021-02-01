import { Injectable } from '@angular/core';
import { DatalayerService} from './datalayer.service' ;
import { AppsettingService} from './appsetting.service';
import { Country,Language} from '../models/applications/applications';
import { TranslateService } from '@ngx-translate/core';
import { User } from 'src/app/models/users/user';
import { Observable,of} from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})

export class LoginService {


  constructor(private srv_DataLayer:DatalayerService,
              public srv_appsetting:AppsettingService,public translate: TranslateService,) { }
  
  GetToken():any
  {
    console.log('before token');
    //this.srv_appsetting.AfterToken=false;
    this.srv_DataLayer.get_token().subscribe((res: any)=>{
      //alert(res);          
      let s= environment.signinURL + '?t=' +res;
      console.log(s);    
      window.open(s,'_self');          
      return 'ok'    
    });
    //return'ok';
  }
  
  SignIn(token):any
  {
    console.log('before token');
    //this.srv_appsetting.AfterToken=false;    
    //let s='https://sign.ssl.imc-companies.com/signin?t=' +res;     
    let s= environment.signinURL + '?t=' +token;  
    window.open(s,'_self');
    console.log('after token');
    //this.srv_appsetting.AfterToken=true;      
    return'ok';
  }

  GetTokenwithoutlogin():any
  {
    console.log('before token');
    //this.srv_appsetting.AfterToken=false;
    return this.srv_DataLayer.get_token();
  }

  GetGeneralToken():any
  {
    console.log('before token');
    //this.srv_appsetting.AfterToken=false;
    this.srv_DataLayer.get_token().subscribe((res: any)=>{
      //alert(res);
      let s:string=environment.LoginURLCheckCookies + '?t=' +res;  
      //alert(s);
      console.log(s);
      window.open(s,'_self');   
      console.log('after token');
      
      //this.srv_appsetting.AfterToken=true;
      return 'ok'    
    });
    return'ok';
  }

  UpdateCurrentCountry(countrycode:string)
  {
    this.srv_DataLayer.GetCountryLangBrifData(countrycode).subscribe((d:any)=>
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
        this.srv_appsetting.Country=c;
        this.SetExchangeRate1(c.BrifName);
        this.translate.use(c.LanguageID[0]);                    
      }      
    });
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
    /* if(localStorage.getItem("countryid")!='')
    {
      this.srv_DataLayer.getcountry(localStorage.getItem("countryid")).subscribe((d:any)=>
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

          u.displayName=displayName;
          u.surname=surname;   
          u.givenName=givenName;
          u.email=email;
          u.country=country;
          u.companyName=companyName;
          u.isImc=isImc;
          u.CountryCode=c.CountryCode;
          u.CountryName=c.CountryName;

          this.SelectCountryAndLang(c,c.LanguageID[0]);
          this.SelectLanguage(c.LanguageID[0]);

          //this.srv_appsetting.Country=c;
          this.SetExchangeRate1(c.BrifName);
          //this.translate.use(c.LanguageID[0]);
          localStorage.setItem("countryid","");
        }
      });
    }
    else */
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
        this.UpdateCurrentCountry(d.countryCode);                                     
      }
      );
    else      
      this.UpdateCurrentCountry(u.CountryCode); 
    }
    
    this.srv_appsetting.User=u;  
    this.srv_appsetting.isLoggedIn=true;
    this.srv_appsetting.AfterToken=true;  

  /*    if(localStorage.getItem("language")!='')
    {
      this.SelectLanguage(localStorage.getItem("language"));
      localStorage.setItem("language","");
    }   */
  }
  
  LogIn(token:string):Observable<any>
  {         
    if(token!='')
    {      
      this.srv_DataLayer.login(token).subscribe ((data:any)=>
      { 
          let d=JSON.parse(data); 
          if(d[0].usageLocation==undefined || d[0].email==undefined)   
          {
            this.FillDefaultUser();
          }
          else      
            this.srv_DataLayer.getcountryNamebycountryCode(d[0].usageLocation).subscribe((rr:any)=>
            {
              let cn:string='';
              if(rr!='e') cn=rr.name;                                                     
              let u:User=
              {
              displayName:d[0].displayName,
              surname: d[0].surname,
              givenName: d[0].givenName,
              email: d[0].email,
              country:d[0].country,            
              companyName:d[0].companyName,            
              isImc:d[0].isImc,
              CountryCode:d[0].usageLocation,
              CountryName:cn}
              localStorage.setItem("displayName",d[0].displayName);
              localStorage.setItem("surname",d[0].surname);
              localStorage.setItem("givenName",d[0].givenName);
              localStorage.setItem("email",d[0].email);
              localStorage.setItem("country",d[0].country);
              localStorage.setItem("companyName",d[0].companyName);
              localStorage.setItem("isImc",d[0].isImc); 
              localStorage.setItem("countryCode",d[0].usageLocation);
              localStorage.setItem("countryName",cn);
              this.srv_appsetting.User=u;  
              if(d[0].usageLocation!='' && d[0].usageLocation!=null)
                this.UpdateCurrentCountry(d[0].usageLocation);
              this.srv_appsetting.isLoggedIn=true;
              this.srv_appsetting.AfterToken=true;               
              });  
             /*  if(localStorage.getItem("countryid")!='')
              {
                this.srv_DataLayer.getcountry(localStorage.getItem("countryid")).subscribe((d:any)=>
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
          
                    //u.displayName=displayName;
                    //u.surname=surname;   
                    //u.givenName=givenName;
                    //u.email=email;
                    //u.country=country;
                    //u.companyName=companyName;
                    //u.isImc=isImc;
                    //u.CountryCode=c.CountryCode;
                    //u.CountryName=c.CountryName;
          
                    this.srv_appsetting.Country=c;
                    this.SetExchangeRate1(c.BrifName);
                    this.translate.use(c.LanguageID[0]); 
                    localStorage.setItem("countryid","");
                  }
                });
              } 
              
              if(localStorage.getItem("language")!='')
              {
               
                this.SelectLanguage(localStorage.getItem("language"));                                            
                localStorage.setItem("language","");
              }  */
              return of('ok');
          });                              
    }
    else
    {  
      return;
      //check global cookies user       
        /* if(environment.API_HOST.indexOf('localhost')==-1 && localStorage.getItem("isLogIn") =="1")
        this.srv_DataLayer.get_token().subscribe((res: any)=>{
            let s=environment.LoginURLCheckCookies + '?t=' +res;  
            window.open(s,'_self');           
          });   
        */
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
      if(localStorage.getItem("displayName")!=null) displayName=localStorage.getItem("displayName");
      if(localStorage.getItem("surname")!=null) surname=localStorage.getItem("surname");
      if(localStorage.getItem("givenName")!=null) givenName=localStorage.getItem("givenName");
      if(localStorage.getItem("email")!=null) email=localStorage.getItem("email");
      if(localStorage.getItem("country")!=null) country=localStorage.getItem("country");
      if(localStorage.getItem("companyName")!=null) companyName=localStorage.getItem("companyName");
      if(localStorage.getItem("isImc")!=null) isImc=localStorage.getItem("isImc"); 
      if(localStorage.getItem("countryCode")!=null) countrycode=localStorage.getItem("countryCode"); 
      if(localStorage.getItem("countryName")!=null) countryname=localStorage.getItem("countryName");
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
          this.UpdateCurrentCountry(d.countryCode);                                     
        }
        );
      else      
        this.UpdateCurrentCountry(u.CountryCode);      
    
      this.srv_appsetting.User=u;  
      this.srv_appsetting.isLoggedIn=true;              
    } 
    this.srv_appsetting.isLoggedIn=true;       
    return of('ok'); 
  } 
  
   LogOut()
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
         
  }
  SelectLanguage(LanguageID:string)
  {
    let lan:Language;
    lan=this.srv_appsetting.lstLanguages.find(l=>l.LanguageCode == LanguageID);
    this.srv_appsetting.SelectedLanguage =lan;       
    if (this.translate.getLangs().indexOf(lan.LanguageCode) !== -1)
      this.translate.use(lan.LanguageCode);
    else
      this.translate.use(this.translate.getDefaultLang()); 
        
  }

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
}
