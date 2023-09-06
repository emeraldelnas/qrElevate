import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UniteScannerRoutingModule } from './unite-scanner-routing.module';
import { UniteScannerComponent } from './unite-scanner.component';
import { AttendeeScannerComponent } from './attendee-scanner/attendee-scanner.component';
import { FreebieScannerComponent } from './freebie-scanner/freebie-scanner.component';
import {
  NbIconModule,
  NbCardModule,
  NbButtonModule,
  NbBadgeModule,
  NbButtonGroupModule,
  NbLayoutModule,
} from '@nebular/theme';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { AttendeeDialogComponent } from './attendee-dialog/attendee-dialog.component';

@NgModule({
  declarations: [
    UniteScannerComponent,
    AttendeeScannerComponent,
    FreebieScannerComponent,
    AttendeeDialogComponent,
  ],
  imports: [
    CommonModule,
    UniteScannerRoutingModule,
    ZXingScannerModule,
    NbLayoutModule,
    NbButtonModule,
    NbIconModule,
    NbCardModule,
    NbBadgeModule,
    NbButtonGroupModule,
  ],
})
export class UniteScannerModule {}
