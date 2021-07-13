import { TestBed } from '@angular/core/testing';

import { PayInvoiceService } from './pay-invoice.service';

describe('PayInvoiceService', () => {
  let service: PayInvoiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayInvoiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
