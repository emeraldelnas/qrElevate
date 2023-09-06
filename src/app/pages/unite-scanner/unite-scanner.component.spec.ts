import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniteScannerComponent } from './unite-scanner.component';

describe('UniteScannerComponent', () => {
  let component: UniteScannerComponent;
  let fixture: ComponentFixture<UniteScannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UniteScannerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UniteScannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
