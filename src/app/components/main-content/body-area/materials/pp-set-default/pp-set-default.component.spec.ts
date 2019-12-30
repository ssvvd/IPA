import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PpSetDefaultComponent } from './pp-set-default.component';

describe('PpSetDefaultComponent', () => {
  let component: PpSetDefaultComponent;
  let fixture: ComponentFixture<PpSetDefaultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PpSetDefaultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PpSetDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
