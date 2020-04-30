import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { EmployeeData } from './employee-data.model';
import { map } from 'rxjs/operators';

const BACKEND_URL = environment.apiUrl + '/employees/';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  private employees: EmployeeData[] = [];
  private dataListener = new Subject<{ employees: EmployeeData[], employeeCount: number }>();

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  getEmployees() {
    this.http.get<{
      message: string,
      employees: any,
      employeeCount: number
    }>(BACKEND_URL)
    .pipe(map((employeeData) => {
      return {
        employees: employeeData.employees.map(employee => {
          return {
            _id: employee._id,
            name: employee.name,
            surname: employee.surname,
            dob: employee.dob,
            email: employee.email
          };
        }),
        employeeCount: employeeData.employeeCount
      };
    }))
    .subscribe((transformedEmployeeData) => {
      this.employees = transformedEmployeeData.employees;
      this.dataListener.next({
        employees: [...this.employees],
        employeeCount: transformedEmployeeData.employeeCount
      });
    });
  }

  getDataListener() {
    return this.dataListener.asObservable();
  }

  editEmployee(employee: EmployeeData) {
    this.http.put(BACKEND_URL + employee._id, employee).subscribe(result => {
      this.getEmployees();
    });
  }

  deleteEmployee(employee: EmployeeData) {
    this.http.delete(BACKEND_URL + employee._id).subscribe(result => {
      this.getEmployees();
    });
  }
}
