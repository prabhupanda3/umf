import { Component } from '@angular/core';
import { error } from 'highcharts';

@Component({
  selector: 'app-user-role-master',
  templateUrl: './user-role-master.component.html',
  styleUrls: ['./user-role-master.component.css']
})
export class UserRoleMasterComponent {
  roleaccess: any;
  roleId: any;
  moduleDetails: any;
  sabmoduleAction: any;
  sabmodule: any;
  submoduleId!: String;
  actionID: any;
  submoduleName!: String;
  add!: String;
  active: boolean = false;
  ngOnInit() {
    this.isactivateButton();
  }

  public isactivateButton(): boolean {
    this.roleaccess = sessionStorage.getItem("ROLE");
    try {
      this.moduleDetails = JSON.parse(this.roleaccess);
      for (const smactions of this.moduleDetails.sabmoduleAction) {
        if (smactions.sabmodule.submoduleName == "UserRoleManagement") {
          console.log("SabmoduleName :" + smactions.sabmodule.submoduleName)
          if (smactions.sabmodule.add == 1) {
            console.log("Active :" + smactions.sabmodule.add)
            this.active = true;

          } else {
            this.active;
          }

        }
        else {
          console.log("Else block")
          return this.active;
        }
      };
      return this.active;

    } catch (error) {
      console.log("Catch block")
      return this.active;
    }
  }

  getModuleSubmodule() {

  }



}
