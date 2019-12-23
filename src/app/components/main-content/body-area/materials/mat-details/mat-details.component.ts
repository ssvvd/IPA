import { Component, OnInit, Input,SimpleChanges } from '@angular/core';
import { MaterialService } from 'src/app/services/material.service'

@Component({
  selector: 'app-mat-details',
  templateUrl: './mat-details.component.html',
  styleUrls: ['./mat-details.component.scss','../materials.component.scss']
})
export class MatDetailsComponent implements OnInit {

  detailsResult:any;
  headers:any;
  @Input() selectedMaterial: number ;

  constructor(private serv: MaterialService) { }

  ngOnInit() {
    this.fillDetailsTable();
  }

  fillDetailsTable(){
    this.serv.getmaterialsdetails(this.selectedMaterial).subscribe((res:any)=>{
      this.detailsResult =JSON.parse(res);
      this.headers = Object.keys(this.detailsResult[0]);
    });
      
      var a = 0;
  }

  ngOnChanges(changes:SimpleChanges) {
    this.fillDetailsTable();
  }
}
