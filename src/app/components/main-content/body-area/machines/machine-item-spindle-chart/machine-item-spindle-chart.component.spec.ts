import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineSpindleChartComponent } from './machine-spindle-chart.component';

describe('MachineSpindleChartComponent', () => {
  let component: MachineSpindleChartComponent;
  let fixture: ComponentFixture<MachineSpindleChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachineSpindleChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineSpindleChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
