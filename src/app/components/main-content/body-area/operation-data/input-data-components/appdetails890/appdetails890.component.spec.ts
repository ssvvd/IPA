import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Appdetails890Component } from './appdetails890.component';

describe('Appdetails890Component', () => {
  let component: Appdetails890Component;
  let fixture: ComponentFixture<Appdetails890Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Appdetails890Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Appdetails890Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
