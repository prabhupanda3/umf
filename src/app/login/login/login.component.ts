import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataShairingService } from 'src/app/service/data-shairing.service';
import { LoginService } from 'src/app/service/login.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent {
  params: any;

  constructor(private loginService: LoginService, private rout: Router, private dataShairingService: DataShairingService) { }
  username!: string;
  password!: string;
  token!: string;
  module!: any;
  onSubmit() {

    // Form is valid, proceed with login logic
    const user = {
      username: this.username,
      password: this.password
    }
    this.loginService.authenticate(user).subscribe(
      response => {
        this.token = response.token;
        if (this.token != null) {
          sessionStorage.setItem('token', this.token);
          sessionStorage.setItem('username',response.user.username);
          sessionStorage.setItem('hid',"0");
          sessionStorage.setItem('levelId',"1");
          sessionStorage.setItem("AssignedModules",JSON.stringify(response.module));
          this.rout.navigate(['/navbar']);

          //this.dataShairingService.setModule();
          console.log('TOKEN RECIVED  :' + this.token);
        }

      },
      error => {
        // Handle authentication error
        console.error("Authentication failed:", error);
      }
    );




  }
}
