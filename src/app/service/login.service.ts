import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
//baseurl:string="http://13.50.76.182:8080/"
baseurl:string="http://localhost:8087/"

  constructor(private httpClient: HttpClient) { }
  authenticate(user: { username: string, password: string }): Observable<any> {
    // Replace 'your-api-endpoint' with the actual endpoint for authentication
    return this.httpClient.post<any>(this.baseurl+`auth/login`, user);
  }
 

}
