import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Country,Language} from 'src/app/models/applications/applications';
import { LoginService } from 'src/app/services/login.service';
import { StateManagerService } from 'src/app/services/statemanager.service';
import { AppsettingService} from 'src/app/services/appsetting.service';
import {HeaderPpUnitsComponent} from 'src/app/components/header/header-pp-units/header-pp-units.component';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from "ngx-spinner"; 
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';

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
  CurrentCountryName:string='';

  public msrv_appsetting:AppsettingService =this.srv_appsetting;
  public msrv_statemanage:StateManagerService =this.srv_statemanage;
  userdes:string='Log In';

  constructor(public translate: TranslateService, private srv_statemanage:StateManagerService,private SpinnerService: NgxSpinnerService,
              public srv_appsetting:AppsettingService, private router:Router,
              private srv_login:LoginService,private modalService: NgbModal) { }

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
  LogOut()
  {
    this.srv_login.LogOut();
    this.userdes='Log In';     
  }

  LogIn()
  {   
      if(this.srv_appsetting.UserID=='')
      {
        this.SpinnerService.show();
        this.srv_login.GetToken().subscribe(res=>{this.SpinnerService.hide();});
      }        
  }

  GetLanguages()
  {
    if (typeof (this.srv_appsetting.lstLanguages)=== 'undefined')
    {
      this.srv_appsetting.dictionarygetlanguage().subscribe((data: any) => {
      this.lstLanguage = JSON.parse(data); 
      this.srv_appsetting.lstLanguages =this.lstLanguage;
      this.isLoadingLang=true;
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
        //this.srv_appsetting.Country=this.lstcountry.find (c=> c.CountryID==35);
        this.CurrentCountryName = 'headquarters';
      }               
      else
      {
          //this.srv_appsetting.Country=this.srv_appsetting.Country;
          this.CurrentCountryName = this.srv_appsetting.Country.CountryName;
          //this.srv_appsetting.Currency=this.srv_appsetting.Country.Currency;
          //this.srv_login.SetExchangeRate();     
      } 

      this.IsLoaded=true;     
      });   
  }
/* 
  SetExchangeRate()
  {
    this.srv_appsetting.getexchangerate(this.srv_appsetting.Country.Currency).subscribe((res: any) =>
    { 
      if(res.length>0)
      {
        let rate :any=JSON.parse(res)[0].Exchange; 
        this.srv_appsetting.CurrRate=rate;
      }                      
    });
  } */

  SelectCountryAndLang(c:Country,LanguageID:string)
  {
    this.srv_login.SelectCountryAndLang(c,LanguageID);
    this.SelectedLang=this.srv_appsetting.SelectedLanguage; 
    this.CurrentCountryName = this.srv_appsetting.Country.CountryName;      
  }
  
  CheckAllowUnitsChange(event)
  {  
      event.preventDefault();      
      const modalRef = this.modalService.open(HeaderPpUnitsComponent, { centered: true });
                    
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
            
          /* if(event.target.checked)        
            this.srv_appsetting.ChangeUnits('M');                
          else    
            this.srv_appsetting.ChangeUnits('I'); */
             
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
      const modalRef = this.modalService.open(HeaderPpUnitsComponent, { centered: true });
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

  openfavorite()
  {
    this.srv_login.LogOut();
    this.router.navigate(['/home/machines']);    
  }

}
