import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Optimizetool52Component } from './optimizetool52.component';

describe('Optimizetool52Component', () => {
  let component: Optimizetool52Component;
  let fixture: ComponentFixture<Optimizetool52Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Optimizetool52Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Optimizetool52Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
