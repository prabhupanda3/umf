import { Component } from '@angular/core';
import { User } from 'src/app/beans/User/user';
import { UsermanagementService } from 'src/app/service/UserManagement/usermanagement.service';

@Component({
  selector: 'app-user-master',
  templateUrl: './user-master.component.html',
  styleUrls: ['./user-master.component.css']
})
export class UserMasterComponent {
  roleaccess!:any;
  moduleDetails!:any;
  active=false;
  userList!:User[];

  constructor(private usermanagementService:UsermanagementService){

  }
  ngOnInit(){
  this.availableUserList();
}
  public isactivateButton(): boolean {
    this.roleaccess = sessionStorage.getItem("ROLE");
    try {
      this.moduleDetails = JSON.parse(this.roleaccess);
      this.active = false; // Initialize active to false
      for (const smactions of this.moduleDetails.sabmoduleAction) {

        if (smactions.sabmodule.submoduleName === "UserMaster") {
          if (smactions.add == "1") {
            console.log("Add" + smactions.sabmodule.add)
            this.active = true;
            break;
          }
        }
      }
      return this.active;
    } catch (error) {
      console.log("Error parsing role access:", error);
      return false; // Default return false on error
    }
  }
  public availableUserList(){
    this.usermanagementService.getUserList().subscribe(
      response=>{
        this.userList=response;
        console.log("Executed")
      },error=>{

    });
  }


}
