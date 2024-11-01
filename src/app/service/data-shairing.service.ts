import { Injectable } from '@angular/core';
import { Module } from '../dashbord/navbar/module';

@Injectable({
  providedIn: 'root'
})
export class DataShairingService {
  username: any;

  constructor(private module:Module) { }
 baseUrl:String="http://localhost:8087/";
 //baseUrl:String="http://13.50.76.182";

setModule(module:any):any{
  this.module=module;
}

getModule():any{
  return this.module;
}

}
