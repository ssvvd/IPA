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
  constructor(private modalService: NgbModal) { }

  ngOnInit() {
  } 

  showModal(content) {    
    this.modalService.open(content) ;
  }
}
