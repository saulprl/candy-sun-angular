import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { LoaderService } from './loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {
  isLoading: Subject<boolean> = this.loaderService.isLoading;
  isLoadingSub: Subscription;

  constructor(
    private loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    // this.isLoadingSub = this.loaderService.isLoading.subscribe(isLoading => {
    //   this.isLoading = isLoading;
    // });
  }

  // ngOnDestroy(): void {
  //   this.isLoadingSub.unsubscribe();
  // }

}
