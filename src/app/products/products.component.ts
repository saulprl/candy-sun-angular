import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { ProductData } from './products-data.model';
import { ProductsService } from './products.service';
import { MatDialog } from '@angular/material/dialog';
import { ProductDialogComponent } from './product-dialog/product-dialog.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;

  private dataSub: Subscription;
  dataSource: ProductData[] = [];
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
    private productsService: ProductsService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.productsService.getProducts();

    this.dataSub = this.productsService.getDataListener()
    .subscribe((productData: { products: ProductData[], productCount: number }) => {
      if (productData.productCount > 0) {
        this.dataSource = productData.products;
        this.table.renderRows();
      }
    });
  }

  openDialog(): void {
    this.dialog.open(ProductDialogComponent, {
      width: '250px',
      data: { product: this.productTemplate, isEdit: false }
    });
  }

  refresh(): void {
    this.productsService.getProducts();
    this.table.renderRows();
  }

  onEdit(product: ProductData): void {
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
