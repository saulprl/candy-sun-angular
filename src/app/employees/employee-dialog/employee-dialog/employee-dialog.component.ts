import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeesService } from '../../employees.service';

@Component({
  selector: 'app-employee-dialog',
  templateUrl: './employee-dialog.component.html',
  styleUrls: ['./employee-dialog.component.css']
})
export class EmployeeDialogComponent implements OnInit {
  form: FormGroup;
  headerText: string;
  buttonText: string;
  isDelete: boolean;

  constructor(
    public dialogRef: MatDialogRef<EmployeeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private employeesService: EmployeesService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      _id: [ { value: this.data._id, disabled: true } ],
      name: [ this.data.name, Validators.required ],
      surname: [ this.data.surname, Validators.required ],
      dob: [ this.data.dob, Validators.required ],
      email: [ this.data.email, [ Validators.required, Validators.email ] ]
    });

    this.buttonText = 'Editar';
    this.headerText = this.data.isEdit ? 'Editar empleado' : 'Eliminar empleado';
    this.isDelete = this.data.isDelete;
  }

  save(): void {
    if (this.form.invalid) {
      return;
    }

    this.employeesService.editEmployee(this.form.getRawValue());
    this.close();
  }

  delete(): void {
    this.employeesService.deleteEmployee(this.form.getRawValue());
    this.close();
  }

  close(): void {
    this.dialogRef.close();
  }

  get controls() {
    return this.form.controls;
  }

}
