import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PpSuccessfullyComponent } from './pp-successfully.component';

describe('PpSuccessfullyComponent', () => {
  let component: PpSuccessfullyComponent;
  let fixture: ComponentFixture<PpSuccessfullyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PpSuccessfullyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PpSuccessfullyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
