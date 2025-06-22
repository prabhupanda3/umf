import { AfterViewInit, Component, ElementRef, Renderer2 } from '@angular/core';
import { DataShairingService } from 'src/app/service/data-shairing.service';
import { Module } from './module';
import { SubModule } from './sub-module';
import { Router } from '@angular/router';

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
    private el: ElementRef) { }

  ngOnInit() {
    this.dashbord();
  }
  public dashbord(): void {
    this.moduleasString = sessionStorage.getItem("AssignedModules");
    console.log("Module String :" + this.moduleasString);

    try {
      this.moduleList = JSON.parse(this.moduleasString);
      if (Array.isArray(this.moduleList)) {
        let rowContainer = this.renderer.createElement('div');
        this.renderer.setStyle(rowContainer, 'display', 'flex');
        this.renderer.setStyle(rowContainer, 'flex-wrap', 'wrap');
        this.renderer.setStyle(rowContainer, 'gap', '24px'); // Increased gap
        this.renderer.setStyle(rowContainer, 'margin-left', '24px'); // Extra margin from left
        this.renderer.setStyle(rowContainer, 'margin-bottom', '16px');

        this.moduleList.forEach((module, index) => {
          const newDiv = this.renderer.createElement('div');

          // Module name
          const moduleNameSpan = this.renderer.createElement('span');
          this.renderer.setProperty(moduleNameSpan, 'innerHTML', module.moduleName);
          this.renderer.setStyle(moduleNameSpan, 'font-weight', 'bold');
          this.renderer.setStyle(moduleNameSpan, 'color', '#ffffff');
          this.renderer.setStyle(moduleNameSpan, 'padding-left', '80px');
          this.renderer.setStyle(moduleNameSpan, 'font-size', '16px');
          this.renderer.appendChild(newDiv, moduleNameSpan);

          // Submodules
          this.submoduleList = module.subModule;
          this.submoduleList.forEach((subModule) => {
            const subDiv = this.renderer.createElement('div');
            const submoduleNameAnchor = this.renderer.createElement('a');
            this.renderer.setProperty(submoduleNameAnchor, 'innerHTML', subModule.submoduleName);

            if (subModule.url && typeof subModule.url === 'string') {
              const functionName = subModule.url;
              if (typeof this[functionName] === 'function') {
                this.renderer.listen(submoduleNameAnchor, 'click', () => {
                  const dynamicFunction = this[functionName] as () => void;
                  dynamicFunction();
                });
              } else {
                console.error(`Function '${functionName}' does not exist in the component.`);
              }
            }

            // Submodule style
            this.renderer.setStyle(subDiv, 'backgroundColor', '#ffffff');
            this.renderer.setStyle(subDiv, 'margin', '4px 0');
            this.renderer.setStyle(subDiv, 'padding', '6px 8px');
            this.renderer.setStyle(subDiv, 'border-radius', '6px');
            this.renderer.setStyle(subDiv, 'transition', 'background-color 0.3s');

            // Hover effect
            this.renderer.listen(subDiv, 'mouseenter', () => {
              this.renderer.setStyle(subDiv, 'backgroundColor', '#ffffff');
            });
            this.renderer.listen(subDiv, 'mouseleave', () => {
              this.renderer.setStyle(subDiv, 'backgroundColor', '#ffffff');
            });

            this.renderer.setStyle(submoduleNameAnchor, 'color', '#000000');
            this.renderer.setStyle(submoduleNameAnchor, 'text-decoration', 'none');
            this.renderer.setStyle(submoduleNameAnchor, 'font-size', '16px');

            this.renderer.appendChild(subDiv, submoduleNameAnchor);
            this.renderer.appendChild(newDiv, subDiv);
          });

          // Module container styles
          //this.renderer.setStyle(newDiv, 'backgroundColor', '#7f0ceb');
          this.renderer.setStyle(newDiv, 'backgroundImage', 'linear-gradient(to right,#0d3c65, #3b83c0)');

          this.renderer.setStyle(newDiv, 'padding', '12px');
          this.renderer.setStyle(newDiv, 'border-radius', '12px');
          this.renderer.setStyle(newDiv, 'width', '22%'); // Reduced width
          this.renderer.setStyle(newDiv, 'box-shadow', '0 4px 12px rgba(85, 109, 206, 0.1)');
          this.renderer.setStyle(newDiv, 'box-sizing', 'border-box');
          this.renderer.setStyle(newDiv, 'min-height', '150px');

          this.renderer.appendChild(rowContainer, newDiv);

          // Append 4 modules per row
          if ((index + 1) % 4 === 0 || index === this.moduleList.length - 1) {
            this.renderer.appendChild(this.el.nativeElement, rowContainer);
            rowContainer = this.renderer.createElement('div');
            this.renderer.setStyle(rowContainer, 'display', 'flex');
            this.renderer.setStyle(rowContainer, 'flex-wrap', 'wrap');
            this.renderer.setStyle(rowContainer, 'gap', '24px'); // Apply same increased gap again
            this.renderer.setStyle(rowContainer, 'margin-left', '24px'); // Apply left margin again
            this.renderer.setStyle(rowContainer, 'margin-bottom', '16px');
          }
        });
      }
    } catch (error) {
      console.error("No Module Access", error);
    }
  }




  dashboard(): void {
    try {
      window.location.href = '/dashboard';

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
