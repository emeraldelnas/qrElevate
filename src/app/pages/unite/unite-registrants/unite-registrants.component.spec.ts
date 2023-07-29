import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniteRegistrantsComponent } from './unite-registrants.component';

describe('UniteRegistrantsComponent', () => {
  let component: UniteRegistrantsComponent;
  let fixture: ComponentFixture<UniteRegistrantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UniteRegistrantsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UniteRegistrantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
