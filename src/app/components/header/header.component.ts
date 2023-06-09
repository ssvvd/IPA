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
import { DatalayerService} from'./../../services/datalayer.service' ;
import { HeaderPpMenuComponent} from './../../components/header-pp-menu/header-pp-menu.component';
import { Subject} from 'rxjs';
import { Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta } from '@angular/platform-browser';

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
  msgwait:string='Please wait while IPA is processing your request.';

  eventsSubject: Subject<void> = new Subject<void>();

  constructor(public translate: TranslateService, private srv_statemanage:StateManagerService,private SpinnerService: NgxSpinnerService,
              public srv_appsetting:AppsettingService, private router:Router,
              private srv_login:LoginService,private modalService: NgbModal,private srv_cook:CookiesService,
              private srv_DataLayer:DatalayerService,
              private renderer2: Renderer2,@Inject(DOCUMENT) private _document,
              private meta: Meta) { }

  ngOnInit() {

    this.userdes=this.translate.instant('Log In');
    this.msgwait =this.translate.instant('Please wait while IPA is processing your request.');

    this.srv_appsetting.CurrentUserSelected.subscribe(u=>
      { if(u=='')
          this.userdes=this.translate.instant('Log In');
        else
          this.userdes=u;

          if(this.srv_appsetting.Country!==undefined)
            this.CurrentCountryName = this.srv_appsetting.Country.CountryName;
      });

      this.srv_appsetting.CurrentCountrySelected.subscribe(c=>this.ChangedCountry(c));
      this.srv_appsetting.LangChanged.subscribe(l=>this.ChangedLanguage(l));


    if (this.srv_appsetting.Units=='M')
      this.isMetric = true;
    else
      this.isMetric = false;

    this.GetLanguages();
    if (typeof (this.srv_appsetting.SelectedLanguage)=== 'undefined')
    {
      this.SelectedLang=new Language;
      this.SelectedLang.LanguageCode="GM";
      this.SelectedLang.LanguageName="Germany";
      this.SelectedLang.LanguageEnName="Germany";
      this.srv_appsetting.SelectedLanguage=this.SelectedLang;
    }
  }

  ChangedCountry(c:any)
 {
  if(c!='')
    this.CurrentCountryName = c;

  this.userdes="Log In";
  this.msgwait =this.translate.instant('Please wait while IPA is processing your request.');

  if(this.srv_appsetting.UserID=='')
    this.userdes=this.translate.instant('Log In');
  else
    this.userdes=this.srv_appsetting.User.displayName;

 }

 ChangedLanguage(l:any)
 {
  if(l!=null) this.translate.use(l);
  this.userdes="Log In";
  if(this.srv_appsetting.UserID=='')
      this.userdes=this.translate.instant('Log In');
    else
      this.userdes=this.srv_appsetting.User.displayName;
  this.msgwait =this.translate.instant('Please wait while IPA is processing your request.');
 }

  LogOut()
  {
    this.srv_login.LogOutNew();
    this.userdes=this.translate.instant('Log In');;
  }

  OpenMenuMobile()
  {
    const modalRef = this.modalService.open(HeaderPpMenuComponent, {backdrop:'static', windowClass: 'header-menu-modal' });
    if(this.srv_appsetting.UserID=='')
      modalRef.componentInstance.UserDesc =  "";
    else
      modalRef.componentInstance.UserDesc = this.userdes;

    modalRef.componentInstance.lstcountry = this.lstcountry;
    modalRef.componentInstance.CurrentCountryName = this.CurrentCountryName;

    modalRef.result.then((result) => {
      if(result=='opencatalog'){ this.opencatalog();}
      if(result=='openmachiningcalculator'){this.openmachiningcalculator();}
      if(result=='opencalculator'){this.opencalculator();}
      if(result=='openGeometryAnalyzer'){this.openGeometryAnalyzer();}
      if(result=='Insertwear'){this.Insertwear();}
      if(result=='contactus'){this.contactus();}
      if(result=='feedback'){this.feedback();}
      if(result=='OpenUserGiude'){this.OpenUserGiude();}
      if(result=='Threadcompass'){this.openthreadcompass();}
      if(result=='M'){this.CheckAllowUnitsChange(null);}
      if(result=='I'){this.CheckAllowUnitsChange(null);}
    });

  }
  LogIn()
  {
    //if(this.meta.getTag('name=enablelogin').content=='0' || this.msrv_appsetting.UserID!='') return;
    if(this.msrv_appsetting.UserID!='') return;
    this.srv_login.SignIn();

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
          if(this.lstcountry.filter (c=> c.CountryCode==d.CountryCode).length ==0)
          {
            if( d.CountryName.trim()=='England' || d.CountryName.trim()=='Germany' || d.CountryName.trim()=='France')
            {
            this.lstcountry.push({
              CountryID:d.CountryId,
              CountryName: d.CountryName.trim(),
              CountryID_IscarCom: 0,
              CountryGlobalId:d.CountryGlobalId,
              LanguageID: [d.CATLAN] ,
              LanguageName: [d.CATLAN],
              BrifName:d.BrifName,
              Currency:d.Currency,
              CountryFlag:'' ,
              CountryCode:d.CountryCode ,
              ShowPrice:d.ShowPrice ,
              FCSToolshopSite:d.FCSToolshopSite,
              LACNT:d.LACNT
            })  ;
            if(this.srv_appsetting.lstLanguages.filter(l=>l.LanguageCode == d.CATLAN).length >0)
            {
              this.lstcountry[this.lstcountry.length-1].LanguageName = [this.srv_appsetting.lstLanguages.filter(l=>l.LanguageCode == d.CATLAN)[0].LanguageName];
            }
            }
          }
          else
          {
            let c:Country;
            if(this.srv_appsetting.lstLanguages.filter(l=>l.LanguageCode == d.CATLAN).length >0)
            {
              c=this.lstcountry.filter (c=> c.CountryCode==d.CountryCode)[0];
              if(c.LanguageID.filter(l=> l==d.CATLAN).length ==0)
              {
                c.LanguageID.push(d.CATLAN);
                c.LanguageName.push(this.srv_appsetting.lstLanguages.filter(l=>l.LanguageCode == d.CATLAN)[0].LanguageName);
              }
            }
          }
      }

      if(this.srv_appsetting.AfterToken)
    {
      this.srv_login.FillCountryLanguageByURLParameters();
     /*  if(this.srv_appsetting.IsCountryGermany)
          this.CreateScriptGermanyChat();   */
    }

      if(this.srv_appsetting.Country===undefined)
      {
        this.CurrentCountryName = 'headquarters';
      }
      else
      {
          this.CurrentCountryName = this.srv_appsetting.Country.CountryName;
      }
      //if(this.srv_appsetting.Country!==undefined)
        /* if(this.srv_appsetting.Country.CountryCode=='DE')
        {
          this.srv_appsetting.ChangeUnits('I');
          this.isMetric=false;
        } */
      this.IsLoaded=true;
      });
  }

  SelectCountryAndLang(c:Country,LanguageID:string)
  {
    //console.log('function SelectCountryAndLang');
    let IsChangedGermany:boolean=false;
    //if(this.SelectedLang.LanguageCode!=LanguageID && (LanguageID=='GM' || this.SelectedLang.LanguageCode=='GM')) IsChangedGermany=true;
    this.srv_login.SelectCountryAndLang(c,LanguageID)
    if(IsChangedGermany) this.srv_login.ChangedLanguageGermany();
    this.SelectedLang=this.srv_appsetting.SelectedLanguage;
    this.CurrentCountryName = this.srv_appsetting.Country.CountryName;
    this.eventsSubject.next();
    this.translate.use(LanguageID);
    this.msgwait =this.translate.instant('Please wait while IPA is processing your request.');
    this.userdes=this.translate.instant('Log In');
    //console.log('this.srv_appsetting.Country.CountryCode');
    //console.log(this.srv_appsetting.Country.CountryCode);
    if(this.srv_appsetting.Country.CountryCode=='US')
    {
      this.srv_appsetting.ChangeUnits('I');
      this.isMetric=false;
    }
  }

  CheckAllowUnitsChange(event)
  {
      if(event!=null) event.preventDefault();
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
            this.srv_statemanage.ChangeUnits();
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
    //window.open(environment.ECatalogLink);
    //window.location.href = environment.ECatalogLink;
  }

  opencalculator()
  {
    //window.open('https://www.iscar.com/ITC/Calculators.aspx?units=' + this.srv_appsetting.Units +'&lang=' + this.srv_appsetting.Lang,"_blank");
  }

  openmachiningcalculator()
  {
    //window.open(environment.MachiningCalculatorSite, "_blank");
    window.open("https://www.imc-companies.com/MTIN/", "_blank");
  }

  openGeometryAnalyzer()
  {
    let l:string=this.srv_appsetting.Lang;
    if(l=='GM') l='DE';
    if(l=='FR') l='EN';
    window.open('http://www.imc-companies.com/IngersollDE/InsertConverter/?lang=' + l, "_blank");
  }

  openinsertconverter()
  {
    let l:string=this.srv_appsetting.Lang;
    if(l=='GM') l='DE';
    if(l=='FR') l='EN';
    window.open('http://www.imc-companies.com/IngersollDE/InsertConverter/?lang=' + l, "_blank");

  }

  Insertwear()
  {
    let l:string=this.srv_appsetting.Lang;
    if(l=='GM') l='DE';
    window.open('https://www.ingersoll-imc.de/fileadmin/user_upload/user_upload/pdfs/Handbuecher/Handbuch_Schnittwerte_F_B_' + l +'.pdf', "_blank");
  }

  openHomepage()
 {
  window.open('https://www.ingersoll-imc.de', "_blank");
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
     let winclass:string;
    if(this.srv_appsetting.isMobileResolution)
      winclass ='feedback-modal-mobile';
    else
      winclass ='feedback-modal';
    const modalRef = this.modalService.open(FeedbackComponent,{backdrop: 'static', centered: true, windowClass: winclass });
    modalRef.result.then((result) => {
      this.srv_cook.set_cookie("notshowfeedback",'1');
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
        this.srv_login.SelectLanguage(localStorage.getItem("language"));

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
      c.FCSToolshopSite= data[0].FCSToolshopSite;

      this.srv_login.SelectCountryAndLang(c,c.LanguageID[0]);
      this.srv_login.SelectLanguage(c.LanguageID[0]);

      /* if(c.CountryCode=='DE')
        this.CreateScriptGermanyChat();   */
      this.srv_login.SetExchangeRate1(c.BrifName);
      localStorage.setItem("countryid","");  // todo:
    }
    if(localStorage.getItem("language")!=null && localStorage.getItem("language")!='')
    {
      this.srv_login.SelectLanguage(localStorage.getItem("language"));
    }
  }

  OpenUserGiude()
  {
    if(this.srv_appsetting.Lang=='GM')
      window.open('assets/UserGuide/IPAUserGuide_DE.pdf');
    else
      window.open('assets/UserGuide/IPAUserGuide.pdf');
  }

  CreateScriptGermanyChat()
{
  const s = this.renderer2.createElement('script');
  s.type = 'text/javascript';
  s.async = true;
  s.src="https://userlike-cdn-widgets.s3-eu-west-1.amazonaws.com/e79cf993609f4b9fa9d4067183a806791ef00b4ae85c480a94f330e12c66684b.js";
  s.text = "";
  this.renderer2.appendChild(this._document.body, s);
}

  reload()
  {
    window.location.reload();
  }

  openuserguidemillthread()
  {
    window.open('https://imc.iscar.co.jp/IscarWorld/pdf/MillThread%20Advisor%20(%E3%81%AD%E3%81%98%E5%88%87%E3%82%8A%E5%B7%A5%E5%85%B7%E9%81%B8%E5%AE%9A%E3%83%97%E3%83%AD%E3%82%B0%E3%83%A9%E3%83%A0).pdf','_blank');
  }

  openthreadcompass()
  {
    let url:string;
    this.srv_login.geturlthreadcompass().subscribe(res=>{url=res;
      window.open(url,"blank")});


  }
}
