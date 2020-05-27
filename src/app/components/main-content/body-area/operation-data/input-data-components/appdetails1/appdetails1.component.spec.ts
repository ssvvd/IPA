import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Appdetails1Component } from './appdetails1.component';

describe('Appdetails1Component', () => {
  let component: Appdetails1Component;
  let fixture: ComponentFixture<Appdetails1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Appdetails1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Appdetails1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
