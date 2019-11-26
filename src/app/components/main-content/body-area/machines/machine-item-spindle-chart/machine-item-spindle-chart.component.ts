import { Component, OnInit ,Input} from '@angular/core';
import { Machinespindle } from 'src/app/models/machines/machinespindle';
import { MachineItemSpindleChartModule } from 'src/app/components/main-content/body-area/machines/machine-item-spindle-chart/machine-item-spindle-chart.module';
//import * as CanvasJS from 'canvasjs';
//import {Chart} from 'chart.js';
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
  public chartColors: Array<any>;
  public chartOptions: any;

  constructor() { }

  ngOnInit() {

    this.CreateChart();
    //todo:
    this.typeChart='torque';
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

      }
    if(this.typeChart=='power')
      {
        this.chartdata.PoinY_1 =this.spindle.P1;
        this.chartdata.PoinY_2 =this.spindle.P2;
        this.chartdata.PoinY_3 =this.spindle.P3;
        this.chartdata.PoinY_4 =this.spindle.P4;
      } 

       /* let chart = new CanvasJS.Chart("chartContainer", {
		              animationEnabled: false,
		              exportEnabled: true,
                  title: {
                    text: "Basic Column Chart in Angular"
                  },
                  data: [{
                    type: "line",
                    dataPoints: [
                      { y: this.chartdata.PoinY_1, label: this.chartdata.PoinX_1 },
                      { y: this.chartdata.PoinY_2, label: this.chartdata.PoinX_2 },
                      { y: this.chartdata.PoinY_3, label: this.chartdata.PoinX_3 },
                      { y: this.chartdata.PoinY_4, label: this.chartdata.PoinX_4 }
                    ]
                  }]
	});
		
  chart.render();  */
  }
  
   CreateChart()
  {
    this.chartType = 'line';
    this.chartDatasets= [
      { data: [65, 59, 80, 81, 56, 55, 40], label: 'My First dataset' },
      { data: [28, 48, 40, 19, 86, 27, 90], label: 'My Second dataset' }
    ];

    this.chartLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    this.chartColors = [
      {
        backgroundColor: 'rgba(105, 0, 132, .2)',
        borderColor: 'rgba(200, 99, 132, .7)',
        borderWidth: 2,
      },
        {
          backgroundColor: 'rgba(0, 137, 132, .2)',
          borderColor: 'rgba(0, 10, 130, .7)',
          borderWidth: 2,
        }
      ];

    this.chartOptions = {
      responsive: true
    };
 
 }  
     public chartClicked(e: any): void { }
     public chartHovered(e: any): void { }
  
}
