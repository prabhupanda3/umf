import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataShairingService } from '../data-shairing.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { RoleModuleActionBean } from 'src/app/beans/role-module-action-bean';
import { User } from 'src/app/beans/User/user';

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
  addRoleAndAction(role_submodule_action: RoleModuleActionBean): Observable<HttpResponse<any>> {
    return this.http.post<any>(`${this.dataShairingService.baseUrl}userRole/roleCreation`,role_submodule_action,{ observe: 'response'});
  }
  getHierachyListService():Observable<any>{
      return this.http.get<any>(`${this.dataShairingService.baseUrl}userRole/hierarchyList`);
  }
  getAllParentRole():Observable<any>{
    return this.http.get<any>(`${this.dataShairingService.baseUrl}userRole/getallparentrole`);

  }

  deleteRoleByAuthorityName(autherityName:String):Observable<any>{
    return this.http.delete<any>(`${this.dataShairingService.baseUrl}userRole/roleDelete/${autherityName}`);

  }
  //Function to Create Ueser
  getAutheriry():Observable<string[]>{
    return this.http.get<string[]>(`${this.dataShairingService.baseUrl}usermanagement/getallautherity`);
  }
  addUser(user:User):Observable<string> {
    return this.http.post<string>(`${this.dataShairingService.baseUrl}usermanagement/createNewUser`,user);
  }
  getUserList():Observable<User[]>{
    return this.http.get<User[]>(`${this.dataShairingService.baseUrl}usermanagement/getAllChildUser`);
  }
}
