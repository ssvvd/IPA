import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptimizetoolFilterComponent } from './optimizetool-filter.component';

describe('OptimizetoolFilterComponent', () => {
  let component: OptimizetoolFilterComponent;
  let fixture: ComponentFixture<OptimizetoolFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptimizetoolFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptimizetoolFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
