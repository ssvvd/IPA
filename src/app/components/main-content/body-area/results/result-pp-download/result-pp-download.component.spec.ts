import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultPpDownloadComponent } from './result-pp-download.component';

describe('ResultPpDownloadComponent', () => {
  let component: ResultPpDownloadComponent;
  let fixture: ComponentFixture<ResultPpDownloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultPpDownloadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultPpDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
