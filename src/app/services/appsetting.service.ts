import { Injectable } from '@angular/core';
import { Language,Country} from 'src/app/models/applications/applications';
import { User} from 'src/app/models/users/user';
import { DatalayerService} from 'src/app/services/datalayer.service' ;
import { CookiesService } from 'src/app/services/cookies.service';
import { BehaviorSubject } from 'rxjs';
//import { unlink } from 'fs';
//import { uniqueSort } from 'jquery';

@Injectable({ 
  providedIn: 'root'
})
export class AppsettingService {

  constructor(private srv_DataLayer:DatalayerService,private srv_cook:CookiesService) { }
  
  private mUnits:string =''; //todo:
  //private mUnitslengthDesc :string=''; //todo:  
  private marrLanguages:Language[];
  private mLangName:string='EN';
  private mUser:User;

  
  private obsUserSelected = new BehaviorSubject<string>('');
  CurrentUserSelected = this.obsUserSelected.asObservable(); 
  
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
    this.mLanguages = l;
   }

  private mLanguages:Language;
  get Lang():string
  {    
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
     this.mCurrRate = r;
    }

  private mCountry:Country;
  get Country():Country {
    return this.mCountry;
    }
  set Country(c:Country) {  
    this.mCountry = c;
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

}
