import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SideNavComponent } from './side-nav/side-nav.component';



@NgModule({
  declarations: [
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    SideNavComponent
  ],
  imports: [
    CommonModule,
    FormsModule
    
  ],
  exports:[LoginComponent,HeaderComponent,FooterComponent,SideNavComponent]

})
export class LoginModule { }
