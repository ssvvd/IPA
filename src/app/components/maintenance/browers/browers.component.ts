import { Component, OnInit,Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'browers',
  templateUrl: './browers.component.html',
  styleUrls: ['./browers.component.scss']
})
export class BrowersComponent implements OnInit {
  environment=environment;
  constructor(public activeModal: NgbActiveModal) { }
  
  ngOnInit(): void {
  }

}
