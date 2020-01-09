import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pp-add-favorit',
  templateUrl: './pp-add-favorit.component.html',
  styleUrls: ['./pp-add-favorit.component.scss']
})
export class PpAddFavoritComponent implements OnInit {

  @Input() modal_group;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
