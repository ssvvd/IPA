import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MpTurnGrooveComponent } from './mp-turn-groove.component';

describe('MpTurnGrooveComponent', () => {
  let component: MpTurnGrooveComponent;
  let fixture: ComponentFixture<MpTurnGrooveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MpTurnGrooveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MpTurnGrooveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
