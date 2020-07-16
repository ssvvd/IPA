import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Mp760Component } from './mp760.component';

describe('Mp760Component', () => {
  let component: Mp760Component;
  let fixture: ComponentFixture<Mp760Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Mp760Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Mp760Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
