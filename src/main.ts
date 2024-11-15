import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

import { initializeApp } from "firebase/app";
import { importProvidersFrom } from "@angular/core";
import { IonicModule } from "@ionic/angular";

const firebaseConfig = {
  apiKey: "AIzaSyCxdKn0omeczTca37dRGzEiKGcB-3UXXKc",
  authDomain: "car-rental-agency-exam.firebaseapp.com",
  projectId: "car-rental-agency-exam",
  databaseURL: "https://car-rental-agency-exam-default-rtdb.europe-west1.firebasedatabase.app/",
  storageBucket: "car-rental-agency-exam.firebasestorage.app",
  messagingSenderId: "719803502125",
  appId: "1:719803502125:web:535b8e04a57c7525df72a4"
};

initializeApp(firebaseConfig);

bootstrapApplication(AppComponent, {
  providers: [
    {
      provide: RouteReuseStrategy, useClass: IonicRouteStrategy
    },
    importProvidersFrom(IonicModule.forRoot({innerHTMLTemplatesEnabled: true})),
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
}).then(r => console.log('Application has been bootstrapped!' + r));
