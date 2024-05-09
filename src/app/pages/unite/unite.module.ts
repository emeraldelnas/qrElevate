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
  NbCheckboxModule,
  NbDatepickerModule,
  NbDialogModule,
  NbIconModule,
  NbInputModule,
  NbLayoutModule,
  NbMenuModule,
  NbRouteTabsetModule,
  NbSidebarModule,
  NbTabsetModule,
} from '@nebular/theme';
import { SharedModule } from 'src/app/shared/shared.module';
import { QRCodeModule } from 'angularx-qrcode';
import { UniteRaffleEntriesComponent } from './unite-raffle-entries/unite-raffle-entries.component';

@NgModule({
  declarations: [
    UniteComponent,
    UniteRegistrantsComponent,
    UniteAttendeesComponent,
    GenerateQrCodeComponent,
    UniteRaffleEntriesComponent,
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
    NbCheckboxModule,
    NbDatepickerModule,
    NbRouteTabsetModule,
    NbDialogModule.forChild(),
    QRCodeModule,
    SharedModule,
  ],
})
export class UniteModule {}
