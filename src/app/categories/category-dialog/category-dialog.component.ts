import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoriesService } from '../categories.service';

@Component({
  selector: 'app-category-dialog',
  templateUrl: './category-dialog.component.html',
  styleUrls: ['./category-dialog.component.css']
})
export class CategoryDialogComponent implements OnInit {
  form: FormGroup;
  headerText: string;
  buttonText: string;
  isDelete: boolean;

  constructor(
    public dialogRef: MatDialogRef<CategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private categoriesService: CategoriesService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      _id: [ { value: this.data._id, disabled: true } ],
      name: [ this.data.name, Validators.required ]
    });

    this.buttonText = this.data.isEdit ? 'Editar' : 'Agregar';
    this.headerText = this.data.isEdit ? 'Editar categoría' : this.data.isDelete ? 'Eliminar categoría' : 'Nueva categoría';
    this.isDelete = this.data.isDelete;
  }

  save(): void {
    if (this.form.invalid) {
      return;
    }

    if (this.data.isEdit) {
      this.categoriesService.editCategory(this.form.getRawValue());
    } else {
      this.categoriesService.addCategory(this.form.value.name);
    }

    this.close();
  }

  delete(): void {
    this.categoriesService.deleteCategory(this.form.getRawValue());
    this.close();
  }

  close(): void {
    this.dialogRef.close();
  }

  get controls() {
    return this.form.controls;
  }

}
