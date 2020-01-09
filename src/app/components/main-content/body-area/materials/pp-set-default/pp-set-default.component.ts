import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pp-set-default',
  templateUrl: './pp-set-default.component.html',
  styleUrls: ['./pp-set-default.component.scss']
})
export class PpSetDefaultComponent implements OnInit {

  @Input() modal_group;
  
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
