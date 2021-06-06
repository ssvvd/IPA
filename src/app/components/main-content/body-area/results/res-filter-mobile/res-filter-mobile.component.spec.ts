import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResFilterMobileComponent } from './res-filter-mobile.component';

describe('ResFilterMobileComponent', () => {
  let component: ResFilterMobileComponent;
  let fixture: ComponentFixture<ResFilterMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResFilterMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResFilterMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
