import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaidModesComponent } from './paid-modes.component';

describe('PaidModesComponent', () => {
  let component: PaidModesComponent;
  let fixture: ComponentFixture<PaidModesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaidModesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaidModesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
