import { Component, OnInit,Input } from '@angular/core';
import { InputParameterItem } from 'src/app/models/operational-data/inputparameteritem';
import { InputParameterlist } from 'src/app/models/operational-data/inputparameterlist';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-appdetails59',
  templateUrl: './appdetails59.component.html',
  styleUrls: ['./appdetails59.component.scss']
})
export class Appdetails59Component implements OnInit {

  @Input() Ipl:InputParameterlist;
  ImageName:string='';
  InFocus:boolean=false;
  environment=environment;
 
  constructor() { }

  ngOnInit() {        
  }
 
  onfocusfield(field:string)
  {
    this.InFocus=true;
    this.ImageName= environment.ImageInputPath + this.Ipl.GetItem(field).image;
  }

  onfocusoutfield()
  {
    this.InFocus=false;
    this.ImageName="";
  }
}
