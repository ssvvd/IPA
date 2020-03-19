import { Injectable } from '@angular/core';
import { Language} from 'src/app/models/applications/applications';

@Injectable({
  providedIn: 'root'
})
export class AppsettingService {

  constructor() { }
  
  private mUnits:string ='M'; //todo:
  private mUnitslengthDesc :string='mm'; //todo:
  private marrLanguages:Language[];

   get Units():string{   
    return this.mUnits;
    }
  set Units(u:string) {  
    this.mUnits = u;
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
}
