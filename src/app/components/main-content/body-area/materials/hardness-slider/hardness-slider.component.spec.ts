import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HardnessSliderComponent } from './hardness-slider.component';

describe('HardnessSliderComponent', () => {
  let component: HardnessSliderComponent;
  let fixture: ComponentFixture<HardnessSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HardnessSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HardnessSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
