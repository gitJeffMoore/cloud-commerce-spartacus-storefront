import { InjectionToken } from '@angular/core';
import { Converter } from '../../../util/converter.service';
import { PaymentDetails } from '../../../occ/occ-models/occ.models';

export const CART_PAYMENT_DETAILS_NORMALIZER = new InjectionToken<
  Converter<any, PaymentDetails>
>('PaymentDetailsNormalizer');

export const CART_PAYMENT_DETAILS_SERIALIZER = new InjectionToken<
  Converter<PaymentDetails, any>
>('PaymentDetailsSerializer');
