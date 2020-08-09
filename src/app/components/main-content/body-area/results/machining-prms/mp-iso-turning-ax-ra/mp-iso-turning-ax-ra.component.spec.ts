import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MpIsoTurningAxRaComponent } from './mp-iso-turning-ax-ra.component';

describe('MpIsoTurningAxRaComponent', () => {
  let component: MpIsoTurningAxRaComponent;
  let fixture: ComponentFixture<MpIsoTurningAxRaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MpIsoTurningAxRaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MpIsoTurningAxRaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
