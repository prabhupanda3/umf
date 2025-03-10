import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavbarComponent } from './dashbord/navbar/navbar.component';
import { LoginComponent } from './login/login/login.component';
import { DashbordComponent } from './dashbord/dashbord/dashbord.component';
import { ChatComponent } from './chat/chat.component';
import { UserManagementComponent } from './dashbord/user-management/user-management.component';
import { UserMasterComponent } from './dashbord/user-master/user-master.component';
import { UserRoleMasterComponent } from './dashbord/user-role-master/user-role-master.component';
import { RoleCreationComponent } from './dashbord/role-creation/role-creation.component';


const routes: Routes = [
  {path:'',component:LoginComponent},
  { path: 'navbar', component: NavbarComponent },
  {path:'dashboard',component:DashbordComponent},
  {path:'chat',component:ChatComponent},
 {path:'usermanagement',component:UserManagementComponent},
 {path:'userMaster',component:UserMasterComponent},
 {path:'userRoleMaster',component:UserRoleMasterComponent},
 {path:'roleCreation',component:RoleCreationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
