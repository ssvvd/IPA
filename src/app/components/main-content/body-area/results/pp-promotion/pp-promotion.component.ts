import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppsettingService} from 'src/app/services/appsetting.service';

@Component({
  selector: 'pp-promotion',
  templateUrl: './pp-promotion.component.html',
  styleUrls: ['./pp-promotion.component.scss']
})
export class PpPromotionComponent implements OnInit {

  @Input() pdFile;
  urlPDFlang:string;
  urlPDF:string;
  urlImg:string;
  urlImglang:string;

  constructor(public activeModal: NgbActiveModal,private srv_appsetting:AppsettingService) { }

  ngOnInit(): void {
    //this.srv_appsetting.Lang
    this.urlPDF = "https://www.iscar.com/eCatalog/Ecat/datafile/Promotion" + this.srv_appsetting.Units + "/" + this.pdFile.trim() + ".pdf"
    this.urlImg = "https://www.iscar.com/eCatalog/Ecat/datafile/Promotion" + this.srv_appsetting.Units + "/" + this.pdFile.trim() + ".jpg"
    this.urlPDFlang = "https://www.iscar.com/eCatalog/Ecat/datafile/Promotion" + this.srv_appsetting.Units + "/" + this.pdFile.trim()  + "_" + this.srv_appsetting.Lang + ".pdf"
    this.urlImglang = "https://www.iscar.com/eCatalog/Ecat/datafile/Promotion" + this.srv_appsetting.Units + "/" + this.pdFile.trim()  + "_" + this.srv_appsetting.Lang + ".jpg"
  }

  changeSource(event, name) { event.target.src = name; this.urlPDFlang = this.urlPDF}

  openPDF(){
  window.open(this.urlPDFlang, "_blank");
}

}
