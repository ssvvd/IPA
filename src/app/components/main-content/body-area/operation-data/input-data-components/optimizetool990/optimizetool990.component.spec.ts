import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Optimizetool990Component } from './optimizetool990.component';

describe('Optimizetool990Component', () => {
  let component: Optimizetool990Component;
  let fixture: ComponentFixture<Optimizetool990Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Optimizetool990Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Optimizetool990Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
