import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  //baseurl:string="http://13.50.76.182:8080/"
  baseurl:string="http://localhost:8087/"
  constructor(private httpClient: HttpClient) { }
  getAvailableUserHirarchyData(hload:{username: string | null, hierarchyId: number, hirarchyLevel: string, date: string, hierarchyName: string | null  }):Observable<Map<string,Map<number, string>>>{
    return this.httpClient.post<any>(`${this.baseurl}devicesummary/userhirarchy`,hload);
  }
  getDayCommunicationSummary(hload:{username: string | null, hierarchyId: number, hirarchyLevel: string, date: string, hierarchyName: string | null  }){
    return this.httpClient.post<any>(`${this.baseurl}devicesummary/daylivecommunication`,hload);
  }
  getSevenDaysCommunication(hload:{username: string | null, hierarchyId: number, hirarchyLevel: string, date: string, hierarchyName: string | null  }):Observable<Map<string,string[]>>{

  return   this.httpClient.post<any>(`${this.baseurl}devicesummary/lastSevenDaysComm`,hload);
  }
}
