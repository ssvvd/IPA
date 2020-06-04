import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Appdetails54Component } from './appdetails54.component';

describe('Appdetails54Component', () => {
  let component: Appdetails54Component;
  let fixture: ComponentFixture<Appdetails54Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Appdetails54Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Appdetails54Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
