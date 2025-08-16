import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SideNavBarService {

  constructor() { }
  // Use BehaviorSubject to hold the modules
  private _moduleList$ = new BehaviorSubject<any[]>([]);

  // Call this from Navbar to set/update modules
  setModuleList(modules: any[]) {
    this._moduleList$.next(modules);
  }

  // SideNav will subscribe to this to get updates
  getModuleList$() {
    return this._moduleList$.asObservable();
  }
}
