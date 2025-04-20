import { Component, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { error } from 'jquery';
import { Action } from 'src/app/beans/action';
import { ModuleSabmoduleActionDTO } from 'src/app/beans/module-sabmodule-action-dto';
import { RoleModuleActionBean } from 'src/app/beans/role-module-action-bean';
import { SabModuleAction } from 'src/app/beans/sab-module-action';
import { UsermanagementService } from 'src/app/service/UserManagement/usermanagement.service';

@Component({
  selector: 'app-role-creation',
  templateUrl: './role-creation.component.html',
  styleUrls: ['./role-creation.component.css']
})
export class RoleCreationComponent {
  roleName!: string;
  authority!: string;
  roleDes!: string;
  userrole!: string;
  userroleDescription!: string;
  parentHirarchy!: string[];
  parentrole!: string;
  hierarchy!: string;
  hierarchyList!: string;
  userPermissions: any[] = [];
  actions: Action[] = [];
  moduleSabmoduleActionDTO!: ModuleSabmoduleActionDTO;
  moduleSabmoduleActionDTOList!: ModuleSabmoduleActionDTO[];
  sabModuleActions !: SabModuleAction;
  isOpen = false;
  roleCreated!: string;
  ngOnInit() {
    this.accessControl();
    this.getHirarchyList();
    this.getParentRoles();
  }
  constructor(private usermangement: UsermanagementService, private renderer: Renderer2, private dialog: MatDialog, private router: Router) { }
  //accessConrotl
  accessControl() {
    this.usermangement.getUserModuleSabmodule().subscribe(
      response => {
        this.actions = response;
      },
      error => {

      });
  }
  allRoles() {
    this.usermangement.getAllRoleName().subscribe(
      response => {
        this.parentHirarchy = response;
      },
      error => {

      });
  }
  addrole() {
    // Initialize the list to avoid undefined errors
    this.moduleSabmoduleActionDTOList = [];

    // Prepare the main role object
    const roleModuleActionBean = new RoleModuleActionBean();
    roleModuleActionBean.roleName = this.roleName;
    roleModuleActionBean.authority = this.roleName;
    roleModuleActionBean.hierarchy = this.hierarchy;
    roleModuleActionBean.parentRole = this.parentrole;
    roleModuleActionBean.roleDes = this.roleDes;

    // Get the table
    const roleassignTable = document.getElementById("userRoleAssignment") as HTMLElement;
    if (roleassignTable) {
      const roleassignTableRows = roleassignTable.getElementsByTagName("tr");

      for (let row = 1; row < roleassignTableRows.length; row++) {
        const cells = roleassignTableRows[row].getElementsByTagName("td");

        if (cells.length >= 6) {
          const moduleSabmoduleActionDTO = new ModuleSabmoduleActionDTO();
          const sabModuleAction = new SabModuleAction();

          moduleSabmoduleActionDTO.moduleName = cells[0].innerText.trim();
          moduleSabmoduleActionDTO.sabmoduleName = cells[1].innerText.trim();

          const addCheckbox = cells[2].querySelector("input") as HTMLInputElement;
          const editCheckbox = cells[3].querySelector("input") as HTMLInputElement;
          const deleteCheckbox = cells[4].querySelector("input") as HTMLInputElement;
          const viewCheckbox = cells[5].querySelector("input") as HTMLInputElement;

          sabModuleAction.add = addCheckbox?.checked ? "1" : "0";
          sabModuleAction.edit = editCheckbox?.checked ? "1" : "0";
          sabModuleAction.delete = deleteCheckbox?.checked ? "1" : "0";
          sabModuleAction.view = viewCheckbox?.checked ? "1" : "0";

          moduleSabmoduleActionDTO.sabModuleAction = sabModuleAction;

          this.moduleSabmoduleActionDTOList.push(moduleSabmoduleActionDTO);
        }
      }

      // Assign the collected list to the bean
      roleModuleActionBean.moduleSabmoduleActionDTO = this.moduleSabmoduleActionDTOList;

      // Logging (useful during development)
      console.log("Role creation :", roleModuleActionBean);
    }

    // Make the backend call
    this.usermangement.addRoleAndAction(roleModuleActionBean).subscribe(
      async response => {
        console.log("Role created successfully ====>", response);
        this.roleCreated = response.body.message;
        this.popupwindow();
        if (this.isOpen == true) {
          for (let l = 1; l <= 3; l++) {
            // Wait for 2 seconds (2000 milliseconds)
            await this.delay(2000);
            if (l == 3) {
              this.popupwindowclose();
            }
          }
        }
      },
      error => {

      }
    );
  }
  //Delay Function

  delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  //HirarchyDetails
  hirarchyList!: String[];
  getHirarchyList() {
    this.usermangement.getHierachyListService().subscribe(
      response => {
        console.log("Hierarchy List :" + response)
        this.hirarchyList = response;
      },
      error => {

      }
    );
  }

  //Parent Role
  getParentRoles() {
    this.usermangement.getAllParentRole().subscribe(
      response => {
        console.log("Parent role :" + response);
        this.parentHirarchy = response;

      }, error => {

      }
    );
  }
  popupwindow() {
    this.isOpen = true;
  }
  popupwindowclose() {
    this.isOpen = false;
    this.router.navigate(['/userRoleMaster']);
  }


}
