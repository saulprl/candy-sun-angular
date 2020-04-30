import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { EmployeesService } from './employees.service';
import { Subscription } from 'rxjs';
import { EmployeeData } from './employee-data.model';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeDialogComponent } from './employee-dialog/employee-dialog/employee-dialog.component';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit, OnDestroy {
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;

  private dataSub: Subscription;
  dataSource: EmployeeData[] = [];
  displayedColumns: string[] = ['name', 'surname', 'dob', 'email', 'star'];

  private employeeTemplate: EmployeeData = {
    _id: '',
    name: '',
    surname: '',
    dob: null,
    email: ''
  };

  constructor(
    public employeeService: EmployeesService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.employeeService.getEmployees();

    this.dataSub = this.employeeService.getDataListener()
    .subscribe((employeeData: { employees: EmployeeData[], employeeCount: number }) => {
      if (employeeData.employeeCount >= 0) {
        this.dataSource = employeeData.employees;
        this.table.renderRows();
      }
    });
  }

  openDialog(): void {
    this.dialog.open(EmployeeDialogComponent, {
      width: '250px',
      data: { employee: this.employeeTemplate, isEdit: false }
    });
  }

  refresh(): void {
    this.employeeService.getEmployees();
    this.table.renderRows();
  }

  onEdit(employee: EmployeeData) {
    this.dialog.open(EmployeeDialogComponent, {
      width: '250px',
      data: {
        _id: employee._id,
        name: employee.name,
        surname: employee.surname,
        dob: employee.dob,
        email: employee.email,
        isEdit: true
      }
    });
  }

  onDelete(employee: EmployeeData) {
    this.dialog.open(EmployeeDialogComponent, {
      width: '250px',
      data: {
        _id: employee._id,
        name: employee.name,
        surname: employee.surname,
        dob: employee.dob,
        email: employee.email,
        isDelete: true
      }
    });
  }

  ngOnDestroy(): void {
    this.dataSub.unsubscribe();
  }

}
