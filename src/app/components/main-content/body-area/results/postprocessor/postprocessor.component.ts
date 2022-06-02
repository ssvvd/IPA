import { Component, Input, OnInit,SimpleChanges ,OnChanges} from '@angular/core';
import { StateManagerService} from '../../../../../services/statemanager.service' ;
import { environment } from '../../../../../../environments/environment';
import { AppsettingService} from '../../../../../services/appsetting.service';
import { ResultsService} from '../../../../../services/results.service' ;
import { ResultsStoreService} from '../../../../../services/results-store.service' ;
//import {clsPropertyValue} from '../../../../../models/results/property-value';
import {clsHelpProp} from '../../../../../models/results/help-prop';
import { NgxSpinnerService } from "ngx-spinner"; 

@Component({
  selector: 'postprocessor',
  templateUrl: './postprocessor.component.html',
  styleUrls: ['./postprocessor.component.scss']
})
export class PostprocessorComponent implements OnInit ,OnChanges {
   
  @Input() CuttingSpeed:string;
  @Input() viewParamsChanged: any ;


  selectedOption:clsHelpProp;
  environment = environment;

  InfeedMethod:string ='Flank';
  RadialEn:string = 'cuttingdepth';
  controller:string='Fanuc';

  SpindleSpeed:string='';
  
  TimeMin:number=0;
  TimeSecond:number=0;
  PassValues:string[]=[];
  NoOfPasses:number=5;
  NoOfTooth:number=1;
  H:number=0;
  constructor(public srv_appsetting:AppsettingService,private srv_results:ResultsService,public srv_StMng:StateManagerService,
    private srv_ResultsStoreService:ResultsStoreService,private SpinnerService: NgxSpinnerService) 
  { 
  }

  ngOnInit(): void {
    
    if(this.srv_ResultsStoreService.NoOfPasses==0)
    {
      this.SpinnerService.show();
      this.srv_results.getpassesvalue (this.srv_StMng.SecApp,this.srv_StMng.IPL.GetItem('ThreadForm').value, 
                                     this.srv_StMng.IPL.GetItem('Pitch').value,this.NoOfTooth).subscribe((res: any) => 
      { 
        
      for (const d of JSON.parse(res)) { 
        
        this.H=d.H; 
        this.NoOfPasses = d.NoOfPasses;

        this.srv_ResultsStoreService.H=this.H;
        this.srv_ResultsStoreService.NoOfPasses=this.NoOfPasses;

        //this.srv_StMng.IPL.GetItem('PassNum').value= d.NoOfPasses;
        this.changepassnumber ();
        this.SpinnerService.hide();
      }
    });
    }
    else
    {
      this.H=this.srv_ResultsStoreService.H;
      this.NoOfPasses=this.srv_ResultsStoreService.NoOfPasses;
      this.changepassnumber ();
      //this.SpinnerService.hide();
    }
          
        if (this.viewParamsChanged){
          this.selectedOption = this.viewParamsChanged.Res[0];       
        }
  
        if(this.srv_ResultsStoreService.CuttingSpeed =='')
        {  
          let ar=this.viewParamsChanged.Res[1];
          this.CuttingSpeed=ar[14][0].value;  
          this.srv_ResultsStoreService.CuttingSpeed =this.CuttingSpeed;    
        }
        else        
          this.CuttingSpeed=this.srv_ResultsStoreService.CuttingSpeed;        
        
        if(this.srv_ResultsStoreService.SpindleSpeed =='')
        {
          this.SpindleSpeed =this.srv_StMng.IPL.GetItem('PW_CX').value;
          this.srv_ResultsStoreService.SpindleSpeed=this.srv_StMng.IPL.GetItem('PW_CX').value;
        }
        else
          this.SpindleSpeed =this.srv_ResultsStoreService.SpindleSpeed;        
      
        if(this.srv_ResultsStoreService.Controller =='')                          
          this.srv_ResultsStoreService.Controller =this.controller;             
        else        
          this.controller=this.srv_ResultsStoreService.Controller;   
        
        if(this.srv_ResultsStoreService.InfeedMethod =='')                            
          this.srv_ResultsStoreService.InfeedMethod =this.InfeedMethod;                         
        else        
          this.InfeedMethod=this.srv_ResultsStoreService.InfeedMethod;  
          
        if(this.srv_ResultsStoreService.RadialEn =='')                              
            this.srv_ResultsStoreService.RadialEn =this.RadialEn ;                                
        else        
            this.RadialEn=this.srv_ResultsStoreService.RadialEn;
        
        if(this.srv_ResultsStoreService.NoOfPasses ==0)                              
            this.srv_ResultsStoreService.NoOfPasses =this.NoOfPasses ;                                
        else        
            this.NoOfPasses=this.srv_ResultsStoreService.NoOfPasses;
        
        if(this.srv_ResultsStoreService.H ==0)                              
            this.srv_ResultsStoreService.H =this.H ;                                
        else        
            this.H=this.srv_ResultsStoreService.H;
      
      
    
  }

  changecontroller()
  {
    this.srv_ResultsStoreService.Controller= this.controller;
  }

  counter(i: number) {
    return new Array(i+1);
 }

  SelectInfeedMethod(m:string)
  {
    this.InfeedMethod=m;
    this.srv_ResultsStoreService.InfeedMethod=m;
    //this.srv_StMng.IPL.GetItem('Pitch').value= this.InfeedMethod;
  }

  SelectRadialEn(m:string)
  {
    this.RadialEn=m;
    this.srv_ResultsStoreService.RadialEn=m;
    //this.srv_StMng.IPL.GetItem('RadialEngagement').value =m;
    this.changepassnumber();

  }

  changepassnumber()
  {
    //this.srv_StMng.IPL.GetItem('PassNum').value= this.NoOfPasses.toString();
    this.srv_ResultsStoreService.NoOfPasses= this.NoOfPasses;
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

  changeSpeed()
  {
    this.srv_ResultsStoreService.SpindleSpeed =this.SpindleSpeed;
    this.srv_ResultsStoreService.CuttingSpeed =this.CuttingSpeed;
  }
}
