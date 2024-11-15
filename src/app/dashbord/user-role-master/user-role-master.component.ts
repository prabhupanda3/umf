import { Component } from '@angular/core';
import { error } from 'highcharts';
import { UsermanagementService } from 'src/app/service/UserManagement/usermanagement.service';

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
  add!: String;
  edit!:String;
  delete!:String;
  view!:String;
  active!: boolean;
  module=[];
  moduleName!:String;
  sabModuleAction:any;
  moduleID!:number;
  

  ngOnInit() {
    this.isactivateButton();
  }
constructor(private usermangement:UsermanagementService){

}
  

  public isactivateButton(): boolean {
    this.roleaccess = sessionStorage.getItem("ROLE");

    try {
      this.moduleDetails = JSON.parse(this.roleaccess);
      this.active = false; // Initialize active to false
      for (const smactions of this.moduleDetails.sabmoduleAction) {

        if (smactions.sabmodule.submoduleName === "UserRoleManagement" ) {
          if(smactions.add == "1"){
            console.log("Add"+smactions.sabmodule.add )
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

  getModuleSubmodule() {
this.usermangement.getUserModuleSabmodule().subscribe(
  response=>{
    response.forEach((res: { moduleName: string;   subModuleName: String;sabModuleAction:any;
    }) => {
      console.log("Hi this is response :"+res.sabModuleAction.actionID);

    });

  },
  error=>{

  }
);
  }



}
