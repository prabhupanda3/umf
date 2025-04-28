import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { error } from 'jquery';
import { User } from 'src/app/beans/User/user';
import { UsermanagementService } from 'src/app/service/UserManagement/usermanagement.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent {

  constructor(private router: Router, private usermanagementService: UsermanagementService) { }
  roleList!: string[];
  role!: string;
  userId!: string;
  userName!: string;
  password!: string;
  confirmPassword!: string;
  email!: string;
  mobile!: string;
  address!: string;


  ngOnInit() {
    this.getAllChildRole()
  }

  userMaster() {
    this.router.navigate(['/userMaster']);
  }
  userRoleMaster() {
    this.router.navigate(['/userRoleMaster']);

  }
  
  getAllChildRole() {
    this.usermanagementService.getAutheriry().subscribe(response => {
      this.roleList = response;
    }, error => {

    });
  }
  userRegistration() {
    console.log("Second if block"+this.password+"UserName :"+ this.userName+" user.username  :"+this.userName)

    const user = new User();
    user.userIdName = this.userName;
    user.username = this.userId;
    user.password = this.password;
    user.confirmPassword = this.confirmPassword;
    user.email = this.email;
    user.mobileNumber = this.mobile;
    user.address = this.address;
    user.autherity = this.role;
    try {
      
        if (user.confirmPassword == user.password) {
          console.log("Second if block"+user.password+"UserName :"+ user.userIdName+" user.username  :"+user.username)

          this.usermanagementService.addUser(user).subscribe(response => {

          }, error => {

          });
        }
        else {
          throw new Error("Password Mismatch");
        }
      
    } catch (error) {
      alert(error)
    }

  }


}
