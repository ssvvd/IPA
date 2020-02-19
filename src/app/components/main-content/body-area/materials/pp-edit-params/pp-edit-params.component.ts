import { Component,Input, OnInit,ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HardnessSliderComponent } from 'src/app/components/main-content/body-area/materials/hardness-slider/hardness-slider.component';

@Component({
  selector: 'app-pp-edit-params',
  templateUrl: './pp-edit-params.component.html',
  styleUrls: ['./pp-edit-params.component.scss']
})
export class PpEditParamsComponent implements OnInit{

  @ViewChild(HardnessSliderComponent,{ static: true }) slider: HardnessSliderComponent ; 
  @Input() modal_mat_id;
  @Input() modal_hardness;
  @Input() modal_group;
  @Input() origin_hardness;
  @Input() unit_hardness;
  cur_hb_hardness: string;

  constructor(public activeModal: NgbActiveModal) {
  }

     ngOnInit() {
      this.slider.setInetialParameters(this.modal_mat_id,this.modal_hardness,this.origin_hardness,this.unit_hardness);
     }

  reset(){
    this.slider.reset();
  }

  set(){
    this.cur_hb_hardness = this.slider.getCurValue();

    if (this.cur_hb_hardness != ""){
      this.activeModal.close(this.cur_hb_hardness);
    }
  }
}
