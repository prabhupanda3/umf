import { Injectable } from '@angular/core';
import { Module } from '../dashbord/navbar/module';

@Injectable({
  providedIn: 'root'
})
export class DataShairingService {
  username: any;

  constructor(private module:Module) { }
 

setModule(module:any):any{
  this.module=module;
}

getModule():any{
  return this.module;
}

}
