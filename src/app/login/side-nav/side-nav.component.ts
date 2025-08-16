import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SideNavBarService } from 'src/app/service/Dashboard/side-nav-bar.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent {
moduleList: any[] = [];

  constructor(
    private sideNavBar: SideNavBarService,
    private router: Router
  ) {}

  ngOnInit() {
     // Subscribe to updates from Navbar
    this.sideNavBar.getModuleList$().subscribe(modules => {
      this.moduleList = modules;
    });
    console.log("Modules :"+this.moduleList)
  }

  navigateTo(url: string) {
    this.router.navigateByUrl(url);
  }
}
