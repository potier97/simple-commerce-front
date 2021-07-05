import { TestBed } from '@angular/core/testing';

import { InvoiceToPdfService } from './invoice-to-pdf.service';

describe('InvoiceToPdfService', () => {
  let service: InvoiceToPdfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvoiceToPdfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
