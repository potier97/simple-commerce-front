import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CovenantInvoicesDialogComponent } from './covenant-invoices-dialog.component';

describe('CovenantInvoicesDialogComponent', () => {
  let component: CovenantInvoicesDialogComponent;
  let fixture: ComponentFixture<CovenantInvoicesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CovenantInvoicesDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CovenantInvoicesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
