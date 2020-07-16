import { TestBed } from '@angular/core/testing';

import { DownloadresultService } from './downloadresult.service';

describe('DownloadresultService', () => {
  let service: DownloadresultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DownloadresultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
