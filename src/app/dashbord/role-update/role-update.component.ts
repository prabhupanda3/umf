import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModuleSabmoduleActionDTO } from 'src/app/beans/module-sabmodule-action-dto';
import { RoleUpdateService } from 'src/app/service/Dashboard/role-update.service';
import { RoleCreationComponent } from '../role-creation/role-creation.component';
import { UsermanagementService } from 'src/app/service/UserManagement/usermanagement.service';
import { RoleModuleActionBean } from 'src/app/beans/role-module-action-bean';
import { SabModuleAction } from 'src/app/beans/sab-module-action';

@Component({
  selector: 'app-role-update',
  templateUrl: './role-update.component.html',
  styleUrls: ['./role-update.component.css']
})
export class RoleUpdateComponent {
  constructor(private router: Router,private roleUpdateService: RoleUpdateService, private usermangement: UsermanagementService, private route: ActivatedRoute) { }

  roleName!: string;
  roleDes!: string;
  hierarchy!: string;
  hirarchyList!: string[];
  parentrole!: string;
  parentHirarchy!: string[];
  actions!: string;
  moduleSabmoduleAction!:ModuleSabmoduleActionDTO[];
  moduleSabmoduleActionDTO!: ModuleSabmoduleActionDTO;
  subModuleName!: string;
  roleModuleActionBean!: RoleModuleActionBean;
  moduleSabmoduleActionDTOList!: ModuleSabmoduleActionDTO[];
  isOpen=false;
  roleUpdated!:string;
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const authorityName = params.get('authority');
      if (authorityName) {
        console.log("Authority :" + authorityName)
        this.getRole(authorityName);
      }
    });
    this.getHirarchyList();
    this.getParentRoles();
  }
  getRole(autherityName: string) {
    this.roleUpdateService.getRoleModuleSabmoduleActionDatails(autherityName).subscribe(
      response => {
        this.roleName = response.roleName;
        this.roleDes = response.roleDes;
        this.moduleSabmoduleAction = response.moduleSabmoduleActionDTO;

      },
      error => {

      });

  }


  //HirarchyDetails
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

  roleUpdate() {
    // Initialize the list to avoid undefined errors
    this.moduleSabmoduleActionDTOList = [];

    this.roleModuleActionBean = new RoleModuleActionBean();
    this.roleModuleActionBean.roleName = this.roleName;
    this.roleModuleActionBean.authority = this.roleName;
    this.roleModuleActionBean.hierarchy = this.hierarchy;
    this.roleModuleActionBean.roleDes = this.roleDes;
    this.roleModuleActionBean.parentRole=this.parentrole;

    // Get the table
    const roleassignTable = document.getElementById("update") as HTMLElement;
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
      this.roleModuleActionBean.moduleSabmoduleActionDTO = this.moduleSabmoduleActionDTOList;

      // Logging (useful during development)
      console.log("Role Update:", this.roleModuleActionBean.moduleSabmoduleActionDTO);
    }
    this.roleUpdateService.updateRoleAndAction(this.roleModuleActionBean).subscribe(async response => {
      this.roleUpdated = response.body.message;
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

    }, error => {

    });

  }
  delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  popupwindow() {
    this.isOpen = true;
  }
  popupwindowclose() {
    this.isOpen = false;
    this.router.navigate(['/userRoleMaster']);
  }
}
