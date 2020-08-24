import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'header-pp-units',
  templateUrl: './header-pp-units.component.html',
  styleUrls: ['./header-pp-units.component.scss']
})
export class HeaderPpUnitsComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
