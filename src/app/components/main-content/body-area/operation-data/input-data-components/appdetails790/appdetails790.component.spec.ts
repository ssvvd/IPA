import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Appdetails790Component } from './appdetails790.component';

describe('Appdetails790Component', () => {
  let component: Appdetails790Component;
  let fixture: ComponentFixture<Appdetails790Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Appdetails790Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Appdetails790Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
