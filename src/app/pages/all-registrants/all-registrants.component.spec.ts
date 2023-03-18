import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllRegistrantsComponent } from './all-registrants.component';

describe('AllRegistrantsComponent', () => {
  let component: AllRegistrantsComponent;
  let fixture: ComponentFixture<AllRegistrantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllRegistrantsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllRegistrantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
