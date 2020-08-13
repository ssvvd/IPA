import { Component, OnInit ,Input} from '@angular/core';
import { ResultsService} from 'src/app/services/results.service' ;
import {clsHelpProp} from 'src/app/models/results/help-prop';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';

export class viewinvertory
{
  CatalogNo:string;
  GroupName:string;
  Avai_USA:boolean;
  Avai_EU:boolean;
  Avai_FarEast:boolean;
}

@Component({
  selector: 'result-pp-inventory',
  templateUrl: './result-pp-inventory.component.html',
  styleUrls: ['./result-pp-inventory.component.scss']
})

export class ResultPpInventoryComponent implements OnInit {

  constructor(private srv_Results:ResultsService,public activeModal: NgbActiveModal) { }
  
  @Input() objHelpProp:clsHelpProp;
  arrviewinvertory:viewinvertory[]=[];
  environment = environment;
  ngOnInit(): void {
       
    let strCatalog:string='';
    this.objHelpProp.CatalogNo.forEach(cat => {
      if(cat!='' && cat!='-') strCatalog =strCatalog +',' + cat;
    });
    this.srv_Results.GetAvailabilityByCatalogNos(strCatalog).subscribe(
          (res:any)=>{
            let data=JSON.parse(res);
            for (var i = 0; i < this.objHelpProp.CatalogNo.length; i++) {
              { 
                let cat =this.objHelpProp.CatalogNo[i];
                cat=cat.replace(/\s/g, "");
                if(cat!='' && cat!='-')
                {
                  let v:viewinvertory=new viewinvertory();
                  v.CatalogNo =cat;
                  v.Avai_USA=false;
                  v.Avai_EU=false;
                  v.Avai_FarEast=false;
                  v.GroupName = this.objHelpProp.GroupText[i];
                  let r:any[];
                  r=data.filter(object => {return object.CatalogNo == cat && object.StockName == 'USA'});
                  if(r!==undefined && r.length>0) v.Avai_USA =r[0].InStock;
  
                  r=data.filter(object => {return object.CatalogNo == cat && object.StockName == 'EU'});
                  if(r!==undefined && r.length>0) v.Avai_EU =r[0].InStock;
  
                  r=data.filter(object => {return object.CatalogNo == cat && object.StockName == 'FarEast'});
                  if(r!==undefined && r.length>0) v.Avai_FarEast =r[0].InStock;
                 
                  this.arrviewinvertory.push (v);
                }
              }}          
           }
         );    
  }
}
