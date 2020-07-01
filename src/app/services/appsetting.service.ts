import { Injectable } from '@angular/core';
import { Language} from 'src/app/models/applications/applications';
import { User} from 'src/app/models/users/user';
import { DatalayerService} from 'src/app/services/datalayer.service' ;

@Injectable({
  providedIn: 'root'
})
export class AppsettingService {

  constructor(private srv_DataLayer:DatalayerService) { }
  
  private mUnits:string ='M'; //todo:
  private mUnitslengthDesc :string='mm'; //todo:  
  private marrLanguages:Language[];
  private mLangName:string='EN';
  private mUser:User;
  private mUserID:string;
  get User():User{   
    return this.mUser;
    }
   set User(u:User) {  
    this.mUser = u;
   }
  
   get UserID():string{   
    return this.mUserID;
    }
   set UserID(u:string) {  
    this.mUserID = u;
   }

  get LangName():string{   
    return this.mLangName;
    }
   set LangName(l:string) {  
    this.mLangName = l;
   }

   get Units():string{   
    return this.mUnits;
    }
   set Units(u:string) {  
    this.mUnits = u;
   }

   ChangeUnits(units:string)
   {
      if(units=='M')
        {
          this.Units="M";
          this.UnitslengthDesc="mm";                     
        }
      else
        {
          this.Units="I";
          this.UnitslengthDesc="inch"; 
        }
   }
   get UnitslengthDesc():string {
    return this.mUnitslengthDesc;
    }
  set UnitslengthDesc(u:string) {  
    this.mUnitslengthDesc = u;
   }

  get lstLanguages():Language[] {
    return this.marrLanguages;
    }
  set lstLanguages(l:Language[]) {  
    this.marrLanguages = l;
   }
  private mLanguages:Language;
  get SelectedLanguage():Language {
    return this.mLanguages;
    }
  set SelectedLanguage(l:Language) {  
    this.mLanguages = l;
   }

  get Lang():string
  {    
    return this.mLanguages.LanguageCode;
  }

  dictionarygetlanguage()
  {
    return this.srv_DataLayer.dictionarygetlanguage()
  }
  private mCountry:string;
  get Country():string {
    return this.mCountry;
    }
  set Country(c:string) {  
    this.mCountry = c;
   }

   FillLanguage(lan:string)
   {
     return this.srv_DataLayer.dictionarygetlinelanguage(lan);
    
   }
}
