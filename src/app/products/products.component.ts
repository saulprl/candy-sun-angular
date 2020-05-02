import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { ProductData } from './products-data.model';
import { ProductsService } from './products.service';
import { MatDialog } from '@angular/material/dialog';
import { ProductDialogComponent } from './product-dialog/product-dialog.component';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  private dataSub: Subscription;
  dataSource: MatTableDataSource<ProductData>;
  displayedColumns: string[] = ['name', 'purchase_price', 'purchase_date',
    'selling_price', 'quantity', 'category', 'calories', 'brand', 'expiration', 'star'];

  private productTemplate: ProductData = {
    _id: '',
    name: '',
    purchase_price: 0,
    purchase_date: null,
    selling_price: 0,
    quantity: 0,
    category: '',
    calories: 0,
    brand: '',
    expiration: null
  };

  constructor(
    public productsService: ProductsService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.productsService.getProducts(false);

    this.dataSub = this.productsService.getDataListener()
    .subscribe((productData: { products: ProductData[], productCount: number }) => {
      if (productData.productCount >= 0) {
        this.dataSource = new MatTableDataSource(productData.products);
        this.dataSource.sort = this.sort;
      }
    });

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(): void {
    this.dialog.open(ProductDialogComponent, {
      width: '65%',
      data: { product: this.productTemplate, isEdit: false }
    });
  }

  refresh(showExisting: boolean): void {
    this.productsService.getProducts(showExisting);
  }

  onEdit(product: ProductData): void {
    this.dialog.open(ProductDialogComponent, {
      width: '65%',
      data: {
        _id: product._id,
        name: product.name,
        purchase_price: product.purchase_price,
        purchase_date: product.purchase_date,
        selling_price: product.selling_price,
        quantity: product.quantity,
        category: product.category,
        calories: product.calories,
        brand: product.brand,
        expiration: product.expiration,
        isEdit: true
      }
    });
  }

  onDelete(product: ProductData): void {
    this.dialog.open(ProductDialogComponent, {
      width: '250px',
      data: {
        _id: product._id,
        name: product.name,
        purchase_price: product.purchase_price,
        purchase_date: product.purchase_date,
        selling_price: product.selling_price,
        quantity: product.quantity,
        category: product.category,
        calories: product.calories,
        brand: product.brand,
        expiration: product.expiration,
        isDelete: true
      }
    });
  }

  ngOnDestroy(): void {
    this.dataSub.unsubscribe();
  }

}
