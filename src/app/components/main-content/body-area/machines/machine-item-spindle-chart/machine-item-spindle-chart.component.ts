import { Component, OnInit ,Input} from '@angular/core';
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

  chartdata:ChartData;
  chartLabels: Array<any>;
  public chartDatasets: Array<any>;
  chartType:string;
  chartDesc:string;
  public chartDescY:string;
  public chartColors: Array<any>;
  public chartOptions: any;
  
  constructor() { }

   test_event(value) {
    alert(this.chartdata.PoinX_1);
  }

  ngOnInit() {
   
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
        this.chartDesc= "Torque diagram Mc [Nm]/n [1/min]";
        this.chartDescY ="T"
      }
    if(this.typeChart=='power')
      {
        this.chartdata.PoinY_1 =this.spindle.P1;
        this.chartdata.PoinY_2 =this.spindle.P2;
        this.chartdata.PoinY_3 =this.spindle.P3;
        this.chartdata.PoinY_4 =this.spindle.P4;
        this.chartDesc= "Power diagram Pc [Kw]/n [1/min]";
        this.chartDescY ="P"
      }       
       this.CreateChart();
  }

   CreateChart()
  {
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
       }
    }; 
 }  
     public chartClicked(e: any): void { }
     public chartHovered(e: any): void { }  
}
