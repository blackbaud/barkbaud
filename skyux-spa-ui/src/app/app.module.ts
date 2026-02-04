import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  BrowserAnimationsModule
} from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SkyPagesModule } from './sky-pages.module';

@NgModule({ declarations: [],
    bootstrap: [AppComponent], imports: [BrowserAnimationsModule,
        BrowserModule,
        AppRoutingModule,
        SkyPagesModule,
        AppComponent], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }
