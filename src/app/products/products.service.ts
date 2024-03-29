import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ProductData } from './products-data.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { CategoryData } from '../categories/category-data.model';
import { CategoriesService } from '../categories/categories.service';

const BACKEND_URL = environment.apiUrl + '/products/';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private showExisting = false;
  private products: ProductData[] = [];
  private dataListener = new Subject<{ products: ProductData[], productCount: number }>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private categoriesService: CategoriesService
  ) { }

  getProducts(showExisting: boolean) {
    this.showExisting = showExisting;

    this.http.get<{
      message: string,
      products: any,
      productCount: number
    }>(BACKEND_URL + showExisting)
    .pipe(map((productData) => {
      return {
        products: productData.products.map(product => {
          return {
            _id: product._id,
            name: product.name,
            purchase_price: product.purchase_price,
            purchase_date: product.purchase_date,
            selling_price: product.selling_price,
            quantity: product.quantity,
            category: product.category,
            calories: product.calories,
            brand: product.brand,
            expiration: product.expiration
          };
        }),
        productCount: productData.productCount
      };
    }))
    .subscribe((transformedProductData) => {
      this.products = transformedProductData.products;
      this.dataListener.next({
        products: [...this.products],
        productCount: transformedProductData.productCount
      });
    });
  }

  getCategories() {
    this.categoriesService.getCategories();
  }

  getDataListener() {
    return this.dataListener.asObservable();
  }

  addProduct(name: string, purchasePrice: number, purchaseDate: Date, sellingPrice: number,
             quantity: number, category: string, calories: number, brand: string, expiration: Date) {
    const product: ProductData = {
      _id: '',
      name,
      purchase_price: purchasePrice,
      purchase_date: purchaseDate,
      selling_price: sellingPrice,
      quantity,
      category,
      calories,
      brand,
      expiration
    };

    this.http.post<{ message: string, product: ProductData }>(BACKEND_URL, product).subscribe(responseData => {
      this.getProducts(this.showExisting);
    });
  }

  editProduct(product: ProductData) {
    this.http.put(BACKEND_URL + product._id, product).subscribe(response => {
      this.getProducts(this.showExisting);
    });
  }

  deleteProduct(product: ProductData) {
    this.http.delete(BACKEND_URL + product._id).subscribe(response => {
      this.getProducts(this.showExisting);
    });
  }

  hasExpired(expirationDate: Date): boolean {
    const today = new Date();
    const eDate = new Date(expirationDate);

    const diff = (Math.floor(Date.UTC(eDate.getFullYear(), eDate.getMonth(), eDate.getDate()) -
      Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())) / (1000 * 60 * 60 * 24));

    return diff <= 5;
  }

}
