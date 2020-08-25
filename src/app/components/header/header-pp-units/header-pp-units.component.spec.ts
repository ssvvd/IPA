import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderPpUnitsComponent } from './header-pp-units.component';

describe('HeaderPpUnitsComponent', () => {
  let component: HeaderPpUnitsComponent;
  let fixture: ComponentFixture<HeaderPpUnitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderPpUnitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderPpUnitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
