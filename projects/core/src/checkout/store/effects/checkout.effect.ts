import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import * as fromActions from '../actions/index';
import { AddMessage, GlobalMessageType } from '../../../global-message/index';
import { ProductImageNormalizer } from '../../../product/index';
import { OccOrderService } from '../../../user/index';
import { OrderEntry } from '../../../occ/occ-models/index';
import * as fromUserActions from '../../../user/store/actions/index';
import * as fromCartActions from './../../../cart/store/actions/index';
import { CheckoutDetails } from '../../models/checkout.model';
import { CartDeliveryConnector } from 'projects/core/src/cart/connectors/delivery/cart-delivery.connector';
import { CartPaymentConnector } from 'projects/core/src/cart/connectors/payment/cart-payment.connector';
import { CartConnector } from 'projects/core/src/cart';

@Injectable()
export class CheckoutEffects {
  @Effect()
  addDeliveryAddress$: Observable<
    | fromUserActions.LoadUserAddresses
    | fromActions.SetDeliveryAddress
    | fromActions.AddDeliveryAddressFail
  > = this.actions$.pipe(
    ofType(fromActions.ADD_DELIVERY_ADDRESS),
    map((action: fromActions.AddDeliveryAddress) => action.payload),
    mergeMap(payload =>
      this.cartDeliveryConnector
        .createAddress(payload.userId, payload.cartId, payload.address)
        .pipe(
          mergeMap(address => {
            address['titleCode'] = payload.address.titleCode;
            return [
              new fromUserActions.LoadUserAddresses(payload.userId),
              new fromActions.SetDeliveryAddress({
                userId: payload.userId,
                cartId: payload.cartId,
                address: address,
              }),
            ];
          }),
          catchError(error => of(new fromActions.AddDeliveryAddressFail(error)))
        )
    )
  );

  @Effect()
  setDeliveryAddress$: Observable<
    | fromActions.SetDeliveryAddressSuccess
    | fromActions.LoadSupportedDeliveryModes
    | fromActions.SetDeliveryAddressFail
  > = this.actions$.pipe(
    ofType(fromActions.SET_DELIVERY_ADDRESS),
    map((action: any) => action.payload),
    mergeMap(payload => {
      return this.cartDeliveryConnector
        .setAddress(payload.userId, payload.cartId, payload.address.id)
        .pipe(
          mergeMap(() => [
            new fromActions.SetDeliveryAddressSuccess(payload.address),
            new fromActions.LoadSupportedDeliveryModes({
              userId: payload.userId,
              cartId: payload.cartId,
            }),
          ]),
          catchError(error => of(new fromActions.SetDeliveryAddressFail(error)))
        );
    })
  );

  @Effect()
  loadSupportedDeliveryModes$: Observable<
    | fromActions.LoadSupportedDeliveryModesSuccess
    | fromActions.LoadSupportedDeliveryModesFail
  > = this.actions$.pipe(
    ofType(fromActions.LOAD_SUPPORTED_DELIVERY_MODES),
    map((action: any) => action.payload),
    mergeMap(payload => {
      return this.cartDeliveryConnector
        .getSupportedModes(payload.userId, payload.cartId)
        .pipe(
          map(data => {
            return new fromActions.LoadSupportedDeliveryModesSuccess(data);
          }),
          catchError(error =>
            of(new fromActions.LoadSupportedDeliveryModesFail(error))
          )
        );
    })
  );

  @Effect()
  setDeliveryMode$: Observable<
    | fromActions.SetDeliveryModeSuccess
    | fromActions.SetDeliveryModeFail
    | fromCartActions.LoadCart
  > = this.actions$.pipe(
    ofType(fromActions.SET_DELIVERY_MODE),
    map((action: any) => action.payload),
    mergeMap(payload => {
      return this.cartDeliveryConnector
        .setMode(payload.userId, payload.cartId, payload.selectedModeId)
        .pipe(
          mergeMap(() => {
            return [
              new fromActions.SetDeliveryModeSuccess(payload.selectedModeId),
              new fromCartActions.LoadCart({
                userId: payload.userId,
                cartId: payload.cartId,
                details: true,
              }),
            ];
          }),
          catchError(error => of(new fromActions.SetDeliveryModeFail(error)))
        );
    })
  );

  @Effect()
  createPaymentDetails$: Observable<
    | fromUserActions.LoadUserPaymentMethods
    | fromActions.CreatePaymentDetailsSuccess
    | fromActions.CreatePaymentDetailsFail
  > = this.actions$.pipe(
    ofType(fromActions.CREATE_PAYMENT_DETAILS),
    map((action: any) => action.payload),
    mergeMap(payload => {
      // get information for creating a subscription directly with payment provider
      return this.cartPaymentConnector
        .create(payload.userId, payload.cartId, payload.paymentDetails)
        .pipe(
          mergeMap(details => {
            return [
              new fromUserActions.LoadUserPaymentMethods(payload.userId),
              new fromActions.CreatePaymentDetailsSuccess(details),
            ];
          }),
          catchError(error =>
            of(new fromActions.CreatePaymentDetailsFail(error))
          )
        );
    })
  );

  @Effect()
  setPaymentDetails$: Observable<
    fromActions.SetPaymentDetailsSuccess | fromActions.SetPaymentDetailsFail
  > = this.actions$.pipe(
    ofType(fromActions.SET_PAYMENT_DETAILS),
    map((action: any) => action.payload),
    mergeMap(payload => {
      return this.cartPaymentConnector
        .set(payload.userId, payload.cartId, payload.paymentDetails.id)
        .pipe(
          map(
            () =>
              new fromActions.SetPaymentDetailsSuccess(payload.paymentDetails)
          ),
          catchError(error => of(new fromActions.SetPaymentDetailsFail(error)))
        );
    })
  );

  @Effect()
  placeOrder$: Observable<
    fromActions.PlaceOrderSuccess | AddMessage | fromActions.PlaceOrderFail
  > = this.actions$.pipe(
    ofType(fromActions.PLACE_ORDER),
    map((action: any) => action.payload),
    mergeMap(payload => {
      return this.occOrderService
        .placeOrder(payload.userId, payload.cartId)
        .pipe(
          map(data => {
            for (const entry of data.entries as OrderEntry[]) {
              this.productImageConverter.convertProduct(entry.product);
            }
            return data;
          }),
          switchMap(data => [
            new fromActions.PlaceOrderSuccess(data),
            new AddMessage({
              text: 'Order placed successfully',
              type: GlobalMessageType.MSG_TYPE_CONFIRMATION,
            }),
          ]),
          catchError(error => of(new fromActions.PlaceOrderFail(error)))
        );
    })
  );

  @Effect()
  loadCheckoutDetails$: Observable<
    fromActions.LoadCheckoutDetailsSuccess | fromActions.LoadCheckoutDetailsFail
  > = this.actions$.pipe(
    ofType(fromActions.LOAD_CHECKOUT_DETAILS),
    map((action: fromActions.LoadCheckoutDetails) => action.payload),
    mergeMap(payload => {
      return this.cartConnector
        .loadCheckoutDetails(payload.userId, payload.cartId)
        .pipe(
          map(
            (data: CheckoutDetails) =>
              new fromActions.LoadCheckoutDetailsSuccess(data)
          ),
          catchError(error =>
            of(new fromActions.LoadCheckoutDetailsFail(error))
          )
        );
    })
  );

  constructor(
    private actions$: Actions,
    private cartDeliveryConnector: CartDeliveryConnector,
    private cartPaymentConnector: CartPaymentConnector,
    private cartConnector: CartConnector,
    private occOrderService: OccOrderService,
    private productImageConverter: ProductImageNormalizer
  ) {}
}
