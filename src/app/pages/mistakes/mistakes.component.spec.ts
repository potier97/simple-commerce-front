import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MistakesComponent } from './mistakes.component';

describe('MistakesComponent', () => {
  let component: MistakesComponent;
  let fixture: ComponentFixture<MistakesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MistakesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MistakesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
