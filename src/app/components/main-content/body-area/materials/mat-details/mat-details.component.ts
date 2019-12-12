import { Component, OnInit } from '@angular/core';
import { MaterialService } from 'src/app/services/material.service'

@Component({
  selector: 'app-mat-details',
  templateUrl: './mat-details.component.html',
  styleUrls: ['./mat-details.component.scss']
})
export class MatDetailsComponent implements OnInit {

  detailsResult:string[][];

  constructor(private serv: MaterialService) { }

  ngOnInit() {
    this.fillDetailsTable();
  }

  fillDetailsTable(){
    this.serv.getmaterialsdetails(8).subscribe((res:any)=>{
      this.detailsResult=JSON.parse(res);})
      var a = 0;
  }
}
