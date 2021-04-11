import { Component, OnInit ,Input} from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Country,Language} from './../../../models/applications/applications';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'header-pp-countries',
  templateUrl: './header-pp-countries.component.html',
  styleUrls: ['./header-pp-countries.component.scss']
})
export class HeaderPpCountriesComponent implements OnInit {

  @Input() lstcountry:Country[]=[];
  environment=environment;
  constructor(public activeModal: NgbActiveModal) { }
  
  ngOnInit(): void {
  }

  SelectCountryAndLang(c:Country,LanguageID:string)
  {
    let arr:any[]=[];
    arr.push(c);
    arr.push(LanguageID) ;   
    this.activeModal.close(arr);
  }
}
