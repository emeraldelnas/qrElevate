import { RecordsComponent } from './pages/records/records.component';
import { RegisterComponent } from './pages/register/register.component';
import { ScannerComponent } from './pages/scanner/scanner.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllRegistrantsComponent } from './pages/all-registrants/all-registrants.component';
import { MenRegistrantsComponent } from './pages/men-registrants/men-registrants.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'scanner' },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'scanner',
    component: ScannerComponent,
  },
  {
    path: 'records',
    component: RecordsComponent,
  },
  {
    path: 'all-registrants',
    component: AllRegistrantsComponent,
  },
  {
    path: 'men-registrants',
    component: MenRegistrantsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
