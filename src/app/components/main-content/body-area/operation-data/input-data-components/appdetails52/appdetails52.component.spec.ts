import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Appdetails52Component } from './appdetails52.component';

describe('Appdetails52Component', () => {
  let component: Appdetails52Component;
  let fixture: ComponentFixture<Appdetails52Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Appdetails52Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Appdetails52Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
