import { Component, Input, Pipe, PipeTransform } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import {
  CartService,
  RoutingService,
  CartDataService,
  GlobalMessageService,
  Address,
  PaymentDetails,
  Order,
  CheckoutService,
  Cart,
  I18nTestingModule,
} from '@spartacus/core';

import { BehaviorSubject, Observable, of } from 'rxjs';

import createSpy = jasmine.createSpy;

import { MultiStepCheckoutComponent } from './multi-step-checkout.component';

class MockCheckoutService {
  clearCheckoutData = createSpy();
  createAndSetAddress = createSpy();
  setDeliveryAddress = createSpy();
  setDeliveryMode = createSpy();
  createPaymentDetails = createSpy();
  setPaymentDetails = createSpy();
  placeOrder = createSpy();

  getSelectedDeliveryModeCode(): Observable<string> {
    return of('');
  }

  getDeliveryAddress(): Observable<Address> {
    return of({});
  }

  getPaymentDetails(): Observable<PaymentDetails> {
    return of({});
  }

  getOrderDetails(): Observable<Order> {
    return of({});
  }
}

const mockPaymentDetails: PaymentDetails = {
  id: 'mock payment id',
  accountHolderName: 'Name',
  cardNumber: '123456789',
  cardType: {
    code: 'Visa',
    name: 'Visa',
  },
  expiryMonth: '01',
  expiryYear: '2022',
  cvn: '123',
};
const mockDeliveryAddresses: string[] = ['address1', 'address2'];
const mockSelectedCode = 'test mode';
const mockOrderDetails = { id: '1234' };

@Component({ selector: 'cx-delivery-mode', template: '' })
class MockDeliveryModeComponent {
  @Input()
  selectedShippingMethod: string;
}

@Component({ selector: 'cx-payment-method', template: '' })
class MockPaymentMethodComponent {
  @Input()
  selectedPayment: PaymentDetails;
}

@Component({ selector: 'cx-review-submit', template: '' })
class MockReviewSubmitComponent {
  @Input()
  deliveryAddress: Address;
  @Input()
  shippingMethod: string;
  @Input()
  paymentDetails: PaymentDetails;
}

@Component({ selector: 'cx-shipping-address', template: '' })
class MockShippingAddressComponent {
  @Input()
  selectedAddress: Address;
}

@Component({ selector: 'cx-order-summary', template: '' })
class MockOrderSummaryComponent {
  @Input()
  cart: Cart;
}

@Pipe({
  name: 'cxTranslateUrl',
})
class MockTranslateUrlPipe implements PipeTransform {
  transform(): any {}
}

describe('MultiStepCheckoutComponent', () => {
  let component: MultiStepCheckoutComponent;
  let fixture: ComponentFixture<MultiStepCheckoutComponent>;

  let mockCheckoutService: MockCheckoutService;
  let mockCartService: any;
  let mockCartDataService: any;
  let mockRoutingService: any;
  let mockGlobalMessageService: any;

  const mockAllSteps = () => {
    spyOn(mockCheckoutService, 'getDeliveryAddress').and.returnValue(
      of(mockDeliveryAddresses)
    );
    spyOn(mockCheckoutService, 'getSelectedDeliveryModeCode').and.returnValue(
      of(mockSelectedCode)
    );
    spyOn(mockCheckoutService, 'getPaymentDetails').and.returnValue(
      of(mockPaymentDetails)
    );
    spyOn(mockCheckoutService, 'getOrderDetails').and.returnValue(
      of(mockOrderDetails)
    );
  };

  beforeEach(async(() => {
    mockCartService = {
      getActive(): BehaviorSubject<Cart> {
        return new BehaviorSubject({
          totalItems: 5141,
          subTotal: { formattedValue: '11119' },
        });
      },
      loadDetails: createSpy(),
    };
    mockCartDataService = {
      getDetails: false,
    };
    mockRoutingService = {
      go: createSpy(),
    };
    mockGlobalMessageService = {
      add: createSpy(),
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, I18nTestingModule],
      declarations: [
        MockTranslateUrlPipe,
        MultiStepCheckoutComponent,
        MockDeliveryModeComponent,
        MockPaymentMethodComponent,
        MockReviewSubmitComponent,
        MockShippingAddressComponent,
        MockOrderSummaryComponent,
      ],
      providers: [
        { provide: CheckoutService, useClass: MockCheckoutService },
        { provide: CartService, useValue: mockCartService },
        { provide: CartDataService, useValue: mockCartDataService },
        { provide: GlobalMessageService, useValue: mockGlobalMessageService },
        { provide: RoutingService, useValue: mockRoutingService },
      ],
    }).compileComponents();

    mockCheckoutService = TestBed.get(CheckoutService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiStepCheckoutComponent);
    component = fixture.componentInstance;

    spyOn(component, 'nextStep').and.callThrough();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit() before process steps', () => {
    const mockCartData = {};
    mockCartService.getActive().next(mockCartData);
    component.ngOnInit();
    expect(component.step).toEqual(1);
    expect(mockCartService.loadDetails).toHaveBeenCalled();
  });

  it('should call processSteps() to process step 1: set delivery address', () => {
    spyOn(mockCheckoutService, 'getDeliveryAddress').and.returnValue(
      of(mockDeliveryAddresses)
    );

    component.processSteps();
    expect(component.nextStep).toHaveBeenCalledWith(2);
  });

  it('should call processSteps() to process step 2: select delivery mode', () => {
    spyOn(mockCheckoutService, 'getDeliveryAddress').and.returnValue(
      of(mockDeliveryAddresses)
    );
    spyOn(mockCheckoutService, 'getSelectedDeliveryModeCode').and.returnValue(
      of(mockSelectedCode)
    );
    component.processSteps();
    expect(component.nextStep).toHaveBeenCalledWith(3);
  });

  it('should call processSteps() to process step 3: set payment info', () => {
    spyOn(mockCheckoutService, 'getDeliveryAddress').and.returnValue(
      of(mockDeliveryAddresses)
    );
    spyOn(mockCheckoutService, 'getSelectedDeliveryModeCode').and.returnValue(
      of(mockSelectedCode)
    );
    spyOn(mockCheckoutService, 'getPaymentDetails').and.returnValue(
      of(mockPaymentDetails)
    );

    component.processSteps();
    expect(component.nextStep).toHaveBeenCalledWith(4);
  });

  it('should call processSteps() to process step 4: place order', () => {
    spyOn(mockCheckoutService, 'getDeliveryAddress').and.returnValue(
      of(mockDeliveryAddresses)
    );
    spyOn(mockCheckoutService, 'getSelectedDeliveryModeCode').and.returnValue(
      of(mockSelectedCode)
    );
    spyOn(mockCheckoutService, 'getPaymentDetails').and.returnValue(
      of(mockPaymentDetails)
    );
    spyOn(mockCheckoutService, 'getOrderDetails').and.returnValue(
      of(mockOrderDetails)
    );

    component.processSteps();
    expect(mockRoutingService.go).toHaveBeenCalledWith({
      route: 'orderConfirmation',
    });
  });

  it('should call setStep()', () => {
    component.setStep(2);
    expect(component.nextStep).toHaveBeenCalledWith(2);
  });

  it('should call nextStep()', () => {
    // next step is 3
    component.nextStep(3);

    expect(component.navs[0].status.completed).toBeFalsy();
    expect(component.navs[0].status.active).toBeFalsy();
    expect(component.navs[0].progressBar).toBeFalsy();

    expect(component.navs[1].status.completed).toBeTruthy();
    expect(component.navs[1].status.active).toBeFalsy();
    expect(component.navs[1].progressBar).toBeTruthy();

    // except step3 (navs[2]), other steps are not active
    expect(component.navs[2].status.active).toBeTruthy();
    expect(component.navs[2].status.disabled).toBeFalsy();
    expect(component.navs[2].progressBar).toBeTruthy();

    expect(component.navs[3].status.active).toBeFalsy();
    expect(component.navs[3].progressBar).toBeFalsy();
  });

  it('should contain proper total value and total items', () => {
    fixture.detectChanges();

    const values = fixture.debugElement.query(By.css('.cx-list-media'))
      .nativeElement.textContent;

    expect(values).toContain('5141');
    expect(values).toContain('11119');
  });

  it('should highlight proper step', () => {
    fixture.detectChanges();
    const steps = fixture.debugElement.queryAll(By.css('.cx-item a'));
    steps[0].nativeElement.click();
    fixture.detectChanges();

    expect(steps[0].nativeElement.getAttribute('class')).toContain('is-active');
    expect(steps[1].nativeElement.getAttribute('class')).not.toContain(
      'is-active'
    );
  });

  it('should show terms and conditions on step 4, and only step 4', () => {
    mockAllSteps();
    component.ngOnInit();

    const getPlaceOrderForm = () =>
      fixture.debugElement.query(By.css('.cx-place-order-form'));

    expect(getPlaceOrderForm()).toBeTruthy();
  });

  it('should show terms and conditions on step 4 only', () => {
    component.ngOnInit();

    const getPlaceOrderForm = () =>
      fixture.debugElement.query(By.css('.cx-place-order-form'));

    expect(getPlaceOrderForm()).toBeFalsy();
  });

  it('should call setStep(3) when back button clicked', () => {
    spyOn(component, 'setStep').and.callThrough();
    mockAllSteps();
    fixture.detectChanges();

    const getBackBtn = () =>
      fixture.debugElement.query(By.css('.cx-place-order .btn-action'))
        .nativeElement;
    getBackBtn().click();
    expect(component.setStep).toHaveBeenCalledWith(3);
  });

  it('should contain disabled place order button if terms not accepted', () => {
    mockAllSteps();
    fixture.detectChanges();

    const getPlaceOrderBtn = () =>
      fixture.debugElement.query(By.css('.cx-place-order .btn-primary'))
        .nativeElement;
    expect(getPlaceOrderBtn().disabled).toBe(true);
  });

  it('should contain enabled place order button if terms accepted', () => {
    mockAllSteps();
    component.ngOnInit();

    const inputCheckbox = fixture.debugElement.query(
      By.css('.cx-place-order-form .form-check-input')
    ).nativeElement;
    inputCheckbox.click();
    fixture.detectChanges();

    const getPlaceOrderBtn = () =>
      fixture.debugElement.query(By.css('.cx-place-order .btn-primary'))
        .nativeElement;
    expect(getPlaceOrderBtn().disabled).toBe(false);
  });
});
