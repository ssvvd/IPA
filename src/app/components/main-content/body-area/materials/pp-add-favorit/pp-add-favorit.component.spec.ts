import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PpAddFavoritComponent } from './pp-add-favorit.component';

describe('PpAddFavoritComponent', () => {
  let component: PpAddFavoritComponent;
  let fixture: ComponentFixture<PpAddFavoritComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PpAddFavoritComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PpAddFavoritComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
