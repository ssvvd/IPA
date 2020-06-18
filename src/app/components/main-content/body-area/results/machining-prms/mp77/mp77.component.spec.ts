import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Mp77Component } from './mp77.component';

describe('Mp77Component', () => {
  let component: Mp77Component;
  let fixture: ComponentFixture<Mp77Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Mp77Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Mp77Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
