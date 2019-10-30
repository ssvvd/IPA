import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BodyAreaComponent } from './body-area.component';

describe('BodyAreaComponent', () => {
  let component: BodyAreaComponent;
  let fixture: ComponentFixture<BodyAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BodyAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BodyAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
