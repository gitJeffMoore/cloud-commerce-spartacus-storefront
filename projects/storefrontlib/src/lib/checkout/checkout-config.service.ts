import { Injectable } from '@angular/core';
import { CheckoutConfig } from './config/checkout-config';
import { CheckoutStepType } from './config/default-checkout-config';
import { CheckoutStep } from './config/model/checkout-step.model';
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class CheckoutConfigService {
  steps: CheckoutStep[] = this.checkoutConfig.checkout.steps;

  constructor(private checkoutConfig: CheckoutConfig) {}

  getCheckoutStep(currentStepType: CheckoutStepType): CheckoutStep {
    return this.steps[this.getCheckoutStepIndex('type', currentStepType)];
  }

  getNextCheckoutStepUrl(currentStepUrl: string): string {
    const index: number = this.getCheckoutStepIndex('url', currentStepUrl);

    return index >= 0 && this.steps[index + 1]
      ? this.steps[index + 1].url
      : null;
  }

  getPreviousCheckoutStepUrl(currentStepUrl: string): string {
    const index: number = this.getCheckoutStepIndex('url', currentStepUrl);

    return index >= 1 && this.steps[index - 1]
      ? this.steps[index - 1].url
      : null;
  }

  getCurrentStepUrl(activatedRoute: ActivatedRoute) {
    return `/${activatedRoute.snapshot.url.join('/')}`;
  }

  private getCheckoutStepIndex(key: string, value: any): number {
    return this.steps.findIndex((step: CheckoutStep) =>
      step[key].includes(value)
    );
  }
}
