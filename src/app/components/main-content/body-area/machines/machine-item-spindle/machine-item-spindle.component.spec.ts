import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineItemSpindleComponent } from './machine-item-spindle.component';

describe('MachineItemSpindleComponent', () => {
  let component: MachineItemSpindleComponent;
  let fixture: ComponentFixture<MachineItemSpindleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachineItemSpindleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineItemSpindleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
