import { TestBed } from '@angular/core/testing';

import { PaidModesService } from './paid-modes.service';

describe('PaidModesService', () => {
  let service: PaidModesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaidModesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
