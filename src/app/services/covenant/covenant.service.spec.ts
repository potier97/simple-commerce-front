import { TestBed } from '@angular/core/testing';

import { CovenantService } from './covenant.service';

describe('CovenantService', () => {
  let service: CovenantService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CovenantService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
