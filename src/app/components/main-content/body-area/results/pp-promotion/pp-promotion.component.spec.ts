import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PpPromotionComponent } from './pp-promotion.component';

describe('PpPromotionComponent', () => {
  let component: PpPromotionComponent;
  let fixture: ComponentFixture<PpPromotionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PpPromotionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PpPromotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
