import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptimizetoolFilterExtComponent } from './optimizetool-filter-ext.component';

describe('OptimizetoolFilterExtComponent', () => {
  let component: OptimizetoolFilterExtComponent;
  let fixture: ComponentFixture<OptimizetoolFilterExtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptimizetoolFilterExtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptimizetoolFilterExtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
