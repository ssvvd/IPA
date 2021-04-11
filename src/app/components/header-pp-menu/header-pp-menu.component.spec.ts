import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderPpMenuComponent } from './header-pp-menu.component';

describe('HeaderPpMenuComponent', () => {
  let component: HeaderPpMenuComponent;
  let fixture: ComponentFixture<HeaderPpMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderPpMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderPpMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
