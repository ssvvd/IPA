import { Component, Input, OnInit,SimpleChanges ,OnChanges} from '@angular/core';
import { environment } from 'src/environments/environment';
import { StateManagerService} from 'src/app/services/statemanager.service' ;
import { AppsettingService} from 'src/app/services/appsetting.service';
import { ResultsService} from 'src/app/services/results.service' ;
import {clsPropertyValue} from 'src/app/models/results/property-value';
import {clsHelpProp} from 'src/app/models/results/help-prop';

@Component({
  selector: 'postprocessor',
  templateUrl: './postprocessor.component.html',
  styleUrls: ['./postprocessor.component.scss']
})
export class PostprocessorComponent implements OnInit ,OnChanges {
   
  @Input() CuttingSpeed:number;
  @Input() viewParamsChanged: any ;

  selectedOption:clsHelpProp;
  environment = environment;
  InfeedMethod:string ='Flank';
  RadialEn:string = 'cuttingdepth';
  SpindleSpeed:number=0;
  controller:string='Fanuc I&J';
  TimeMin:number=0;
  TimeSecond:number=0;
  PassValues:string[]=[];
  NoOfPasses:number=5;
  NoOfTooth:number=1;
  H:number=0;
  constructor(public srv_appsetting:AppsettingService,private srv_results:ResultsService,public srv_StMng:StateManagerService) 
  { 
  }
  
  ngOnInit(): void {

    this.srv_results.getpassesvalue (this.srv_StMng.SecApp,this.srv_StMng.IPL.GetItem('ThreadForm').value, 
                                     this.srv_StMng.IPL.GetItem('Pitch').value,this.NoOfTooth).subscribe((res: any) => 
    { 
      for (const d of JSON.parse(res)) { 
        
        this.H=d.H; 
        this.NoOfPasses = d.NoOfPasses;
        this.changepassnumber ();
      };  
      
      if (this.viewParamsChanged){
        this.selectedOption = this.viewParamsChanged.Res[0];       
      }
    });
  }

  counter(i: number) {
    return new Array(i+1);
 }

  SelectInfeedMethod(m:string)
  {
    this.InfeedMethod=m;
  }

  SelectRadialEn(m:string)
  {
    this.RadialEn=m;
    this.changepassnumber();
  }

  changepassnumber()
  {
    let Ap:number;
    this.PassValues=[];
    if(this.RadialEn=='cuttingdepth')
    {          
      Ap=(this.H-0.05)/(this.NoOfPasses-1)
      for (let i = 1; i < this.NoOfPasses; i++) {              
        this.PassValues.push((Math.round(Ap*1000)/1000).toFixed(3));        
      }
      this.PassValues.push('0.0500'); 
    }
    if(this.RadialEn=='chipvolume')
    {
      let delta:number;
      let ApPrev:number=0;
      let deltaAp:number;
      for (let i = 1; i <=this.NoOfPasses; i++) { 
        if(i==1) 
        {
          delta=0.3;         
        }
        else
        {
          delta=i-1;         
        }
        Ap= this.H/Math.sqrt(this.NoOfPasses-1) *Math.sqrt(delta);        
        deltaAp = Ap-ApPrev;
        ApPrev=Ap;
        let f:number=0;
        f.toFixed(3);
        this.PassValues.push((Math.round(deltaAp*1000)/1000).toFixed(3));        
      }
      //this.PassValues.push(0.050);
    }
  }

  ngOnChanges(changes:SimpleChanges) {
    if (this.viewParamsChanged && changes.viewParamsChanged){
      this.selectedOption = this.viewParamsChanged.Res[0];       
    }
  }
}
