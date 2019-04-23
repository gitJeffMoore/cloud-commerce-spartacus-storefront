import { OrderConfirmationPageGuard } from './order-confirmation-page.guard';
import { CheckoutGuard } from './checkout.guard';
import { ShippingAddressSetGuard } from './shipping-address-set.guard';
import { PaymentDetailsSetGuard } from './payment-details-set.guard';

export const guards: any[] = [
  OrderConfirmationPageGuard,
  CheckoutGuard,
  ShippingAddressSetGuard,
  PaymentDetailsSetGuard,
];
