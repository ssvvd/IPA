import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Appdetails780Component } from './appdetails780.component';

describe('Appdetails780Component', () => {
  let component: Appdetails780Component;
  let fixture: ComponentFixture<Appdetails780Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Appdetails780Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Appdetails780Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
