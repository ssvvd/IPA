import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Optimizetool800Component } from './optimizetool800.component';

describe('Optimizetool800Component', () => {
  let component: Optimizetool800Component;
  let fixture: ComponentFixture<Optimizetool800Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Optimizetool800Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Optimizetool800Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
