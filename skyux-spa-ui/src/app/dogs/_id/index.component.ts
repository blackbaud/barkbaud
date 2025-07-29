import { Component, OnDestroy, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';

import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-dogs-id-route-index',
    templateUrl: './index.component.html',
    standalone: false
})
export class DogsIdRouteIndexComponent implements OnInit, OnDestroy {
  public id = '';

  private ngUnsubscribe = new Subject<void>();

  constructor(private route: ActivatedRoute) {}

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
