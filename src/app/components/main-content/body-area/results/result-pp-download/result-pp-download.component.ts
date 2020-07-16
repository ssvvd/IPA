import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'result-pp-download',
  templateUrl: './result-pp-download.component.html',
  styleUrls: ['./result-pp-download.component.scss']
})
export class ResultPpDownloadComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }
  environment = environment;  
  ngOnInit(): void {
  }

  Download(format:string)
  {
    this.activeModal.close(format);
  }
}
