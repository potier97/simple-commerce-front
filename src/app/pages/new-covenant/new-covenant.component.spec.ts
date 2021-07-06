import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCovenantComponent } from './new-covenant.component';

describe('NewCovenantComponent', () => {
  let component: NewCovenantComponent;
  let fixture: ComponentFixture<NewCovenantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewCovenantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCovenantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
