import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { DeliveryMode, CheckoutService, RoutingService } from '@spartacus/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CheckoutConfigService } from '../../../checkout-config.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'cx-delivery-mode',
  templateUrl: './delivery-mode.component.html',
  styleUrls: ['./delivery-mode.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeliveryModeComponent implements OnInit {
  supportedDeliveryModes$: Observable<DeliveryMode[]>;
  selectedDeliveryMode$: Observable<DeliveryMode>;
  currentDeliveryModeId: string;

  currentStepUrl = this.checkoutConfigService.getCurrentStepUrl(
    this.activatedRoute
  );

  mode: FormGroup = this.fb.group({
    deliveryModeId: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private checkoutService: CheckoutService,
    private routingService: RoutingService,
    private checkoutConfigService: CheckoutConfigService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.checkoutService.loadSupportedDeliveryModes();

    this.supportedDeliveryModes$ = this.checkoutService.getSupportedDeliveryModes();
    this.selectedDeliveryMode$ = this.checkoutService.getSelectedDeliveryMode();

    this.selectedDeliveryMode$
      .pipe(
        map((deliveryMode: DeliveryMode) =>
          deliveryMode && deliveryMode.code ? deliveryMode.code : null
        )
      )
      .subscribe(code => {
        if (code) {
          this.mode.controls['deliveryModeId'].setValue(code);
          this.currentDeliveryModeId = code;
        }
      });
  }

  next(): void {
    const nextStepUrl = this.checkoutConfigService.getNextCheckoutStepUrl(
      this.currentStepUrl
    );

    this.setDeliveryMode(this.mode.value.deliveryModeId);
    if (this.currentDeliveryModeId) {
      this.routingService.go(nextStepUrl);
    }
  }

  back(): void {
    const previousStepUrl = this.checkoutConfigService.getPreviousCheckoutStepUrl(
      this.currentStepUrl
    );

    this.routingService.go(previousStepUrl);
  }

  get deliveryModeInvalid(): boolean {
    return this.mode.controls['deliveryModeId'].invalid;
  }

  private setDeliveryMode(deliveryModeId: string): void {
    if (
      !this.currentDeliveryModeId ||
      this.currentDeliveryModeId !== deliveryModeId
    ) {
      this.checkoutService.setDeliveryMode(deliveryModeId);
    }
  }
}
