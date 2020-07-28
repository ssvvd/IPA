import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MpIsoTurningComponent } from './mp-iso-turning.component';

describe('MpIsoTurningComponent', () => {
  let component: MpIsoTurningComponent;
  let fixture: ComponentFixture<MpIsoTurningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MpIsoTurningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MpIsoTurningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
