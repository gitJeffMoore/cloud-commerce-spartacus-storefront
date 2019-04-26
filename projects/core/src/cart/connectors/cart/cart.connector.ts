import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Cart } from '../../../occ/occ-models/occ.models';
import { CartAdapter } from './cart.adapter';
import { CheckoutDetails } from 'projects/core/src/checkout';

@Injectable({
  providedIn: 'root',
})
export class CartConnector {
  constructor(private adapter: CartAdapter) {}

  public loadAll(userId: string, details?: boolean): Observable<Cart[]> {
    return this.adapter.loadAll(userId, details);
  }

  public load(
    userId: string,
    cartId: string,
    details?: boolean
  ): Observable<Cart> {
    return this.adapter.load(userId, cartId, details);
  }

  public loadCheckoutDetails(
    userId: string,
    cartId: string
  ): Observable<CheckoutDetails> {
    return this.adapter.loadCheckoutDetails(userId, cartId);
  }

  public create(
    userId: string,
    oldCartId?: string,
    toMergeCartGuid?: string
  ): Observable<Cart> {
    return this.adapter.create(userId, oldCartId, toMergeCartGuid);
  }
}
