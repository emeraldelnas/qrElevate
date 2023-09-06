import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UniteRegistrantsComponent } from './unite-registrants/unite-registrants.component';
import { UniteAttendeesComponent } from './unite-attendees/unite-attendees.component';
import { GenerateQrCodeComponent } from './generate-qr-code/generate-qr-code.component';
import { UniteComponent } from './unite.component';

const routes: Routes = [
  {
    path: '',
    component: UniteComponent,
    children: [
      { path: '', redirectTo: 'registrants', pathMatch: 'full' },
      {
        path: 'registrants',
        component: UniteRegistrantsComponent,
      },
      {
        path: 'attendees',
        component: UniteAttendeesComponent,
      },
      {
        path: 'generate-qr',
        component: GenerateQrCodeComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UniteRoutingModule {}
