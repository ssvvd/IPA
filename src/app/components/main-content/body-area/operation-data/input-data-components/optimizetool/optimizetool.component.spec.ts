import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptimizetoolComponent } from './optimizetool.component';

describe('OptimizetoolComponent', () => {
  let component: OptimizetoolComponent;
  let fixture: ComponentFixture<OptimizetoolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptimizetoolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptimizetoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
