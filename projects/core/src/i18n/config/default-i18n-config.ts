import { I18nConfig } from './i18n-config';

export const defaultI18nConfig: I18nConfig = {
  i18n: {
    fallbackLang: false,
    debug: false,
    namespaceMapping: {
      addToCart: 'addToCart',
      address: 'address',
      addressBook: 'addressBook',
      cart: 'cart',
      cartItems: 'cartItems',
      checkout: 'checkout',
      checkoutAddress: 'checkoutAddress',
      checkoutOrderConfirmation: 'checkoutOrderConfirmation',
      checkoutProgress: 'checkoutProgress',
      checkoutReview: 'checkoutReview',
      checkoutShipping: 'checkoutShipping',
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

      storeFinder: 'storeFinder',
      pwa: 'pwa',
    },
  },
};
