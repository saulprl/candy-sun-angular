import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductsService } from '../products.service';
import { CategoriesService } from 'src/app/categories/categories.service';
import { CategoryData } from 'src/app/categories/category-data.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.css']
})
export class ProductDialogComponent implements OnInit {
  form: FormGroup;
  headerText: string;
  buttonText: string;
  isDelete: boolean;
  categories: CategoryData[] = [];
  dataSub: Subscription;

  constructor(
    public dialogRef: MatDialogRef<ProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.categoriesService.getCategories();

    this.dataSub = this.categoriesService.getDataListener()
      .subscribe((categoryData: { categories: CategoryData[], categoryCount: number }) => {
        if (categoryData.categoryCount > 0) {
          this.categories = categoryData.categories;
        }
      });

    this.form = this.formBuilder.group({
      _id: [ { value: this.data._id, disabled: true } ],
      name: [ this.data.name, Validators.required ],
      purchasePrice: [ this.data.purchase_price, Validators.required ],
      purchaseDate: [ new Date(this.data.purchase_date), Validators.required ],
      sellingPrice: [ this.data.selling_price, Validators.required ],
      quantity: [ this.data.quantity, Validators.required ],
      category: [ this.data.category, Validators.required ],
      calories: [ this.data.calories, Validators.required ],
      brand: [ this.data.brand, Validators.required ],
      expiration: [ new Date(this.data.expiration), Validators.required ]
    });

    this.buttonText = this.data.isEdit ? 'Editar' : 'Agregar';
    this.headerText = this.data.isEdit ? 'Editar producto' : this.data.isDelete ? 'Eliminar producto' : 'Nuevo producto';
    this.isDelete = this.data.isDelete;
  }

  save(): void {
    if (this.form.invalid) {
      return;
    }

    if (this.data.isEdit) {
      this.productsService.editProduct(this.form.getRawValue());
    } else {
      this.productsService.addProduct(
        this.form.value.name,
        this.form.value.purchasePrice,
        this.form.value.purchaseDate,
        this.form.value.sellingPrice,
        this.form.value.quantity,
        this.form.value.category,
        this.form.value.calories,
        this.form.value.brand,
        this.form.value.expiration
      );
    }
    this.close();
  }

  delete(): void {
    this.productsService.deleteProduct(this.form.getRawValue());
    this.close();
  }

  close(): void {
    this.dialogRef.close();
  }

  get controls() {
    return this.form.controls;
  }

}
