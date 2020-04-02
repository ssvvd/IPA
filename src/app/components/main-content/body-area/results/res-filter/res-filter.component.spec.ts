import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResFilterComponent } from './res-filter.component';

describe('ResFilterComponent', () => {
  let component: ResFilterComponent;
  let fixture: ComponentFixture<ResFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
