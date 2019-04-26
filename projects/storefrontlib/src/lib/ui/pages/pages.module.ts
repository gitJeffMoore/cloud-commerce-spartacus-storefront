import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, NotAuthGuard } from '@spartacus/core';
import { LogoutModule } from '../../../cms-components/index';
import { CmsPageGuard } from '../../cms/guards/cms-page.guard';
import { PageLayoutComponent } from '../../cms/page-layout/page-layout.component';
import { PageLayoutModule } from '../../cms/page-layout/page-layout.module';
import { CartPageModule } from './cart-page/cart-page.module';
import { HardcodedCheckoutComponent } from './checkout-page.interceptor';
import { CartNotEmptyGuard } from './guards/cart-not-empty.guard';
import { GuardsModule } from './guards/guards.module';
import { OrderConfirmationPageModule } from './order-confirmation-page/order-confirmation-page.module';
import { ProductPageModule } from './product-page/product-page.module';

const pageModules = [
  CartPageModule,
  OrderConfirmationPageModule,
  ProductPageModule,
  GuardsModule,
];

@NgModule({
  imports: [
    CommonModule,
    ...pageModules,
    PageLayoutModule,
    LogoutModule,
    RouterModule.forChild([
      {
        // This route can be dropped only when we have a mapping path to page label for content pages
        path: null,
        canActivate: [CmsPageGuard],
        component: PageLayoutComponent,
        data: { pageLabel: 'homepage', cxPath: 'home' },
      },
      {
        // This route can be dropped only when the link from CMS in MyAccount dropdown menu ("my-account/address-book")
        // is the same as the page label ("address-book"). Or when we have a mapping for content pages.
        path: null,
        canActivate: [AuthGuard, CmsPageGuard],
        data: { pageLabel: 'address-book', cxPath: 'addressBook' },
        component: PageLayoutComponent,
      },
      {
        path: null,
        component: PageLayoutComponent,
        canActivate: [AuthGuard, CmsPageGuard],
        data: { pageLabel: 'updatePassword', cxPath: 'updatePassword' },
      },
      {
        path: null,
        canActivate: [AuthGuard, CmsPageGuard],
        component: PageLayoutComponent,
        data: { pageLabel: 'orders', cxPath: 'orders' },
      },
      {
        path: null,
        canActivate: [AuthGuard, CmsPageGuard, CartNotEmptyGuard],
        component: PageLayoutComponent,
        data: { pageLabel: 'multiStepCheckoutSummaryPage', cxPath: 'checkout' },
      },
      {
        path: null,
        canActivate: [NotAuthGuard, CmsPageGuard],
        component: PageLayoutComponent,
        data: { pageLabel: 'login', cxPath: 'login' },
      },
      {
        path: null,
        canActivate: [CmsPageGuard],
        component: PageLayoutComponent,
        data: { pageLabel: 'search', cxPath: 'search' },
      },
      {
        path: null,
        canActivate: [CmsPageGuard],
        component: PageLayoutComponent,
        data: { cxPath: 'category' },
      },
      {
        path: null,
        canActivate: [CmsPageGuard],
        component: PageLayoutComponent,
        data: { cxPath: 'brand' },
      },
      {
        path: null,
        component: PageLayoutComponent,
        canActivate: [AuthGuard, CmsPageGuard],
        data: { pageLabel: 'update-email', cxPath: 'updateEmail' },
      },
      {
        path: null,
        canActivate: [AuthGuard, CmsPageGuard],
        data: { pageLabel: 'payment-details', cxPath: 'paymentManagement' },
        component: PageLayoutComponent,
      },
      {
        path: null,
        canActivate: [AuthGuard, CmsPageGuard],
        component: PageLayoutComponent,
        data: { pageLabel: 'order', cxPath: 'orderDetails' },
      },
      {
        path: null,
        canActivate: [NotAuthGuard, CmsPageGuard],
        component: PageLayoutComponent,
        data: { pageLabel: 'forgotPassword', cxPath: 'forgotPassword' },
      },
      {
        path: null,
        component: PageLayoutComponent,
        canActivate: [NotAuthGuard, CmsPageGuard],
        data: { pageLabel: 'resetPassword', cxPath: 'resetPassword' },
      },
      {
        path: null,
        component: PageLayoutComponent,
        canActivate: [AuthGuard, CmsPageGuard],
        data: {
          pageLabel: 'update-profile',
          cxPath: 'updateProfile',
        },
      },
      {
        path: null,
        component: PageLayoutComponent,
        canActivate: [AuthGuard, CmsPageGuard],
        data: { pageLabel: 'close-account', cxPath: 'closeAccount' },
      },
    ]),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HardcodedCheckoutComponent,
      multi: true,
    },
  ],
})
export class PagesModule {}
