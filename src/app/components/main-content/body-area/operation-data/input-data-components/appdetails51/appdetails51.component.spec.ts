import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Appdetails51Component } from './appdetails51.component';

describe('Appdetails51Component', () => {
  let component: Appdetails51Component;
  let fixture: ComponentFixture<Appdetails51Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Appdetails51Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Appdetails51Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
