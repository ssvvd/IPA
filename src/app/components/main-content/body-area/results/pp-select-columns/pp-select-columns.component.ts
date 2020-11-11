import { Component,Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { clsProperties } from 'src/app/models/results/properties';

@Component({
  selector: 'app-pp-select-columns',
  templateUrl: './pp-select-columns.component.html',
  styleUrls: ['./pp-select-columns.component.scss']
})
export class PpSelectColumnsComponent implements OnInit {

  @Input() modal_columns_Org;
  @Input() modal_columns;
  counter:number=0;
  dangMsg:string = '';
  modal_columns_cur:clsProperties[] = [];

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
    this.counter = this.modal_columns.filter((obj) => obj.IsShow === true).length;
    //this.modal_columns_cur = this.modal_columns
     this.modal_columns_cur = JSON.parse(JSON.stringify(this.modal_columns));
  }


checkedState(event, prty) {
            if(event.target.checked === true){
              if(this.counter < 7){
                this.dangMsg = "";
                prty.IsShow = true;
                this.counter++
            }else{
               event.target.checked = false;
            }
            }else if(this.counter>2){
              prty.IsShow = false;
              this.counter--;
            }
        }

        reset(){
          this.counter = 7
          this.modal_columns = JSON.parse(JSON.stringify(this.modal_columns_Org));
           this.modal_columns_cur = JSON.parse(JSON.stringify(this.modal_columns));
          //this.modal_columns_cur = this.modal_columns
        }

        set(){
          if (this.counter < 3){
            this.dangMsg = "Select at least one column"
          }
          else{
            this.modal_columns = this.modal_columns_cur;
            this.activeModal.close(this.modal_columns_cur);  
          }
          
        }

        getInnerHtml(n1:string,n2:string){
          return n1 + ' - ' + n2

        }
}
