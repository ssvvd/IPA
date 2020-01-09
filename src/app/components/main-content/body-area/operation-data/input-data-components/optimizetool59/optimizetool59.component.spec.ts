import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Optimizetool59Component } from './optimizetool59.component';

describe('Optimizetool59Component', () => {
  let component: Optimizetool59Component;
  let fixture: ComponentFixture<Optimizetool59Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Optimizetool59Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Optimizetool59Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
