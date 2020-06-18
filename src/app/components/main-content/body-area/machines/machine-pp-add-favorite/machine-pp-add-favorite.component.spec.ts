import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachinePpAddFavoriteComponent } from './machine-pp-add-favorite.component';

describe('MachinePpAddFavoriteComponent', () => {
  let component: MachinePpAddFavoriteComponent;
  let fixture: ComponentFixture<MachinePpAddFavoriteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachinePpAddFavoriteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachinePpAddFavoriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
