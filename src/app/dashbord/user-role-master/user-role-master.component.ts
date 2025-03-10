import { Component, ElementRef, ViewChild } from '@angular/core';
import { UsermanagementService } from 'src/app/service/UserManagement/usermanagement.service';
import * as $ from 'jquery'; // Import jQuery
import 'datatables.net'; // Import DataTables
import 'datatables.net-buttons';
import { ExportService } from 'src/app/service/export.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-role-master',
  templateUrl: './user-role-master.component.html',
  styleUrls: ['./user-role-master.component.css']
})
export class UserRoleMasterComponent {
  roleaccess: any;
  roleId: any;
  moduleDetails: any;
  sabmoduleAction: any;
  sabmodule: any;
  submoduleId!: String;
  actionID: any;
  add!: String;
  edit!: String;
  delete!: String;
  view!: String;
  active!: boolean;
  module = [];
  moduleName!: String;
  sabModuleAction: any;
  moduleID!: number;
  roles: any[] = [];
  authorityName!: String;
  roleName!: String;
  parentRole!: String;
  roleDesc!: String;
  @ViewChild('allChildRole') table!: ElementRef;

  ngOnInit() {
    this.isactivateButton();
    this.getAllChildRoleDetails();
  }

  ngAfterViewInit(): void {
    // Initialize DataTables after the view is initialized

  }
  constructor(private usermangement: UsermanagementService, private exportServices: ExportService,private router: Router) {
  }
  public isactivateButton(): boolean {
    this.roleaccess = sessionStorage.getItem("ROLE");

    try {
      this.moduleDetails = JSON.parse(this.roleaccess);
      this.active = false; // Initialize active to false
      for (const smactions of this.moduleDetails.sabmoduleAction) {

        if (smactions.sabmodule.submoduleName === "UserRoleManagement") {
          if (smactions.add == "1") {
            console.log("Add" + smactions.sabmodule.add)
            this.active = true;
            break;
          }
        }
      }
      return this.active;
    } catch (error) {
      console.log("Error parsing role access:", error);
      return false; // Default return false on error
    }
  }

  getAllChildRoleDetails() {
    this.usermangement.getAllChildRoleDetails().subscribe(response => {
      this.roles = response;
      setTimeout(() => {
        if ($.fn.dataTable.isDataTable('#allChildRole')) {
          $('#allChildRole').DataTable().clear().rows.add(this.roles).draw(); // Refresh the DataTable
        } else {
          $('#allChildRole').DataTable(); // Initialize DataTable

        }
      });
    },
      error => {

      }
    );
  }
  getModuleSubmodule() {
    this.usermangement.getUserModuleSabmodule().subscribe(
      response => {
        response.forEach((res: {
          moduleName: string; subModuleName: String; sabModuleAction: any;
        }) => {
          
          this.router.navigate(['/roleCreation']);
          console.log("Hi this is response :" + res.sabModuleAction.actionID);
        });
      },
      error => {

      }
    );
  }

// Extract table data dynamically
getTableData(): any[] {
  const table = document.getElementById('allChildRole') as HTMLTableElement;
  
  const rows = table.rows;
  const data: any[] = [];

  // Loop through table rows
  for (let i = 1; i < rows.length; i++) { // Skip the header row
    const cells = rows[i].cells;
    const rowData: any = {};

    // Populate rowData with values from the table
    rowData['AuthorityName'] = cells[0]?.innerText || '';
    rowData['RoleName'] = cells[1]?.innerText || '';
    rowData['ParentRole'] = cells[2]?.innerText || '';
    rowData['Description'] = cells[3]?.innerText || '';
    
    data.push(rowData);
  }

  return data;
}

  documentExport( format: string) {
    const data = this.getTableData(); // Get the table data dynamically

    if (format == 'csv') {
      this.exportServices.exportToCSV(data, 'UserRoleMaster');
    }
    if (format == 'pdf') {
      this.exportServices.exportToPDF(data, 'UserRoleMaster');
    }
    if (format == 'excel') {
      this.exportServices.exportToExcel(data, 'UserRoleMaster')
    }
  }


}