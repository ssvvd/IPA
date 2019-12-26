import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PpEditParamsComponent } from './pp-edit-params.component';

describe('PpEditParamsComponent', () => {
  let component: PpEditParamsComponent;
  let fixture: ComponentFixture<PpEditParamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PpEditParamsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PpEditParamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
