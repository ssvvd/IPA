import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachinesFilterMobileComponent } from './machines-filter-mobile.component';

describe('MachinesFilterMobileComponent', () => {
  let component: MachinesFilterMobileComponent;
  let fixture: ComponentFixture<MachinesFilterMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachinesFilterMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachinesFilterMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
