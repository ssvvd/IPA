import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptimizetoolAdaptortypeComponent } from './optimizetool-adaptortype.component';

describe('OptimizetoolAdaptortypeComponent', () => {
  let component: OptimizetoolAdaptortypeComponent;
  let fixture: ComponentFixture<OptimizetoolAdaptortypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptimizetoolAdaptortypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptimizetoolAdaptortypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
