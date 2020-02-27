import { Component, OnInit,ElementRef } from '@angular/core';
import { environment } from '../../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StateManagerService } from 'src/app/services/statemanager.service';
import { DatalayerService} from 'src/app/services/datalayer.service' ;
import { Language} from 'src/app/models/applications/applications';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})



export class HeaderComponent implements OnInit {  
  
  tableElement: ElementRef ;
  environment = environment;
  menuisshown:boolean=false;
  isMetric:boolean=true;
  lstLanguage:Language[] =[];
  isLoadingLang:boolean =false;
  SelectedLang:Language;

  // /dictionarygetlanguage
  constructor(private modalService: NgbModal,private srv_statemanage:StateManagerService,private srv_DataLayer:DatalayerService) { }

  ngOnInit() {
    if (this.srv_statemanage.SelectedUnits=='M') 
      this.isMetric = true;
    else
      this.isMetric = false;

    if (typeof (this.srv_statemanage.SelectedLanguage)=== 'undefined')
    {
      this.SelectedLang=new Language;
      this.SelectedLang.LanguageCode="EN";
      this.SelectedLang.LanguageName="English";
      this.SelectedLang.LanguageEnName="English";
      this.srv_statemanage.SelectedLanguage=this.SelectedLang;
    }
  } 
  
  GetLanguages()
  {
    if (typeof (this.srv_statemanage.lstLanguages)=== 'undefined')
    {
      this.srv_DataLayer.dictionarygetlanguage().subscribe((data: any) => {
      this.lstLanguage = JSON.parse(data); 
      this.srv_statemanage.lstLanguages =this.lstLanguage;
      this.isLoadingLang=true;
      });                            
    }
    else
    {
       this.lstLanguage=this.srv_statemanage.lstLanguages;
    }
  }

  onChangeLanguage(lan:Language)
  {  
    this.srv_statemanage.SelectedLanguage =lan;    
    this.SelectedLang=lan;
  }

  UnitsChanged(event)
  {      
    if(event.target.checked)
      this.srv_statemanage.SelectedUnits="M";
    else
      this.srv_statemanage.SelectedUnits="I";
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

  }

  openfavorite()
  {

  }
}
