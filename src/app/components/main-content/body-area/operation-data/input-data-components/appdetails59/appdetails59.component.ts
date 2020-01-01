import { Component, OnInit,Input } from '@angular/core';
import { InputParameterItem } from 'src/app/models/operational-data/inputparameteritem';
import { InputParameterlist } from 'src/app/models/operational-data/inputparameterlist';

@Component({
  selector: 'app-appdetails59',
  templateUrl: './appdetails59.component.html',
  styleUrls: ['./appdetails59.component.scss']
})
export class Appdetails59Component implements OnInit {

  @Input() Ipl:InputParameterlist;
  //DepthOfShoulder_ap:string;
  constructor() { }

  ngOnInit() {    
    //if(typeof(this.Ipl)!== 'undefined' && this.Ipl !== null)
    //{
      //this.DepthOfShoulder_ap =this.Ipl.GetItem('DepthOfShoulder_ap').valuedefault;
    //}
  }

}
