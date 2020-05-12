import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Appdetails120Component } from './appdetails120.component';

describe('Appdetails120Component', () => {
  let component: Appdetails120Component;
  let fixture: ComponentFixture<Appdetails120Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Appdetails120Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Appdetails120Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
