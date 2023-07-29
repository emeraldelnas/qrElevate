import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UniteRegistrantsComponent } from './unite-registrants/unite-registrants.component';

const routes: Routes = [
  { path: '', redirectTo: 'registrants', pathMatch: 'full' },
  {
    path: 'registrants',
    component: UniteRegistrantsComponent,
  },
  {
    path: 'attendees',
    component: UniteRegistrantsComponent,
  },
  {
    path: 'generate-qr',
    component: UniteRegistrantsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UniteRoutingModule {}
