import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  NbThemeModule,
  NbLayoutModule,
  NbButtonModule,
  NbCardModule,
  NbDatepickerModule,
  NbDialogModule,
  NbIconModule,
  NbInputModule,
  NbListModule,
  NbRadioModule,
  NbSpinnerModule,
  NbToastrModule,
  NbUserModule,
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { RegisterComponent } from './pages/register/register.component';
import { AngularSignaturePadModule } from '@almothafar/angular-signature-pad';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { QRCodeModule } from 'angularx-qrcode';
import { ScannerComponent } from './pages/scanner/scanner.component';
import { AttendeeDialogComponent } from './pages/scanner/attendee-dialog/attendee-dialog.component';
import { RecordsComponent } from './pages/records/records.component';

@NgModule({
  declarations: [AppComponent, RegisterComponent, ScannerComponent, AttendeeDialogComponent, RecordsComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NbThemeModule.forRoot({ name: 'default' }),
    NbLayoutModule,
    NbEvaIconsModule,
    NbIconModule,
    NbCardModule,
    NbUserModule,
    NbInputModule,
    NbToastrModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot({ hasBackdrop: true, closeOnBackdropClick: false }),
    NbRadioModule,
    NbButtonModule,
    NbListModule,
    NbSpinnerModule,
    ZXingScannerModule,
    AngularSignaturePadModule,
    QRCodeModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    AngularFirestoreModule.enablePersistence(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
