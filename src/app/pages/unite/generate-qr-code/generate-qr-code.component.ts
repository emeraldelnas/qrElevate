import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';

type district = 'other' | 'central' | 'east' | 'west' | 'high';

@Component({
  selector: 'app-generate-qr-code',
  templateUrl: './generate-qr-code.component.html',
  styleUrls: ['./generate-qr-code.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenerateQrCodeComponent implements OnInit {
  qrData = '';

  qrIconList = {
    other: './assets/others-district.png',
    central: './assets/central-district.png',
    east: './assets/east-district.png',
    west: './assets/west-district.png',
    high: './assets/high-district.png',
  };

  qrIcon = this.qrIconList.other;

  singleSelectGroupValue = ['other'];

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit(): void {}

  updateSingleSelectGroupValue(value: Array<string>): void {
    this.singleSelectGroupValue = value;
    this.changeQrIcon(value[0] as district);
    this.cd.markForCheck();
  }

  changeQrIcon(district: district): void {
    this.qrIcon = this.qrIconList[district];
  }
}
