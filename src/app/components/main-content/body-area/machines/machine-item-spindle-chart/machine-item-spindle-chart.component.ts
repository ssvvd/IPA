import { Component, OnInit ,Input} from '@angular/core';
import { Machinespindle } from 'src/app/models/machines/machinespindle';
import 'chart.js';
import { MachineItemSpindleChartModule } from 'src/app/components/main-content/body-area/machines/machine-item-spindle-chart/machine-item-spindle-chart.module';


export interface ChartData
{
  DescChart:string;
  Col1Desc:string;
  Col2Desc:string;

  Poin1_X:number;
  Poin2_X:number;
  Poin3_X:number;
  Poin4_X:number;

  Poin1_Y:number;
  Poin2_Y:number;
  Poin3_Y:number;
  Poin4_Y:number;
}

@Component({
  selector: 'app-item-machine-spindle-chart',
  templateUrl: './machine-item-spindle-chart.component.html',
  styleUrls: ['./machine-item-spindle-chart.component.scss']
})

export class MachineItemSpindleChartComponent implements OnInit {

  @Input() spindle:Machinespindle; 
  @Input() typeChart:string;
  
  ChartData:ChartData;

  chartLabels: Array<any>;
  public chartDatasets: Array<any>;
  chartType:string;
  public chartColors: Array<any>;
  public chartOptions: any;

  constructor() { }

  ngOnInit() {
    this.ChartData.Poin1_X =this.spindle.N1;
    this.ChartData.Poin2_X =this.spindle.N2;
    this.ChartData.Poin3_X =this.spindle.N3;
    this.ChartData.Poin4_X =this.spindle.N4;
    if(this.typeChart=='torque')
      {
        this.ChartData.Poin1_Y =this.spindle.T1;
        this.ChartData.Poin2_Y =this.spindle.T2;
        this.ChartData.Poin3_Y =this.spindle.T3;
        this.ChartData.Poin4_Y =this.spindle.T4;

      }
    if(this.typeChart=='power')
      {
        this.ChartData.Poin1_Y =this.spindle.P1;
        this.ChartData.Poin2_Y =this.spindle.P2;
        this.ChartData.Poin3_Y =this.spindle.P3;
        this.ChartData.Poin4_Y =this.spindle.P4;

      }
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
