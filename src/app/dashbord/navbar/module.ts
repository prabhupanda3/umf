import { SubModule } from "./sub-module";

export class Module {
    moduleId!: number;
    moduleName!:string;
    moduleDescription!:string;
    activeFlag!:boolean;
    displayOrder!:String;
    subModule!:SubModule[];
    url!:string;
    
    
}
