import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent {
  constructor(private router: Router) {}
 
 
 
 
  userMaster(){
    this.router.navigate(['/userMaster']);
  }
  userRoleMaster(){
    this.router.navigate(['/userRoleMaster']);

  }
}
