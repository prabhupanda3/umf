import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoginModule } from './login/login.module';
import { TokenSericeService } from './service/token-serice.service';
import { DashbordModule } from './dashbord/dashbord.module';
import { Module } from './dashbord/navbar/module';
import { SubModule } from './dashbord/navbar/sub-module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChatComponent } from './chat/chat.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { ExportComponent } from './Export/export/export.component';

@NgModule({
    declarations: [
        AppComponent,
        ChatComponent,
        ExportComponent,  
    ],
    bootstrap: [AppComponent],
    imports: [
      BrowserModule,
     
      LoginModule,
      DashbordModule,
      FormsModule,
      HttpClientModule,
      AppRoutingModule,
      BrowserAnimationsModule,
      
       
       
    ],
    providers: [
      Module,
      SubModule,
     
      {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenSericeService,
          multi: true
        }
      ]
})
export class AppModule { }
