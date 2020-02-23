import { Component, OnInit ,Input, Output,EventEmitter,OnChanges, SimpleChanges} from '@angular/core';
import { Machinespindle } from 'src/app/models/machines/machinespindle';
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

  @Input() spindle:Machinespindle; 
  @Input() typeChart:string; 

  @Input() SpindleSpeed:number;
  @Input() Power:number;
  @Input() Torque:number;
  
  @Output() N1Changed = new EventEmitter<{value: number}>();  
  @Output() T1Changed = new EventEmitter<{value: number}>();
  @Output() P1Changed = new EventEmitter<{value: number}>();

  chartdata:ChartData;
  chartLabels: Array<any>;
  public chartDatasets: Array<any>;
  chartType:string;
  chartDesc:string;
  public chartDescY:string;
  public chartColors: Array<any>;
  public chartOptions: any;
  
  constructor() { }

  ngOnInit() {
    //alert(this.typeChart);
    this.chartdata=new ChartData();    
    this.chartdata.PoinX_1 =this.spindle.N1;
    this.chartdata.PoinX_2 =this.spindle.N2;
    this.chartdata.PoinX_3 =this.spindle.N3;
    this.chartdata.PoinX_4 =this.spindle.N4;
    
    if(this.typeChart=='torque')
      {
        this.chartdata.PoinY_1 =this.spindle.T1;
        this.chartdata.PoinY_2 =this.spindle.T2;
        this.chartdata.PoinY_3 =this.spindle.T3;
        this.chartdata.PoinY_4 =this.spindle.T4;
        this.chartDesc= "Torque";
        this.chartDescY ="T"
      }
    if(this.typeChart=='power')
      {
        this.chartdata.PoinY_1 =this.spindle.P1;
        this.chartdata.PoinY_2 =this.spindle.P2;
        this.chartdata.PoinY_3 =this.spindle.P3;
        this.chartdata.PoinY_4 =this.spindle.P4;
        this.chartDesc= "Power";
        this.chartDescY ="P"
      }       
       this.CreateChart();
  }

   CreateChart()
  {
    let labelaxisY:string;
    if(this.typeChart=='power') labelaxisY="P[Kw]";
    if(this.typeChart=='torque') labelaxisY="T[Nm]";

    this.chartType = 'line';    
    this.chartDatasets= [      
      { lineTension: 0,     
        data: [this.chartdata.PoinY_1, this.chartdata.PoinY_2, this.chartdata.PoinY_3, this.chartdata.PoinY_4]
         }     
    ];
    
    this.chartLabels = [this.chartdata.PoinX_1, this.chartdata.PoinX_2, this.chartdata.PoinX_3, this.chartdata.PoinX_4];
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

     OnChangePoinX_1()
     { 
       this.N1Changed.emit({ value: this.chartdata.PoinX_1});
     }

     OnChangePoinY_1()
     {        
       if(this.typeChart=="power")                 
          this.P1Changed.emit({ value: this.chartdata.PoinY_1});        
       else                 
          this.T1Changed.emit({ value: this.chartdata.PoinY_1});        
     }

     ngOnChanges(changes: SimpleChanges) {       
        if (typeof this.chartdata!== 'undefined') 
          for (let property in changes) {
              if (property === 'SpindleSpeed') {                
                this.chartdata.PoinX_1 = changes[property].currentValue;
                this.CreateChart();            
              } 
              if (property === 'Power' || property === 'Torque') {              
                this.chartdata.PoinY_1 = changes[property].currentValue;
                this.CreateChart();              
              }
              
          }
    }
}
