import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendeeScannerComponent } from './attendee-scanner.component';

describe('AttendeeScannerComponent', () => {
  let component: AttendeeScannerComponent;
  let fixture: ComponentFixture<AttendeeScannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttendeeScannerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendeeScannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
