import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ServerConfig } from '@spartacus/core';
import { CheckoutDetailsService } from '../checkout-details.service';
import { CheckoutStep } from '../config/model/checkout-step.model';
import { CheckoutConfig } from '../config/checkout-config';
import { CheckoutStepType } from '../config/default-checkout-config';

@Injectable({
  providedIn: 'root',
})
export class PaymentDetailsSetGuard implements CanActivate {
  constructor(
    private checkoutDetailsService: CheckoutDetailsService,
    private router: Router,
    private config: CheckoutConfig,
    private serverConfig: ServerConfig
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    const route = this.config.checkout.steps.find(
      (step: CheckoutStep) =>
        step.type.indexOf(CheckoutStepType.reviewOrder) !== -1
    );
    if (!route && !this.serverConfig.production) {
      console.warn(
        'Missing step with type paymentDetails in checkout configuration.'
      );
    }

    return this.checkoutDetailsService.getPaymentDetails().pipe(
      map(paymentDetails => {
        if (paymentDetails && Object.keys(paymentDetails).length !== 0) {
          return true;
        } else {
          return this.router.parseUrl(route && route.url);
        }
      })
    );
  }
}
