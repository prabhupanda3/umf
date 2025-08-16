import { AfterViewInit, Component, ElementRef, Renderer2 } from '@angular/core';
import { DataShairingService } from 'src/app/service/data-shairing.service';
import { Module } from './module';
import { SubModule } from './sub-module';
import { Router } from '@angular/router';
import { SideNavBarService } from 'src/app/service/Dashboard/side-nav-bar.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  data!: any;
  moduleList!: any;
  moduleasString!: any;
  submoduleList!: SubModule[];
  constructor(private dataShairingService: DataShairingService,
    private router: Router,
    private module: Module,
    private subModule: SubModule,
    private renderer: Renderer2,
    private el: ElementRef,private sideNavBarService:SideNavBarService) { }
  moduleString: any[] = [];
  ngOnInit() {
    this.dashbord();
  }

  dashbord() {
    const moduleString = sessionStorage.getItem("AssignedModules");
    if (moduleString) {
      try {
        const parsed = JSON.parse(moduleString);
        if (Array.isArray(parsed)) {
          this.moduleList = parsed;
          this.sideNavBarService.setModuleList(this.moduleList);
        }
      } catch (err) {
        console.error("Error parsing AssignedModules", err);
      }
    }
  }

navigateTo(url: string): void {
    if (url) {
      this.router.navigate([url]);
    }
  }

  dashboard(): void {
    try {
      // window.location.href = '/dashboard';
      this.router.navigate(['/dashboard']).then(success => {
        console.log('Navigation to dashboard:', success, 'Current URL:', this.router.url);
      });
    }
    catch (error) {
      console.error('Error log', error);
    }
  }
  userRole(): void {
    try {
      window.location.href = '/userRoleMaster';

    }
    catch (error) {
      console.error('Error log', error);
    }
  }

  userMaster(): void {
    try {
      window.location.href = '/userMaster';

    }
    catch (error) {
      console.error('Error log', error);
    }
  }



}
