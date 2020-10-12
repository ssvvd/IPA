import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MpThreadingComponent } from './mp-threading.component';

describe('MpThreadingComponent', () => {
  let component: MpThreadingComponent;
  let fixture: ComponentFixture<MpThreadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MpThreadingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MpThreadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
