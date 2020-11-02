import { Component, OnInit ,Input, Output,EventEmitter,OnChanges, SimpleChanges} from '@angular/core';
import { Machinespindle } from 'src/app/models/machines/machinespindle';
import { AppsettingService} from 'src/app/services/appsetting.service';
import { Observable, Subscription} from 'rxjs';
import 'chart.js';

export class ChartData
{
  DescChart:string;
  Col1Desc:string;
  Col2Desc:string;

  PoinX_1:number;
  PoinX_2:number;
  PoinX_3:number;
  PoinX_4:number;

  PoinY_1:number;
  PoinY_2:number;
  PoinY_3:number;
  PoinY_4:number;
}

@Component({
  selector: 'app-item-machine-spindle-chart',
  templateUrl: './machine-item-spindle-chart.component.html',
  styleUrls: ['./machine-item-spindle-chart.component.scss']
})

export class MachineItemSpindleChartComponent implements OnInit {
  
  @Input() events: Observable<void>;
  private eventsSubscription: Subscription;

  @Input() spindle:Machinespindle; 
  @Input() typeChart:string; 

  @Input() SpindleSpeed:number;
  @Input() Power:number;
  @Input() Torque:number;
  
  @Input() AdaptationType:string;
  @Input() AdaptationSize:number;

  @Output() N3Changed = new EventEmitter<{value: number}>();  
  @Output() P2T1Changed = new EventEmitter<{P2: number,T1: number}>();
  @Output() SpindelChanged = new EventEmitter<null>();
  @Input() exportPDF:boolean=false;

  chartdata:ChartData;
  chartLabels: Array<any>;
  public chartDatasets: Array<any>;
  chartType:string;
  chartDesc:string;
  public chartDescY:string;
  public chartColors: Array<any>;
  public chartOptions: any;
  
  constructor(private srv_appsetting:AppsettingService) { }

  ngOnInit() {
    this.FilldataChart();  
       this.CreateChart();

    this.eventsSubscription = this.events.subscribe(() => this.CreateChart());    
  }
  
  FilldataChart()
  {
      this.chartdata=new ChartData();    
      this.chartdata.PoinX_1 =this.spindle.N1;
      this.chartdata.PoinX_2 =this.spindle.N2;
      this.chartdata.PoinX_3 =this.spindle.N3;
      this.chartdata.PoinX_4 =this.spindle.N4; 
    
    if(this.typeChart=='torque')
      {
        /* this.chartdata.PoinY_1 =this.spindle.T1;
        this.chartdata.PoinY_2 =this.spindle.T2;
        this.chartdata.PoinY_3 =this.spindle.T3;
        this.chartdata.PoinY_4 =this.spindle.T4; */
        this.chartDesc= "Torque";
        this.srv_appsetting.Units=='M'?this.chartDescY="T[Nm]":this.chartDescY="P[Lbf]";
        //this.chartDescY ="T"
      }
    if(this.typeChart=='power')
      {
       /*  this.chartdata.PoinY_1 =this.spindle.P1;
        this.chartdata.PoinY_2 =this.spindle.P2;
        this.chartdata.PoinY_3 =this.spindle.P3;
        this.chartdata.PoinY_4 =this.spindle.P4; */
        this.chartDesc= "Power";
        this.srv_appsetting.Units=='M'?this.chartDescY="P[kW]":this.chartDescY="P[HP]";
        //this.chartDescY ="P"
      } 
  }
   CreateChart()
  {
    let labelaxisY:string;

    if(this.typeChart=='power') this.srv_appsetting.Units=='M'?labelaxisY="P[kW]":labelaxisY="P[HP]";
    if(this.typeChart=='torque') this.srv_appsetting.Units=='M'?labelaxisY="T[Nm]":labelaxisY="P[Lbf]";

    this.chartType = 'line';
    if(this.typeChart=='power') 
    {
      if(this.spindle.N3==this.spindle.N4)
          this.chartDatasets= [      
            { lineTension: 0,     
              data: [this.spindle.P1, this.spindle.P2, this.spindle.P3]
              }     
          ];
      else
      this.chartDatasets= [      
        { lineTension: 0,     
          data: [this.spindle.P1, this.spindle.P2, this.spindle.P3, this.spindle.P4]
          }     
      ]; 
    } 
    else
    {
      if(this.spindle.N3==this.spindle.N4)
        this.chartDatasets= [      
          { lineTension: 0,     
            data: [this.spindle.T1, this.spindle.T2, this.spindle.T3]
            }     
        ];
      else
      this.chartDatasets= [      
        { lineTension: 0,     
          data: [this.spindle.T1, this.spindle.T2, this.spindle.T3, this.spindle.T4]
          }     
      ];
        
    }    

    
    //this.chartLabels = [this.chartdata.PoinX_1, this.chartdata.PoinX_2, this.chartdata.PoinX_3, this.chartdata.PoinX_4];
    if(this.spindle.N3==this.spindle.N4)
      this.chartLabels = [this.spindle.N1, this.spindle.N2, this.spindle.N3];
    else
    this.chartLabels = [this.spindle.N1, this.spindle.N2, this.spindle.N3, this.spindle.N4];

    this.chartColors = [
      {
        backgroundColor:'rgba(255,255,255, 0.3)' ,
        borderColor: '#757677',
        borderWidth: 2,
        chartColors:'rgba(255,255,255, 0.3)' ,        
      }
      ];

    this.chartOptions = {
      responsive: true,
       legend: {
            display: false           
       },
      scales: {
        yAxes: [{
          scaleLabel: {
          display: true,
          labelString: labelaxisY
          }
        }],
         xAxes: [{
          scaleLabel: {
          display: true,
          labelString: 'N[rpm]'
          }
        }]
  }    
    }; 
 }  
     public chartClicked(e: any): void { }
     public chartHovered(e: any): void { }  

     CalculatePByT(N:number,T:number) :number
     {
      let v: number=0;
      let coeff:number;
      if(this.srv_appsetting.Units=='M') coeff=9550;
      if(this.srv_appsetting.Units=='I') coeff=5252;
      if(N!=0) v= Math.round(v= T*N/coeff); 
      return v;
     }

     CalculateTByP(N:number,P:number) :number
     {
      let v: number=0;
      let coeff:number;
      if(this.srv_appsetting.Units=='M') coeff=9550;
      if(this.srv_appsetting.Units=='I') coeff=5252;
      if(N!=0) v= Math.round(coeff*P/N);
      return v;
     }

     OnChangePoint(n:number)
     {
       //𝑇(𝑁𝑚)=(9550∗𝑃(𝑘𝑤))/𝑁
       let v: number;
       let coeff:number;
       if(this.srv_appsetting.Units=='M') coeff=9550;
       if(this.srv_appsetting.Units=='I') coeff=5252;
       if(this.typeChart=="power") 
       {
        if(n==1) {v= coeff*this.spindle.P1/this.spindle.N1; this.spindle.T1=Math.round(v);}
        if(n==2) {v= coeff*this.spindle.P2/this.spindle.N2; this.spindle.T2=Math.round(v);}
        if(n==3) {v= coeff*this.spindle.P3/this.spindle.N3; this.spindle.T3=Math.round(v);}
        if(n==4) {v= coeff*this.spindle.P4/this.spindle.N4; this.spindle.T4=Math.round(v);}        
       }
       else
       {
        if(n==1) {v= this.spindle.T1*this.spindle.N1/coeff; this.spindle.P1=Math.round(v);}
        if(n==2) {v= this.spindle.T2*this.spindle.N2/coeff; this.spindle.P2=Math.round(v);}
        if(n==3) {v= this.spindle.T3*this.spindle.N3/coeff; this.spindle.P3=Math.round(v);}
        if(n==4) {v= this.spindle.T4*this.spindle.N4/coeff; this.spindle.P4=Math.round(v);}     
       }   
       this.SpindelChanged.next();      
     }

     CheckRPMMax(value:number,name:string)
     {       
       if(value>100000) {
          if(name=='N1') this.spindle.N1 =100000;
          if(name=='N2') this.spindle.N2 =100000;
          if(name=='N3') this.spindle.N3 =100000;
          if(name=='N4') this.spindle.N4 =100000;
          alert('Max value is 100000');
       }
     }

     OnChangePoinX_1()
     { 
       //this.N1Changed.emit({ value: this.chartdata.PoinX_1});
     }

     OnChangePoinX_3()
     { 
       if(this.chartdata.PoinX_4<this.chartdata.PoinX_3)
       {
        this.spindle.N4=this.chartdata.PoinX_3;
        this.chartdata.PoinX_4=this.chartdata.PoinX_3;
       }
       this.N3Changed.emit({ value: this.chartdata.PoinX_3});

     }
     
     
     OnChangePoinX_4()
     { 
      if(this.chartdata.PoinX_4<this.chartdata.PoinX_3)
      {
       this.spindle.N3=this.chartdata.PoinX_4;
       this.chartdata.PoinX_3=this.chartdata.PoinX_4;
      }

       this.N3Changed.emit({ value: this.chartdata.PoinX_3});

     }

     OnChangePoinY_1()
     {         
      if(this.typeChart=="power")          
        this.spindle.P1=this.chartdata.PoinY_1;                         
          else          
        this.spindle.T1=this.chartdata.PoinY_1;
      this.CreateChart();  

      /*  if(this.typeChart=="power")  
        { 
          this.spindle.P1=this.chartdata.PoinY_1;                  
          this.P2T1Changed.emit({ P2: this.spindle.P2,T1:this.CalculateTByP(this.spindle.N1,this.spindle.P1)});              
        }
       else 
        { 
          this.spindle.T1=this.chartdata.PoinY_1;                        
          this.P2T1Changed.emit({ P2: this.spindle.P2,T1:this.spindle.T1});      
        }
        this.CreateChart();     */
     }

    OnChangePoinY_2()
    {        
      if(this.typeChart=="power") 
      {         
        this.spindle.P2=this.chartdata.PoinY_2;  
        this.P2T1Changed.emit({ P2: this.spindle.P2,T1:this.spindle.T1});                       
      }
      else  
      {        
        this.spindle.T2=this.chartdata.PoinY_2;   
        this.P2T1Changed.emit({ P2: this.CalculatePByT(this.spindle.N2,this.spindle.T2),T1:this.spindle.T1});   
      }
      this.CreateChart();                                    
    }

     OnChangePoinY_3()
    { 
      if(this.typeChart=="power")  
      { 
        this.spindle.P3=this.chartdata.PoinY_3;                  
        this.P2T1Changed.emit({ P2: this.spindle.P2,T1:this.CalculateTByP(this.spindle.N3,this.spindle.P3)});              
      }
     else 
      { 
        this.spindle.T3=this.chartdata.PoinY_3;                        
        this.P2T1Changed.emit({ P2: this.spindle.P2,T1:this.spindle.T3});      
      }
      this.CreateChart();    

     /*  if(this.typeChart=="power")          
        this.spindle.P3=this.chartdata.PoinY_3;                         
      else          
        this.spindle.T3=this.chartdata.PoinY_3;
        this.CreateChart();   */                                         
    }

     OnChangePoinY_4()
    {        
      if(this.typeChart=="power")          
        this.spindle.P4=this.chartdata.PoinY_4;                         
      else          
        this.spindle.T4=this.chartdata.PoinY_4;        
        this.CreateChart();                                   
    }

     ngOnChanges(changes: SimpleChanges) {       
        if (typeof this.chartdata!== 'undefined') 
          for (let property in changes) {
              if (property === 'SpindleSpeed') {                
                //this.chartdata.PoinX_1 = changes[property].currentValue;
                this.spindle.N3 = changes[property].currentValue;
                this.CreateChart();            
              } 
              if (property === 'Power') 
              {              
                this.spindle.P2 = changes[property].currentValue;
                this.spindle.T2=this.CalculateTByP(this.spindle.N2,this.spindle.P2);
                this.spindle.P3 = changes[property].currentValue;
                this.spindle.T3=this.CalculateTByP(this.spindle.N3,this.spindle.P3);
                this.spindle.P4 = changes[property].currentValue;
                this.spindle.T4=this.CalculateTByP(this.spindle.N4,this.spindle.P4);                
                this.CreateChart();                
              }
              if (property === 'Torque') 
              {              
                this.spindle.T1 = changes[property].currentValue;
                this.spindle.P1=this.CalculatePByT(this.spindle.N1,this.spindle.T1)
                this.CreateChart();                
              }
             /*  if (property === 'Power' || property === 'Torque') {              
                this.chartdata.PoinY_1 = changes[property].currentValue;
                this.CreateChart();                
              } */                             
              if (property === 'AdaptationType' ) {              
                //todo:get new graph             
                //this.CreateChart();              
              }
              if (property === 'AdaptationSize' ) {                                           
                //todo:get new graph
                //this.CreateChart();              
              }
               if (property === 'spindle' ) {                 
                this.FilldataChart();                                                          
                this.CreateChart();              
              }
              
          }
    }
}
