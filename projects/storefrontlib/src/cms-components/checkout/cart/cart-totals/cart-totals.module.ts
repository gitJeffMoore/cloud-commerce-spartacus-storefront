import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {
  UrlTranslationModule,
  ConfigModule,
  CmsConfig,
  I18nModule,
} from '@spartacus/core';
import { CartTotalsComponent } from './cart-totals.component';
import { CartSharedModule } from '../cart-shared/cart-shared.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    UrlTranslationModule,
    ConfigModule.withConfig(<CmsConfig>{
      cmsComponents: {
        CartTotalsComponent: {
          selector: 'cx-cart-totals',
        },
      },
    }),
    CartSharedModule,
    I18nModule,
  ],
  declarations: [CartTotalsComponent],
  exports: [CartTotalsComponent],
  entryComponents: [CartTotalsComponent],
})
export class CartTotalsModule {}
