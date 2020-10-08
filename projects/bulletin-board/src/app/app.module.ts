import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
// import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import {
  AngularFirestoreModule,
  SETTINGS as FIRESTORE_SETTINGS,
} from '@angular/fire/firestore';
import { ORIGIN as FUNCTIONS_ORIGIN } from '@angular/fire/functions';

import { LayoutModule } from './layout';
import { environment } from '../environments/environment';
import { CoreModule } from './core';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { ecologyState, ngxsConfig } from './store';
import { NgxsModule } from '@ngxs/store';
import { SharedModule } from '@src/app/shared';
import { AngularFireFunctionsModule } from '@angular/fire/functions';
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    CoreModule.forRoot(),
    NgxsModule.forRoot(ecologyState, ngxsConfig),
    AngularFireModule.initializeApp(environment.firebase),
    // AngularFireAnalyticsModule,
    AngularFirestoreModule,
    // AngularFirestoreModule.enablePersistence({ synchronizeTabs: true }),
    AngularFireAuthModule,
    AngularFireFunctionsModule,
    LayoutModule,
    SharedModule,
  ],
  providers: [
    MessageService,
    ConfirmationService,
    {
      provide: FIRESTORE_SETTINGS,
      useFactory: () => environment.firestore,
    },
    { provide: FUNCTIONS_ORIGIN, useFactory: () => environment.functions },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
