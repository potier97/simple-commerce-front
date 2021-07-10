import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMistakeComponent } from './view-mistake.component';

describe('ViewMistakeComponent', () => {
  let component: ViewMistakeComponent;
  let fixture: ComponentFixture<ViewMistakeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewMistakeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMistakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
