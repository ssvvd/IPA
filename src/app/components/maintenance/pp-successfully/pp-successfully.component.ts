import { Component, OnInit,Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'pp-successfully',
  templateUrl: './pp-successfully.component.html',
  styleUrls: ['./pp-successfully.component.scss']
})
export class PpSuccessfullyComponent implements OnInit {
  
  @Input () HeaderDescription:string;
  @Input () Text:string;
  constructor(public activeModal: NgbActiveModal) { }
  
  ngOnInit(): void {
  }

}
