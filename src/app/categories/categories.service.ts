import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CategoryData } from './category-data.model';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

const BACKEND_URL = environment.apiUrl + '/categories/';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private categories: CategoryData[] = [];
  private dataListener = new Subject<{ categories: CategoryData[], categoryCount: number }>();

  constructor(
    private http: HttpClient
  ) { }

  getCategories() {
    this.http.get<{
      message: string,
      categories: any,
      categoryCount: number
    }>(BACKEND_URL)
    .pipe(map((categoryData) => {
      return {
        categories: categoryData.categories.map(category => {
          return {
            _id: category._id,
            name: category.name
          };
        }),
        categoryCount: categoryData.categoryCount
      };
    }))
    .subscribe((transformedCategoryData) => {
      this.categories = transformedCategoryData.categories;
      this.dataListener.next({
        categories: [...this.categories],
        categoryCount: transformedCategoryData.categoryCount
      });
    });
  }

  getDataListener() {
    return this.dataListener.asObservable();
  }

  addCategory(name: string) {
    const category: CategoryData = {
      _id: '',
      name
    };

    this.http.post<{ message: string, category: CategoryData }>(BACKEND_URL, category).subscribe(response => {
      this.getCategories();
    });
  }

  editCategory(category: CategoryData) {
    this.http.put(BACKEND_URL + category._id, category).subscribe(response => {
      this.getCategories();
    });
  }

  deleteCategory(category: CategoryData) {
    this.http.delete(BACKEND_URL + category._id).subscribe(response => {
      this.getCategories();
    });
  }
}
