import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IonicStorageModule } from '@ionic/storage-angular';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';

const config = environment.firebase;
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(
      {mode: 'ios'}
    ),
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(config),
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
