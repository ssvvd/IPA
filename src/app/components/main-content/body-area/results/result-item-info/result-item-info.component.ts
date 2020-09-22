import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { ResultsService} from 'src/app/services/results.service' ;
import { AppsettingService} from 'src/app/services/appsetting.service';
import { environment } from 'src/environments/environment';

export class PropertyInfo
{
  header:string;
  title:string;
  value:string;
}

@Component({
  selector: 'result-item-info',
  templateUrl: './result-item-info.component.html',
  styleUrls: ['./result-item-info.component.scss']
})


export class ResultItemInfoComponent implements OnInit {
  
  private eventsSubscription: Subscription=new Subscription();
  environment=environment;
  constructor(private srv_Results:ResultsService,public srv_appsetting:AppsettingService) { }

  @Input() CatalogNo:string;
  @Input () Family:string;
  @Input () ItemDesignation:string;

  @Input() viewParamsChanged:any;

  FamilyName:string;
  FamilyDesc:string;
  ItemDesc:string;
  Img1:string;
  Img2:string;

  ParamValues:any;
  ParamHeader:any;
  arrHeader:string[]=[];
  arrValues:string[]=[];
  arrTitle:string[]=[];
  arrParNumber:string[]=[];

  arrProp:PropertyInfo[]=[];
  arrBrandName:string[]=[];

  ngOnInit(): void {
    this.CatalogNo=this.CatalogNo.replace(/\s/g, "");
    this.eventsSubscription.add(this.srv_Results.getiteminfoparamvalues(this.CatalogNo,this.srv_appsetting.Units,this.srv_appsetting.SelectedLanguage.LanguageCode).subscribe((parvalues:any) => 
    {
      //console.log('this.viewParamsChanged.Res[0]');
      //console.log(this.viewParamsChanged);
        this.eventsSubscription.add(this.srv_Results.getiteminfoparamheader(this.srv_appsetting.SelectedLanguage.LanguageCode,this.Family,this.srv_appsetting.Units).subscribe((parheader:any) => 
        {
          this.eventsSubscription.add(this.srv_Results.getfamilydata(this.Family,this.srv_appsetting.Units,this.srv_appsetting.SelectedLanguage.LanguageCode).subscribe((familydata:any) => 
          {    
            this.eventsSubscription.add(this.srv_Results.getbrandnamebyfamily(this.Family).subscribe((branddata:any) => 
            { 
              for (const d of JSON.parse(branddata))
              {                 
                this.arrBrandName.push(d.GFCLN.toString());
              }

            let fd:any;
            fd=JSON.parse(familydata);
            this.FamilyName=fd[0].FamilyName;
            this.FamilyDesc=fd[0].FamilyDescription;

            this.ParamValues=JSON.parse(parvalues);
            this.ParamHeader=JSON.parse(parheader);
            //this.ParamHeader=this.ParamHeader.filter(ph=> {ph.showHide=='SHOW'});
          
          for (const d of this.ParamHeader)
          { 
            if(d.showHide=='SHOW')
              this.arrParNumber.push(d.GPNUM_ISO.toString());
          }

          Object.keys(this.ParamValues[0]).forEach(k => {
            if(this.arrParNumber.indexOf(k.toString().split('~')[1]) > -1)
            {
              this.arrHeader.push(k.toString().split('~')[0]);
              this.arrTitle.push(k.toString().split('~')[2]);
              this.arrValues.push(this.ParamValues[0][k].split('~')[0]);

              let p:PropertyInfo = { header: k.toString().split('~')[0], title:k.toString().split('~')[2],value:this.ParamValues[0][k].split('~')[0] };
              this.arrProp.push(p);
              //console.log(p);
            }
            //console.log(k);
          });

         // console.log(Object.keys(this.ParamValues[0]));
            
          this.ParamHeader=JSON.parse(parheader);
        }));}));}));
    }));
  }

  ngOnDestroy() {  
    this.eventsSubscription.unsubscribe();
  }

  ngAfterViewInit()
  {
    
  }
}
