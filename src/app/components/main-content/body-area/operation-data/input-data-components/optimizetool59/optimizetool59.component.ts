import { Component, OnInit ,Input} from '@angular/core';
import { InputParameterItem } from 'src/app/models/operational-data/inputparameteritem';
import { InputParameterlist } from 'src/app/models/operational-data/inputparameterlist';

@Component({
  selector: 'app-optimizetool59',
  templateUrl: './optimizetool59.component.html',
  styleUrls: ['./optimizetool59.component.scss']
})
export class Optimizetool59Component implements OnInit {
  
  @Input() Ipl:InputParameterlist;

  constructor() { }

  ngOnInit() {
  }

}
