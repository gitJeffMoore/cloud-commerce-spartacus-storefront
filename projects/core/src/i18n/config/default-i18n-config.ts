import { I18nConfig } from './i18n-config';

export const defaultI18nConfig: I18nConfig = {
  i18n: {
    fallbackLang: false,
    debug: false,
    chunks: {
      common: 'common',
      spinner: 'common',
      header: 'common',
      searchBox: 'common',

      cartDetails: 'cart',
      orderCost: 'cart',

      addressForm: 'address',
      addressCard: 'address',

      paymentForm: 'payment',
      paymentMethods: 'payment',

      checkout: 'checkout',
      checkoutAddress: 'checkout',
      checkoutOrderConfirmation: 'checkout',
      checkoutProgress: 'checkoutProgress',
      checkoutReview: 'checkout',
      checkoutShipping: 'checkout',

      orderDetails: 'myAccount',
      orderHistory: 'myAccount',

      productDetails: 'product',
      productList: 'product',
      productFacetNavigation: 'product',
      productSummary: 'product',
      productReview: 'product',

      forgottenPassword: 'user',
      loginForm: 'user',
      login: 'user',
      register: 'user',
      updateEmailForm: 'user',
      updatePasswordForm: 'user',
      updateProfileForm: 'user',

      storeFinder: 'storeFinder',
      pwa: 'pwa',
    },
  },
};
