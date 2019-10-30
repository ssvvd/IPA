import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachinedetailedComponent } from './machinedetailed.component';

describe('MachinedetailedComponent', () => {
  let component: MachinedetailedComponent;
  let fixture: ComponentFixture<MachinedetailedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachinedetailedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachinedetailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
