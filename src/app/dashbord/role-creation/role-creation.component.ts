import { Component, Renderer2 } from '@angular/core';
import { Action } from 'src/app/beans/action';
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
  actions:Action[]=[];
  ngOnInit(){
    this.accessControl();
  }
  constructor(private usermangement: UsermanagementService,private renderer: Renderer2){}
  //accessConrotl
  accessControl(){
    this.usermangement.getUserModuleSabmodule().subscribe(
      response => {
      this.actions= response;
      },
      error=>{
    
    });
      }
      allRoles(){
        this.usermangement.getAllRoleName().subscribe(
          response=>{
            this.parentHirarchy=response;
          },
          error=>{
            
          });
      }
}
