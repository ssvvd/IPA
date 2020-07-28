import { Component, OnInit ,Input} from '@angular/core';
import { ResultsService} from 'src/app/services/results.service' ;
import {clsHelpProp} from 'src/app/models/results/help-prop';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'result-pp-inventory',
  templateUrl: './result-pp-inventory.component.html',
  styleUrls: ['./result-pp-inventory.component.scss']
})
export class ResultPpInventoryComponent implements OnInit {

  constructor(private srv_Results:ResultsService,public activeModal: NgbActiveModal) { }
  
  @Input() objHelpProp:clsHelpProp;
  objCatalogs:string[]=[];

  ngOnInit(): void {
    let catalogstr:string;
    //this.objHelpProp.CatalogNo
    let strCatalog:string='';
    this.objCatalogs=this.objHelpProp.CatalogNo.filter(cat=> {cat!='' && cat!='-'});
    this.objCatalogs.forEach(cat => {
      strCatalog =strCatalog +',' + cat;
      //this.srv_Results.getresults(this.srv_StMng.SecApp,this.srv_appsetting.Units,this.srv_StMng.IPLChanged),
    });


  }

}
