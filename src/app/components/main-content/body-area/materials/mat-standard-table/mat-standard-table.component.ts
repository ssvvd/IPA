import { Component, OnInit,Input,SimpleChanges } from '@angular/core';
import { MaterialService } from 'src/app/services/material.service';

@Component({
  selector: 'app-mat-standard-table',
  templateUrl: './mat-standard-table.component.html',
  styleUrls: ['./mat-standard-table.component.scss','../materials.component.scss']
})
export class MatStandardTableComponent implements OnInit {

  dtResult:any;
  headers:any;
  @Input() selectedCateg: string ;
  @Input() selectedStandard: string ;

  constructor(private serv: MaterialService) { }

  ngOnInit() {
    this.fillTable();
  }

  fillTable(){
    this.serv.getmaterialsdetailsStnd(this.selectedCateg,this.selectedStandard).subscribe((res:any)=>{
      this.dtResult =JSON.parse(res);
      this.headers = Object.keys(this.dtResult[0]);
    });
      
  }

  ngOnChanges(changes:SimpleChanges) {
    this.fillTable();
  }

}
