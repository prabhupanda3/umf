import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataShairingService } from '../data-shairing.service';
import { RoleModuleActionBean } from 'src/app/beans/role-module-action-bean';

@Injectable({
  providedIn: 'root'
})
export class RoleUpdateService {

  constructor(private http:HttpClient,private dataShairingService: DataShairingService) { }
  getRoleModuleSabmoduleActionDatails(autherityName:string):Observable<any>{
    return this.http.get(`${this.dataShairingService.baseUrl}userRole/roleModuleSubmoduleActiondetails/${autherityName}`);
  }
  updateRoleAndAction(role_submodule_action_update: RoleModuleActionBean): Observable<HttpResponse<any>> {
      return this.http.put<any>(`${this.dataShairingService.baseUrl}userRole/updateUserRole`,role_submodule_action_update,{ observe: 'response'});
    }
}
