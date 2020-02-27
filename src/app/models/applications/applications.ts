export class MainApp {
    MenuID:string;
    MainApp:string;
    MenuName:string;
    MenuImage:string;    
    IsActive:boolean;
    SpindleSelected:string;
}

export class SecondaryApp {
    MainApp:string;
    MenuID:string;
    MenuName:string;
    MenuImage:string;
    ParentMenuID:string;
    ApplicationITAID:string;
    IsActive:boolean;
   
}

export class Language {
  LanguageCode:string;
  LanguageName: string ;
  LanguageEnName: string ; 
}


