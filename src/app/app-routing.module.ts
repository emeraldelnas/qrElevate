import { RecordsComponent } from './pages/records/records.component';
import { RegisterComponent } from './pages/register/register.component';
import { ScannerComponent } from './pages/scanner/scanner.component';
import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrantsComponent } from './pages/registrants/registrants.component';

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
    path: 'registrants',
    component: RegistrantsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
