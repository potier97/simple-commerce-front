import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPaidModesComponent } from './new-paid-modes.component';

describe('NewProductComponent', () => {
  let component: NewPaidModesComponent;
  let fixture: ComponentFixture<NewPaidModesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewPaidModesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPaidModesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
