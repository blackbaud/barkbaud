import { Component, OnDestroy, OnInit, inject } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';

import { takeUntil } from 'rxjs/operators';
import { AppNavComponent } from '../../shared/components/nav/app-nav.component';
import { DogDetailsComponent } from './dog-details.component';

@Component({
    selector: 'app-dogs-id-route-index',
    templateUrl: './index.component.html',
    imports: [AppNavComponent, DogDetailsComponent]
})
export class DogsIdRouteIndexComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);

  public id = '';

  private ngUnsubscribe = new Subject<void>();

  public ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((params) => {
        this.id = params['id'];
      });
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
