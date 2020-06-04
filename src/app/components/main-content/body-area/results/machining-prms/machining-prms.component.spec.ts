import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachiningPrmsComponent } from './machining-prms.component';

describe('MachiningPrmsComponent', () => {
  let component: MachiningPrmsComponent;
  let fixture: ComponentFixture<MachiningPrmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachiningPrmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachiningPrmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
