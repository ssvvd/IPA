import { Injectable } from '@angular/core';
import { Language,Country} from '../models/applications/applications';
import { User} from '../models/users/user';
import { DatalayerService} from './datalayer.service' ;
import { CookiesService } from './cookies.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { NULL_EXPR } from '@angular/compiler/src/output/output_ast';

@Injectable({ 
  providedIn: 'root'
})
export class AppsettingService {

  
  public innerheightmaincontent:number;
  public innerheightmaincontent1:number;
  constructor(private srv_DataLayer:DatalayerService,private srv_cook:CookiesService) { }
  
  private mUnits:string =''; //todo:
  //private mUnitslengthDesc :string=''; //todo:  
  private marrLanguages:Language[];
  private mLangName:string='EN';
  private mUser:User;

  
  private obsUserSelected = new BehaviorSubject<string>('');
  CurrentUserSelected = this.obsUserSelected.asObservable();

  private obsRateChange = new BehaviorSubject<number>(0);
  RateChange = this.obsRateChange.asObservable();
  
  private obsCountrySelected = new BehaviorSubject<string>('');
  CurrentCountrySelected = this.obsCountrySelected.asObservable();

  private obsLangChanged = new BehaviorSubject<string>(null);
  LangChanged = this.obsLangChanged.asObservable();
 
 
  private misMobileResolution:boolean;  
  get isMobileResolution():boolean{   
    if (window.innerWidth < 768) {
      return true;
    } else {
      return false;
    }

    }
  

  private misLoggedIn:boolean;  
  get isLoggedIn():boolean{   
    return this.misLoggedIn;
    }
  set isLoggedIn(u:boolean) {  
    this.misLoggedIn = u;   
   }

  get User():User{   
    return this.mUser;
    }
  set User(u:User) {  
    this.mUser = u;    
    this.obsUserSelected.next(u.displayName);
   }
  
   get UserID():string{ 
      if(typeof(this.User)=='undefined')  
        return '';
      else
        return this.User.email;
    }
  
    get UserIDencode():string{ 
      if(typeof(this.User)=='undefined')  
        return '';
      else
      {         
        return encodeURIComponent(this.User.email).replace('.','***').replace('.','***').replace('.','***');                
      }        
    }

  get LangName():string{   
    return this.mLangName;
    }
   set LangName(l:string) {  
    this.mLangName = l;
   }

   get Units():string{  
      if(this.mUnits =='')
      {
      if(typeof localStorage.getItem('units')!== 'undefined' && localStorage.getItem('units')!== null && localStorage.getItem('units')!== 'null')      
        this.mUnits=localStorage.getItem('units');
      else
        if(this.srv_cook.get_cookie('units')!='')
        {
            this.mUnits=this.srv_cook.get_cookie('units');
            localStorage.setItem('units',this.mUnits);            
        }
      if(this.mUnits=='') 
        {
          this.mUnits='M';
          //this.UnitslengthDesc="mm";
          localStorage.setItem('units',this.mUnits);
        };        
      }  
      return this.mUnits;
    }

   set Units(u:string) {  
    localStorage.setItem('units',u);
    this.mUnits = u;
    this.srv_cook.set_cookie('units',u);
   
   }

   ChangeUnits(units:string)
   {
      if(units=='M')        
          this.Units="M";                         
      else        
          this.Units="I";         
   }

   get UnitslengthDesc():string {
      if(this.Units=="M") return "mm";
      if(this.Units=="I") return "inch";      
    }

  get lstLanguages():Language[] {
    return this.marrLanguages;
    }
  set lstLanguages(l:Language[]) {  
    this.marrLanguages = l;
   }
  
  get SelectedLanguage():Language {
    return this.mLanguages;
    }
  set SelectedLanguage(l:Language) { 
    //let f:boolean=false;
    //if(l.LanguageCode!=this.mLanguages.LanguageCode) f=true; 
    this.mLanguages = l;
    this.obsLangChanged.next(l.LanguageCode);
   }

  private mLanguages:Language;
  get Lang():string 
  {    
    if(this.mLanguages==undefined) return 'EN';
    return this.mLanguages.LanguageCode;
  }

  dictionarygetlanguage()
  {
    return this.srv_DataLayer.dictionarygetlanguage();
  }

  getcountries()
  {
    return this.srv_DataLayer.GetCountryLangBrifData('');
  }
 
  getexchangerate(currency:string)
  {
    return this.srv_DataLayer.exchangerate(currency);
  }

  private mCurrency:string ='USD';
  get Currency():string {
    return this.mCurrency;
    }
  set Currency(c:string) {  
    this.mCurrency = c;
   }
    
   private mCurrRate:number =1;
   get CurrRate():number {
     return this.mCurrRate;
     }

   set CurrRate(r:number) {         
     let prev_rate:number=  this.mCurrRate ;   
     this.mCurrRate = r;  
     if(prev_rate != r) this.obsRateChange.next(prev_rate);             
    }

  private mCountry:Country;
  get Country():Country {
    return this.mCountry;
    }
  set Country(c:Country) {  
    this.mCountry = c;
    this.obsCountrySelected.next(c.CountryName);

   }

   FillLanguage(lan:string)
   {
     return this.srv_DataLayer.dictionarygetlinelanguage(lan);    
   }

   getGEOLocation():any
   {
    return this.srv_DataLayer.getGEOLocation();
   }

   private mUseCookies:boolean=true;
   get UseCookies():boolean{ 
    return this.mUseCookies;
  }
  set UseCookies(u:boolean) {  
    this.mUseCookies = u;
   }

   mcurDate:string;
   get curDate():string{      
    //return  new Date().toString();
    return this.mcurDate;
  }
  set curDate(u:string) {  
    this.mcurDate = u;
   }

   mAfterToken:boolean =false;
   get AfterToken():boolean{      
    //return  new Date().toString();
    return this.mAfterToken;
  }
  set AfterToken(u:boolean) {  
    this.mAfterToken = u;
   }
     
   get issmallscreen():boolean{      
    if(window.devicePixelRatio>1.3 || window.innerWidth<1680) 
      return true;
    else
      return false;
  }   
}
