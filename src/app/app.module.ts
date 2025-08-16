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
import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { SideNavComponent } from './login/side-nav/side-nav.component';

@NgModule({
    declarations: [
        AppComponent,
        ChatComponent,
        
    ],
    bootstrap: [AppComponent],
    imports: [
      BrowserModule,
      LoginModule,
     
      FormsModule,
      HttpClientModule,
      AppRoutingModule,
      BrowserAnimationsModule,
      MatDialogModule
      
      
       
       
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
