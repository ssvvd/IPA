import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachinesFilterComponent } from './machines-filter.component';

describe('MachinesFilterComponent', () => {
  let component: MachinesFilterComponent;
  let fixture: ComponentFixture<MachinesFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachinesFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachinesFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
