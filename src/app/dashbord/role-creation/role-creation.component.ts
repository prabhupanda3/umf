import { Component, Renderer2 } from '@angular/core';
import { UsermanagementService } from 'src/app/service/UserManagement/usermanagement.service';

@Component({
  selector: 'app-role-creation',
  templateUrl: './role-creation.component.html',
  styleUrls: ['./role-creation.component.css']
})
export class RoleCreationComponent {
  userrole!:string ;
  userroleDescription!:string;
  parentHirarchy!:string[];
  parentrole!:string;
  hierarchy!:string;
  hierarchyList!:string;
  userPermissions: any[] = [];
  ngOnInit(){
    this.accessControl();
  }
  constructor(private usermangement: UsermanagementService,private renderer: Renderer2){}
  //accessConrotl
  accessControl(){
    this.usermangement.getUserModuleSabmodule().subscribe(
      response => {
        this.userPermissions = response.map((res: { 
          moduleName: string; 
          subModuleName: string; 
          sabModuleAction:any;
          actionID: number; 
          add: string; 
          edit: string; 
          delete: string; 
          view: string 
        }) => ({
          moduleName: res.moduleName,
          subModuleName: res.subModuleName,
          actionID: res.actionID,
          add: res.sabModuleAction.add,   // Convert to boolean if needed
          edit: res.sabModuleAction.edit,
          delete: res.sabModuleAction.delete,
          view: res.sabModuleAction.view 
        }));
        this.userPermissions.forEach(ress=>{
          console.log(ress.moduleName+"Permission "+ress.sabModuleAction.add);
        });
      },
      error=>{
    
    });
      }
}
