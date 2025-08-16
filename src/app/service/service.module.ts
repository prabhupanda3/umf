import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginService } from './login.service';
import { HttpClientModule } from '@angular/common/http';
import { SideNavBarComponent } from './Dashboards/side-nav-bar/side-nav-bar.component';



@NgModule({
  declarations: [
    SideNavBarComponent
  ],
  imports: [
    CommonModule,HttpClientModule,
    
  ],
  exports:[]

})
export class ServiceModule { }
