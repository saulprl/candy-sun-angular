import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { CategoryData } from './category-data.model';
import { CategoriesService } from './categories.service';
import { MatDialog } from '@angular/material/dialog';
import { CategoryDialogComponent } from './category-dialog/category-dialog.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit, OnDestroy {
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;

  private dataSub: Subscription;
  dataSource: CategoryData[] = [];
  displayedColumns: string[] = ['name', 'star'];

  private categoryTemplate: CategoryData = {
    _id: '',
    name: ''
  };

  constructor(
    public categoriesService: CategoriesService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.categoriesService.getCategories();

    this.dataSub = this.categoriesService.getDataListener()
      .subscribe((categoryData: { categories: CategoryData[], categoryCount: number }) => {
        if (categoryData.categoryCount >= 0) {
          this.dataSource = categoryData.categories;
          this.table.renderRows();
        }
      });
  }

  openDialog(): void {
    this.dialog.open(CategoryDialogComponent, {
      width: '250px',
      data: { category: this.categoryTemplate, isEdit: false }
    });
  }

  refresh(): void {
    this.categoriesService.getCategories();
    this.table.renderRows();
  }

  onEdit(category: any): void {
    this.dialog.open(CategoryDialogComponent, {
      width: '250px',
      data: {
        _id: category._id,
        name: category.name,
        isEdit: true
      }
    });
  }

  onDelete(category: any): void {
    this.dialog.open(CategoryDialogComponent, {
      width: '250px',
      data: {
        _id: category._id,
        name: category.name,
        isDelete: true
      }
    });
  }

  ngOnDestroy(): void {
    this.dataSub.unsubscribe();
  }

}
