import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Appdetails59Component } from './appdetails59.component';

describe('Appdetails59Component', () => {
  let component: Appdetails59Component;
  let fixture: ComponentFixture<Appdetails59Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Appdetails59Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Appdetails59Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
