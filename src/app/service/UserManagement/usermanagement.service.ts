import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataShairingService } from '../data-shairing.service';
import { HttpClient } from '@angular/common/http';
import { RoleModuleActionBean } from 'src/app/beans/role-module-action-bean';

@Injectable({
  providedIn: 'root'
})
export class UsermanagementService {

  constructor(private dataShairingService: DataShairingService, private http: HttpClient) { }
  getUserModuleSabmodule(): Observable<any> {
    return this.http.get(`${this.dataShairingService.baseUrl}userRole/moduleSabmodule`);
  }

  getAllChildRoleDetails(): Observable<any> {
    return this.http.get(`${this.dataShairingService.baseUrl}userRole/childRoleforUser`);
  }
  getAllRoleName(): Observable<any> {
    return this.http.get<any>(`${this.dataShairingService.baseUrl}userRole/listOfChildRole`);
  }
  addRoleAndAction(role_submodule_action: RoleModuleActionBean): Observable<any> {
    return this.http.post<any>(`${this.dataShairingService.baseUrl}userRole/roleCreation`,role_submodule_action);
  }
  getHierachyListService():Observable<any>{
      return this.http.get<any>(`${this.dataShairingService.baseUrl}userRole/hierarchyList`);
  }
}
