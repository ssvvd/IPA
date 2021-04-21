import { Component, OnInit,Input } from '@angular/core';
import { NgbModal,NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../environments/environment';
import { AppsettingService} from './../../services/appsetting.service';
import { Country,Language} from './../../models/applications/applications';
import { LoginService } from './../../services/login.service';
import { HeaderPpCountriesComponent} from './../../components/maintenance/header-pp-countries/header-pp-countries.component';


@Component({
  selector: 'header-pp-menu',
  templateUrl: './header-pp-menu.component.html',
  styleUrls: ['./header-pp-menu.component.scss']
})

export class HeaderPpMenuComponent implements OnInit {

  @Input() UserDesc:string;
  @Input() lstcountry:Country[]=[];
  @Input() CurrentCountryName:string;

  constructor(public activeModal: NgbActiveModal,public srv_appsetting:AppsettingService,private modalService: NgbModal,private srv_login:LoginService) { }
  environment=environment;
  ngOnInit(): void {
  }
  
  NewSearch()
  {
    location.reload();
  }

  OpenCountries()
   {
    const modalRef = this.modalService.open(HeaderPpCountriesComponent, { windowClass: 'header-menu-modal' });      
    modalRef.componentInstance.lstcountry = this.lstcountry;
    
    modalRef.result.then((result:any[]) => {
      
      if(result!==undefined)
      {
       let c:Country = result[0]; 
       let LanguageID:string = result[1];
       this.srv_login.SelectCountryAndLang(c,LanguageID);
       //this.SelectedLang=this.srv_appsetting.SelectedLanguage; 
       this.CurrentCountryName = this.srv_appsetting.Country.CountryName;  
       this.activeModal.close('send');      
      }
    });
   }
}
