import { Component } from '@angular/core';
import { error } from 'highcharts';

@Component({
  selector: 'app-user-role-master',
  templateUrl: './user-role-master.component.html',
  styleUrls: ['./user-role-master.component.css']
})
export class UserRoleMasterComponent {

  public userRoleMaster():void{
    try{
sessionStorage.getItem("AssignedModules");
    }catch(error){
      
    }
  }
}
