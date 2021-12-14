import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingUpComponent } from './singup.component';

describe('LoginComponent', () => {
  let component: SingUpComponent;
  let fixture: ComponentFixture<SingUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingUpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});