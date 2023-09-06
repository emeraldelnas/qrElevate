import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttendeeScannerComponent } from './attendee-scanner/attendee-scanner.component';
import { FreebieScannerComponent } from './freebie-scanner/freebie-scanner.component';
import { UniteScannerComponent } from './unite-scanner.component';

const routes: Routes = [
  {
    path: '',
    component: UniteScannerComponent,
    children: [
      { path: '', redirectTo: 'attendee', pathMatch: 'full' },
      {
        path: 'attendee',
        component: AttendeeScannerComponent,
      },
      {
        path: 'freebie',
        component: FreebieScannerComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UniteScannerRoutingModule {}
