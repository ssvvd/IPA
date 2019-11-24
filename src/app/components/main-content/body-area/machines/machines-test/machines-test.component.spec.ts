import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachinesTestComponent } from './machines-test.component';

describe('MachinesTestComponent', () => {
  let component: MachinesTestComponent;
  let fixture: ComponentFixture<MachinesTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachinesTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachinesTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
