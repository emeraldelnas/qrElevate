import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreebieScannerComponent } from './freebie-scanner.component';

describe('FreebieScannerComponent', () => {
  let component: FreebieScannerComponent;
  let fixture: ComponentFixture<FreebieScannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreebieScannerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreebieScannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
