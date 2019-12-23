import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  environment = environment;
  menuisshown:boolean=false;
 
  constructor(private modalService: NgbModal) { }

  ngOnInit() {
  } 

  showModal(content) {    
    this.modalService.open(content,{windowClass:"myCustomModalClass"}); 
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
