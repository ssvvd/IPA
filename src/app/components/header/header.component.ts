import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Country,Language} from './../../models/applications/applications';
import { LoginService } from './../../services/login.service';
import { StateManagerService } from './../../services/statemanager.service';
import { AppsettingService} from './../../services/appsetting.service';
import {HeaderPpUnitsComponent} from './../../components/header/header-pp-units/header-pp-units.component';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from "ngx-spinner"; 
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ContactusComponent } from './../../components/maintenance/contactus/contactus.component';
import { FeedbackComponent } from './../../components/maintenance/feedback/feedback.component';
import { CookiesService } from './../../services/cookies.service';
import { Subject} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {  
  
  environment = environment;
  menuisshown:boolean=false;
  isMetric:boolean;
  lstLanguage:Language[] =[];
  isLoadingLang:boolean =false;
  SelectedLang:Language;
  lstcountry:Country[]=[];
  IsLoaded:boolean=false;
  CurrentCountryName:string='headquarters';
  //CurrentCountryName:string='';

  public msrv_appsetting:AppsettingService =this.srv_appsetting;
  public msrv_statemanage:StateManagerService =this.srv_statemanage;
  userdes:string=this.translate.instant('Log In');
  msgwait:string='Please wait while ITA is processing your request.';
  
  eventsSubject: Subject<void> = new Subject<void>();

  constructor(public translate: TranslateService, private srv_statemanage:StateManagerService,private SpinnerService: NgxSpinnerService,
              public srv_appsetting:AppsettingService, private router:Router,
              private srv_login:LoginService,private modalService: NgbModal,private srv_cook:CookiesService) { }

  ngOnInit() {   
    
    this.srv_appsetting.CurrentUserSelected.subscribe(u=>
      { if(u=='') 
          this.userdes=this.translate.instant('Log In'); 
        else 
          this.userdes=u;

          if(this.srv_appsetting.Country!==undefined)
          this.CurrentCountryName = this.srv_appsetting.Country.CountryName; 
      });

      this.srv_appsetting.CurrentCountrySelected.subscribe(c=>
        { if(c!='')                       
              this.CurrentCountryName = c; 
        });

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
  LogOut()
  {
    this.srv_login.LogOut();
    this.userdes=this.translate.instant('Log In');;     
  }
  
  LogIn()
  {   
    //return; //TODO:
      if(this.srv_appsetting.UserID=='')
      {
        this.SpinnerService.show();
        this.srv_login.GetToken().subscribe(res=>{this.SpinnerService.hide();});
      }        
  }
  FillListCountries()
  {
    this.isLoadingLang=true;
  }
  GetLanguages()
  {
    if (typeof (this.srv_appsetting.lstLanguages)=== 'undefined')
    {
      this.srv_appsetting.dictionarygetlanguage().subscribe((data: any) => {
      this.lstLanguage = JSON.parse(data); 
      this.srv_appsetting.lstLanguages =this.lstLanguage;
      //this.isLoadingLang=true;
      this.BuildCountryData();
      });                            
    }
    else
    {
       this.lstLanguage=this.srv_appsetting.lstLanguages;
       this.BuildCountryData();
    }
  }
  
  BuildCountryData()
  {
    this.srv_appsetting.getcountries().subscribe((res: any) => {
      for (const d of JSON.parse(res)) {       
          if(this.lstcountry.filter (c=> c.CountryID==d.CountryId).length ==0)     
          {
            this.lstcountry.push({
              CountryID:d.CountryId,
              CountryName: d.CountryName.trim(),
              CountryID_IscarCom: d.CountryID_IscarCom,   
              CountryGlobalId:d.CountryGlobalId,
              LanguageID: [d.CATLAN] ,
              LanguageName: [d.CATLAN],
              BrifName:d.BrifName,
              Currency:d.Currency, 
              CountryFlag:'' ,
              CountryCode:d.CountryCode                          
            })  ;
            if(this.srv_appsetting.lstLanguages.filter(l=>l.LanguageCode == d.CATLAN).length >0)
            {
              this.lstcountry[this.lstcountry.length-1].LanguageName = [this.srv_appsetting.lstLanguages.filter(l=>l.LanguageCode == d.CATLAN)[0].LanguageName];
            }
          }                                            
          else  
          {
            let c:Country;              
            if(this.srv_appsetting.lstLanguages.filter(l=>l.LanguageCode == d.CATLAN).length >0)
            {
              c=this.lstcountry.filter (c=> c.CountryID==d.CountryId)[0];
              if(c.LanguageID.filter(l=> l==d.CATLAN).length ==0)
              {
                c.LanguageID.push(d.CATLAN);
                c.LanguageName.push(this.srv_appsetting.lstLanguages.filter(l=>l.LanguageCode == d.CATLAN)[0].LanguageName);
              }             
            }            
          }
      }

      if(this.srv_appsetting.Country===undefined)      
      {       
        this.CurrentCountryName = 'headquarters';
      }               
      else
      {          
          this.CurrentCountryName = this.srv_appsetting.Country.CountryName;            
      } 

      this.IsLoaded=true;     
      });   
  }

  SelectCountryAndLang(c:Country,LanguageID:string)
  {
    this.srv_login.SelectCountryAndLang(c,LanguageID);
    this.SelectedLang=this.srv_appsetting.SelectedLanguage; 
    this.CurrentCountryName = this.srv_appsetting.Country.CountryName;    
    this.eventsSubject.next();
  
  }
  
  CheckAllowUnitsChange(event)
  {  
      event.preventDefault();      
      const modalRef = this.modalService.open(HeaderPpUnitsComponent, {backdrop:'static', centered: true });
                    
      modalRef.result.then((result) => {
        if(result=='cancel') {return;}
        if(result=='change')
        { 
          if(this.isMetric)  
          { 
            this.srv_appsetting.ChangeUnits('I');
            this.isMetric=false;
          }
          else
          {
            this.srv_appsetting.ChangeUnits('M');
            this.isMetric=true;
          }                   
             
        if (window.location.href.indexOf('machines')>-1)
          {
            this.srv_statemanage.ChangeUnits();        
          }        
        else
          {
            this.router.navigate(['/home/machines']);
            this.srv_statemanage.ChangeUnits();        
          }        
        }});                
  }

  UnitsChanged(event)
  {  
      const modalRef = this.modalService.open(HeaderPpUnitsComponent, {backdrop:'static', centered: true });
      //modalRef.componentInstance.MachineName = mach.MachineName;
                    
      modalRef.result.then((result) => {
        if(result=='cancel') {this.isMetric = !this.isMetric;return;}
        if(result=='change')
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
        }});
        
      
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

  contactus()
  {
    const modalRef = this.modalService.open(ContactusComponent,{ backdrop:'static',size: 'lg' ,centered: true});                    
  }

  feedback()
  {
    const modalRef = this.modalService.open(FeedbackComponent,{backdrop: 'static', centered: true, windowClass: 'feedback-modal' });
    modalRef.result.then((result) => {
      //if(result=='cancel') return;
      if(result=='send') this.srv_cook.set_cookie("notshowfeedback",'1');    
    });    
  } 
   
}
