import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'machines-pp-login',
  templateUrl: './machines-pp-login.component.html',
  styleUrls: ['./machines-pp-login.component.scss']
})
export class MachinesPpLoginComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }
  
}
