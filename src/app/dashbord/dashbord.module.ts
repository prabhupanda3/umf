import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { DashbordComponent } from './dashbord/dashbord.component';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HighchartsChartModule } from 'highcharts-angular';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { UserManagementComponent } from './user-management/user-management.component';
import { UserMasterComponent } from './user-master/user-master.component';
import { UserRoleMasterComponent } from './user-role-master/user-role-master.component';
import { RoleCreationComponent } from './role-creation/role-creation.component';
import { RoleUpdateComponent } from './role-update/role-update.component';
import { RouterModule } from '@angular/router';




@NgModule({
    declarations: [
        NavbarComponent,
        DashbordComponent,
        UserManagementComponent,
        UserMasterComponent,
        UserRoleMasterComponent,
        RoleCreationComponent,
        RoleUpdateComponent,
        
    ],
    exports: [
        NavbarComponent,
        DashbordComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatFormFieldModule,
        MatInputModule,MatButtonModule,
        HighchartsChartModule,
        CanvasJSAngularChartsModule ,MatFormFieldModule,MatOptionModule,
        RouterModule
    ]
})
export class DashbordModule { 
  
}
