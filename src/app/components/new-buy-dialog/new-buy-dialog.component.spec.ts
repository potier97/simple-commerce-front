import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBuyDialogComponent } from './new-buy-dialog.component';

describe('NewBuyDialogComponent', () => {
  let component: NewBuyDialogComponent;
  let fixture: ComponentFixture<NewBuyDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewBuyDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewBuyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
