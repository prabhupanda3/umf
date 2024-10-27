import { Component } from '@angular/core';
import { error } from 'highcharts';

@Component({
  selector: 'app-user-role-master',
  templateUrl: './user-role-master.component.html',
  styleUrls: ['./user-role-master.component.css']
})
export class UserRoleMasterComponent {
roleaccess:any;
roleId:any;
moduleDetails:any;
sabmoduleAction:any;
sabmodule:any;
submoduleId!:String;
actionID:any;
submoduleName!:String;
add!:String;
active:boolean=false;
ngOnInit(){
  this.isactivateButton();
}

  public isactivateButton():boolean {
    this.roleaccess=sessionStorage.getItem("ROLE");
    try{
 this.moduleDetails=JSON.parse(this.roleaccess);
this.moduleDetails.sabmoduleAction.forEach((sactions:any)=>{
  if(sactions.sabmodule.submoduleName=="UserRoleManagement"){
    console.log("SabmoduleName :"+sactions.sabmodule.submoduleName)
    if(sactions.sabmodule.add == 1){
      console.log("Active :"+sactions.sabmodule.add)
      this.active=true;
      return this.active;
    }else{

      return this.active;
    }
    
  }
  else{
    console.log("Else block")
    return this.active;
  }
});
return this.active;

    }catch(error){
      console.log("Catch block")
      return this.active;
    }
  }

getModuleSubmodule(){

}



}
