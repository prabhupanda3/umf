import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { DashbordComponent } from './dashbord/dashbord.component';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HighchartsChartModule } from 'highcharts-angular';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { UserManagementComponent } from './user-management/user-management.component';
import { UserMasterComponent } from './user-master/user-master.component';
import { UserRoleMasterComponent } from './user-role-master/user-role-master.component';



@NgModule({
    declarations: [
        NavbarComponent,
        DashbordComponent,
        UserManagementComponent,
        UserMasterComponent,
        UserRoleMasterComponent,
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
        CanvasJSAngularChartsModule 
       
    ]
})
export class DashbordModule { 
  
}
