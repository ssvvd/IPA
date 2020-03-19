import { TestBed } from '@angular/core/testing';

import { DatalayerOptimizeToolService } from './datalayer-tooloptimize.service';

describe('DatalayerTooloptimizeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DatalayerOptimizeToolService = TestBed.get(DatalayerOptimizeToolService);
    expect(service).toBeTruthy();
  });
});
