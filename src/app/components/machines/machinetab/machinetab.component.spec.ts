import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachinetabComponent } from './machinetab.component';

describe('MachinetabComponent', () => {
  let component: MachinetabComponent;
  let fixture: ComponentFixture<MachinetabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachinetabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachinetabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
