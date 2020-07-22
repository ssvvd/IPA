import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Language} from 'src/app/models/applications/applications';
import { LoginService } from 'src/app/services/login.service';
import { StateManagerService } from 'src/app/services/statemanager.service';
import { AppsettingService} from 'src/app/services/appsetting.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from "ngx-spinner"; 
import { DownloadresultService} from 'src/app/services/downloadresult.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {  
  
  //tableElement: ElementRef ;
  environment = environment;
  menuisshown:boolean=false;
  isMetric:boolean;
  lstLanguage:Language[] =[];
  isLoadingLang:boolean =false;
  SelectedLang:Language;
  
  public msrv_appsetting:AppsettingService =this.srv_appsetting;
  public msrv_statemanage:StateManagerService =this.srv_statemanage;
  userdes:string='Log In';
  // /dictionarygetlanguage
  constructor(public translate: TranslateService, private srv_statemanage:StateManagerService,private SpinnerService: NgxSpinnerService,
              private srv_appsetting:AppsettingService, private router:Router,
              private srv_login:LoginService,private srv_down:DownloadresultService) { }

  ngOnInit() {   
  
    this.srv_appsetting.CurrentUserSelected.subscribe(u=>{if(u=='') this.userdes='Log In'; else this.userdes=u});   
    if (this.srv_appsetting.Units=='M') 
      this.isMetric = true;
    else
      this.isMetric = false;

    this.GetLanguages();
    if (typeof (this.srv_appsetting.SelectedLanguage)=== 'undefined')
    {
      this.SelectedLang=new Language;
      this.SelectedLang.LanguageCode="EN";
      this.SelectedLang.LanguageName="English";
      this.SelectedLang.LanguageEnName="English";
      this.srv_appsetting.SelectedLanguage=this.SelectedLang;
    }
  } 
  
  LogIn()
  {    
      this.SpinnerService.show();
      this.srv_login.GetToken().subscribe(res=>{this.SpinnerService.hide();});    
  }

  GetLanguages()
  {
    if (typeof (this.srv_appsetting.lstLanguages)=== 'undefined')
    {
      this.srv_appsetting.dictionarygetlanguage().subscribe((data: any) => {
      this.lstLanguage = JSON.parse(data); 
      this.srv_appsetting.lstLanguages =this.lstLanguage;
      this.isLoadingLang=true;
      });                            
    }
    else
    {
       this.lstLanguage=this.srv_appsetting.lstLanguages;
    }
  }

  onChangeLanguage(lan:Language)
  {     
    this.srv_appsetting.SelectedLanguage =lan;    
    this.SelectedLang=lan;
    if (this.translate.getLangs().indexOf(lan.LanguageCode) !== -1)
      this.translate.use(lan.LanguageCode);
    else
      this.translate.use(this.translate.getDefaultLang());
      
   this.srv_appsetting.FillLanguage(lan.LanguageCode).subscribe((data: any)=> {
    //const fs = require('fs');      
    //fs.writeFileSync(environment.LanguagePath + "/" + lan.LanguageCode + ".json", data);
     });       
  }
  
  UnitsChanged(event)
  {       
    if(event.target.checked)        
      this.srv_appsetting.ChangeUnits('M');                
    else    
      this.srv_appsetting.ChangeUnits('I');
         
    if (window.location.href.indexOf('machines')>-1)
      {
        this.srv_statemanage.ChangeUnits();        
      }        
    else
      {
        this.router.navigate(['/home/machines']);
        this.srv_statemanage.ChangeUnits();        
      }       
  }

  showmenu()
  {
    this.menuisshown =!this.menuisshown;
  }

  opencatalog()
  {   
    window.open(environment.ECatalogLink, "_blank");
  }
  
  openhelp()
  {
    //this.srv_down.DownLoadResult('');
  }

  openfavorite()
  {
    this.srv_login.LogOut();
    this.router.navigate(['/home/machines']);    
  }

}
