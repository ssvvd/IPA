import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Appdetails990Component } from './appdetails990.component';

describe('Appdetails990Component', () => {
  let component: Appdetails990Component;
  let fixture: ComponentFixture<Appdetails990Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Appdetails990Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Appdetails990Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
