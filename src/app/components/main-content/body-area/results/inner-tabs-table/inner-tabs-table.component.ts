import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import {clsHelpProp} from 'src/app/models/results/help-prop';

@Component({
  selector: 'inner-tabs-table',
  templateUrl: './inner-tabs-table.component.html',
  styleUrls: ['./inner-tabs-table.component.scss']
})
export class InnerTabsTableComponent implements OnInit {

  @Input() viewParamsChanged: any ;
  selectedOption:clsHelpProp;

  constructor() { }

  ngOnInit(): void {
  }


  ngOnChanges(changes:SimpleChanges) {
    if (this.viewParamsChanged && changes.viewParamsChanged){
      this.selectedOption = this.viewParamsChanged.Res[0]
    }
  }

  changeSource(event, name) { event.target.src = name; }

}
