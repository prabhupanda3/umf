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
  moduleList!: Module[];
  submoduleList!: SubModule[];
  constructor(private dataShairingService: DataShairingService,
    private router:Router,
     private module: Module,
      private subModule: SubModule,
       private renderer: Renderer2,
        private el: ElementRef) { }

  ngOnInit() {
    this.dashbord();
  }
  
  public dashbord(): void {
    this.moduleList = this.dataShairingService.getModule();
    this.moduleList.forEach((module) => {
      const newDiv = this.renderer.createElement('div')
      const moduleNameSpan = this.renderer.createElement('span');
      this.renderer.setProperty(moduleNameSpan, 'innerHTML', module.moduleName);
      this.renderer.setStyle(moduleNameSpan, 'font-weight', 'bold');
      this.renderer.setStyle(moduleNameSpan, 'color', '#ffffff');
      this.renderer.setStyle(moduleNameSpan, 'padding-left', '5%');
      this.renderer.appendChild(newDiv, moduleNameSpan);
      this.submoduleList = module.subModule;
      this.submoduleList.forEach((subModule) => {
        const subDiv = this.renderer.createElement('div');
        //this.renderer.setProperty(subDiv, 'innerHTML', subModule.submoduleName);
        const submoduleNameAnchor = this.renderer.createElement('a');
        this.renderer.setProperty(submoduleNameAnchor, 'innerHTML', subModule.submoduleName);
        if (subModule.url && typeof subModule.url === 'string') {
          const functionName = subModule.url;
          if (typeof this[functionName] === 'function') {
            this.renderer.listen(submoduleNameAnchor, 'click', () => {
              const dynamicFunction = this[functionName] as () => void; // Type assertion
              if (typeof dynamicFunction === 'function') {
                dynamicFunction(); // Call the function dynamically
              } else {
                console.error(`Function '${functionName}' does not exist in the component.`);
              }
            });
          } else {
            console.error(`Function '${functionName}' does not exist in the component.`);
          }

        }
        this.renderer.setStyle(subDiv, 'backgroundColor', '#075E54');
        this.renderer.setStyle(subDiv, 'margin', '5px');
        this.renderer.setStyle(subDiv, 'color', '#ffffff');
        this.renderer.setStyle(subDiv, 'padding', '5%');
        // Set the URL for the anchor
        // Applying styles to the anchor element
        this.renderer.setStyle(submoduleNameAnchor, 'font-weight', 'bold');
        this.renderer.setStyle(submoduleNameAnchor, 'color', '#ffffff');
        this.renderer.setStyle(submoduleNameAnchor, 'padding-left', '5%');
        this.renderer.appendChild(subDiv, submoduleNameAnchor);
        this.renderer.appendChild(newDiv, subDiv);
      });
      this.renderer.setStyle(newDiv, 'borderradious', '5%');
      this.renderer.setStyle(newDiv, 'backgroundColor', '#7a2bc4');
      this.renderer.setStyle(newDiv, 'padding', '2%');
      this.renderer.setStyle(newDiv, 'height', '25%');
      this.renderer.setStyle(newDiv, 'width', '15%');
      this.renderer.setStyle(newDiv, 'margin-top', '-1%');
      this.renderer.setStyle(newDiv, 'margin-left', '3%');
      this.renderer.appendChild(this.el.nativeElement, newDiv);
    });
  }
  
  handelclick(): void {
    try{
      window.location.href = '/dashboard';
      
  }
  catch(error){
    console.error('Error log',error);
      }
}
usermanagement():void{
  try{
    window.location.href = '/usermanagement';
    
}
catch(error){
  console.error('Error log',error);
    }
}
}
