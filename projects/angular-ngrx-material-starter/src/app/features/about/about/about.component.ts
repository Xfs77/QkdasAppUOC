import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';

import { NotificationService, ROUTE_ANIMATIONS_ELEMENTS } from '../../../core/core.module';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, take, takeUntil, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { selectUserId } from '../../../core/user/user.selectors';
import { latest } from 'immer/dist/utils/common';
import { environment } from '../../../../environments/environment';
import { Subject } from 'rxjs';

@Component({
  selector: 'anms-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent implements OnInit, OnDestroy {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  releaseButler = require('../../../../assets/release-butler.png').default;
  private onDestroy = new Subject();


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store$: Store,
    private notificationService: NotificationService
 ) {}

  ngOnInit() {

    const params$ = this.route.queryParams; // query params observable
    const user$ = this.store$.select(selectUserId).pipe(filter(userId => userId !== undefined)); // user logged observable

    // when user is logged redirects users depending on query params content. It's used to redirect user to the correct address after Stripe payment
    user$.pipe(
      withLatestFrom(params$),
      take(1)).pipe(takeUntil(this.onDestroy)).subscribe(([user, param]) => {
      if (param.stripe === 'success') {
        this.router.navigate([`/orders`]).then(res => console.log(res));
        this.notificationService.info(`Se ha creado la orden ${param.order}`)
      }
      if (param.stripe === 'error') {
        this.router.navigate([`/cart`]);
        this.notificationService.error(`Se ha cancelado la compra`)
      }
    })

  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }
}
