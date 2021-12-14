import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPaidModesComponent } from './edit-paid-modes.component';

describe('EditProductComponent', () => {
  let component: EditPaidModesComponent;
  let fixture: ComponentFixture<EditPaidModesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPaidModesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPaidModesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
