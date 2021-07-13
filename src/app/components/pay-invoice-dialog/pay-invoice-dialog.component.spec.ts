import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayInvoiceDialogComponent } from './pay-invoice-dialog.component';

describe('PayInvoiceDialogComponent', () => {
  let component: PayInvoiceDialogComponent;
  let fixture: ComponentFixture<PayInvoiceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayInvoiceDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayInvoiceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
