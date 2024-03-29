import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UniteRoutingModule } from './unite-routing.module';
import { UniteComponent } from './unite.component';
import { UniteRegistrantsComponent } from './unite-registrants/unite-registrants.component';
import { UniteAttendeesComponent } from './unite-attendees/unite-attendees.component';
import { GenerateQrCodeComponent } from './generate-qr-code/generate-qr-code.component';
import { FormsModule } from '@angular/forms';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import {
  NbActionsModule,
  NbButtonGroupModule,
  NbButtonModule,
  NbCardModule,
  NbDatepickerModule,
  NbIconModule,
  NbInputModule,
  NbLayoutModule,
  NbMenuModule,
  NbSidebarModule,
} from '@nebular/theme';
import { SharedModule } from 'src/app/shared/shared.module';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  declarations: [
    UniteComponent,
    UniteRegistrantsComponent,
    UniteAttendeesComponent,
    GenerateQrCodeComponent,
  ],
  imports: [
    CommonModule,
    UniteRoutingModule,
    FormsModule,
    NbLayoutModule,
    NbSidebarModule,
    NbMenuModule,
    NbActionsModule,
    NbEvaIconsModule,
    NbIconModule,
    NbButtonModule,
    NbButtonGroupModule,
    NbCardModule,
    NbInputModule,
    NbDatepickerModule,
    QRCodeModule,
    SharedModule,
  ],
})
export class UniteModule {}
