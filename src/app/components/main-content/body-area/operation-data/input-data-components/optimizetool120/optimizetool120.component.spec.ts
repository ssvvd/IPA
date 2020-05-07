import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Optimizetool120Component } from './optimizetool120.component';

describe('Optimizetool120Component', () => {
  let component: Optimizetool120Component;
  let fixture: ComponentFixture<Optimizetool120Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Optimizetool120Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Optimizetool120Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
