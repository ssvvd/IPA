import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Appdetails77Component } from './appdetails77.component';

describe('Appdetails77Component', () => {
  let component: Appdetails77Component;
  let fixture: ComponentFixture<Appdetails77Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Appdetails77Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Appdetails77Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
