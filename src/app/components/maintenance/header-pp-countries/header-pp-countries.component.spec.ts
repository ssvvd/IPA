import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderPpCountriesComponent } from './header-pp-countries.component';

describe('HeaderPpCountriesComponent', () => {
  let component: HeaderPpCountriesComponent;
  let fixture: ComponentFixture<HeaderPpCountriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderPpCountriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderPpCountriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
