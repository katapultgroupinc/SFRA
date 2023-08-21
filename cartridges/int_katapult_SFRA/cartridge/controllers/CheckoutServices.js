'use strict';

/*
eslint no-undef: "off"
*/
var server = require('server');
var checkoutService = module.superModule;
server.extend(checkoutService);
var URLUtils = require('dw/web/URLUtils');
var CustomObjectMgr = require('dw/object/CustomObjectMgr');
var Transaction = require('dw/system/Transaction');
var onRequest = require('*/cartridge/scripts/request/onRequest');
var Site = require('dw/system/Site');
var KatEnvironment = Site.current.getCustomPreferenceValue('KAT_environment');
var PaymentTransaction = require('dw/order/PaymentTransaction');
/**
*  Formating Katapul URL
*/
KatEnvironment = KatEnvironment.trim();
var index = KatEnvironment.lastIndexOf('/', KatEnvironment.length);

if (KatEnvironment[KatEnvironment.length - 1] === '/') {
    KatEnvironment = KatEnvironment.slice(0, index);
}

/**
*  sleep to wait SF internal process
* @param {num} milliseconds time to sleep.
*/
function sleep(milliseconds) {
    var date = Date.now();
    var currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

server.post(
    'SubmitPaymentKatapult',
    server.middleware.https,
    function (req, res, next) {
        onRequest.setResponseHeaders(res);
        next();
    }
);

/**
 *  Handle Ajax payment (and billing) form submit
 */
server.prepend(
    'SubmitPaymentKatapult',
    server.middleware.https,
    function (req, res, next) {
        onRequest.setResponseHeaders(res);
        if (req.body && req.httpMethod === 'POST') {
            var bodyObject = JSON.parse(req.body);
            // If it comes from katapult
            if (bodyObject.zibby_id) {
                var basket = req.querystring.basket.toString();
                var isRecordExist = CustomObjectMgr.getCustomObject(
                    'katapult_transactions',
                    basket
                );
                if (!isRecordExist) {
                    Transaction.begin();
                    var transaction = CustomObjectMgr.createCustomObject(
                        'katapult_transactions',
                        basket
                    );
                    transaction.custom.KAT_customer_id = bodyObject.customer_id;
                    transaction.custom.KAT_zibby_id = bodyObject.zibby_id;
                    transaction.custom.KAT_uid = bodyObject.uid;
                    Transaction.commit();
                } else {
                    Transaction.begin();
                    isRecordExist.custom.KAT_customer_id = bodyObject.customer_id;
                    isRecordExist.custom.KAT_zibby_id = bodyObject.zibby_id;
                    isRecordExist.custom.KAT_uid = bodyObject.uid;
                    Transaction.commit();
                }

                res.json({ message: 'OK' });
                this.emit('route:Complete', req, res);
            } else { // else go to the next controller
                next();
            }
        } else if (req.httpHeaders.origin !== KatEnvironment) {
            var PaymentManager = require('dw/order/PaymentMgr');
            var HookManager = require('dw/system/HookMgr');
            var Resource = require('dw/web/Resource');
            var COHelpers = require('*/cartridge/scripts/checkout/checkoutHelpers');
            var isKatapult = false;
            var viewData = {};
            var paymentForm = server.forms.getForm('billing');
            var paymentMethodIdValue = paymentForm.paymentMethod.value;
            var BasketMgr = require('dw/order/BasketMgr');
            isKatapult = paymentMethodIdValue === 'KATAPULT';

            if (!isKatapult) {
                Transaction.wrap(function () {
                    var currentBasket = BasketMgr.getCurrentBasket();
                    // Remove any PaymentInstruments to start a new payment
                    if (currentBasket) {
                        currentBasket.removeAllPaymentInstruments();
                    }
                });
                next();
                return;
            }

            var hasKatapult = req.session.privacyCache.get('hasKatapult');

            if (hasKatapult !== 'yes') {
                if (isKatapult) {
                    req.session.privacyCache.set('hasKatapult', 'yes');
                } else {
                    req.session.privacyCache.set('hasKatapult', '');
                }
                // verify billing form data
                var billingFormErrors = COHelpers.validateBillingForm(paymentForm.addressFields);
                var contactInfoFormErrors = COHelpers.validateFields(paymentForm.contactInfoFields);

                var formFieldErrors = [];
                // set viewdata
                if (Object.keys(billingFormErrors).length) {
                    formFieldErrors.push(billingFormErrors);
                } else {
                    viewData.address = {
                        firstName: { value: paymentForm.addressFields.firstName.value },
                        lastName: { value: paymentForm.addressFields.lastName.value },
                        address1: { value: paymentForm.addressFields.address1.value },
                        address2: { value: paymentForm.addressFields.address2.value },
                        city: { value: paymentForm.addressFields.city.value },
                        postalCode: { value: paymentForm.addressFields.postalCode.value },
                        countryCode: { value: paymentForm.addressFields.country.value }

                    };

                    if (Object.prototype.hasOwnProperty.call(paymentForm.addressFields, 'states')) {
                        viewData.address.stateCode = { value: paymentForm.addressFields.states.stateCode.value };
                    }
                }

                if (Object.keys(contactInfoFormErrors).length) {
                    formFieldErrors.push(contactInfoFormErrors);
                } else {
                    viewData.email = {
                        value: paymentForm.contactInfoFields.email.value
                    };

                    viewData.phone = { value: paymentForm.contactInfoFields.phone.value };
                }

                var paymentProcessor = PaymentManager.getPaymentMethod(paymentMethodIdValue).getPaymentProcessor();
                if (!paymentProcessor) {
                    req.session.privacyCache.set('hasKatapult', '');
                    throw new Error(Resource.msg(
                        'error.payment.processor.missing',
                        'checkout',
                        null
                    ));
                }
                var paymentFormResult;
                if (HookManager.hasHook('app.payment.form.processor.' + paymentProcessor.ID.toLowerCase())) {
                    paymentFormResult = HookManager.callHook('app.payment.form.processor.' + paymentProcessor.ID.toLowerCase(),
                        'processForm',
                        req,
                        paymentForm,
                        viewData);
                } else {
                    paymentFormResult = HookManager.callHook('app.payment.form.processor.default_form_processor', 'processForm');
                }

                if (paymentFormResult.error && paymentFormResult.fieldErrors) {
                    formFieldErrors.push(paymentFormResult.fieldErrors);
                }

                if (formFieldErrors.length || paymentFormResult.serverErrors) {
                    // respond with form data and errors
                    req.session.privacyCache.set('hasKatapult', '');
                    res.json({
                        form: paymentForm,
                        fieldErrors: formFieldErrors,
                        serverErrors: paymentFormResult.serverErrors ? paymentFormResult.serverErrors : [],
                        error: true
                    });
                    this.emit('route:Complete', req, res);
                    return;
                }

                var HookMgr = require('dw/system/HookMgr');
                var PaymentMgr = require('dw/order/PaymentMgr');
                // var PaymentInstrument = require('dw/order/PaymentInstrument');
                var AccountModel = require('*/cartridge/models/account');
                var OrderModel = require('*/cartridge/models/order');
                var Locale = require('dw/util/Locale');
                var basketCalculationHelpers = require('*/cartridge/scripts/helpers/basketCalculationHelpers');
                var hooksHelper = require('*/cartridge/scripts/helpers/hooks');
                var validationHelpers = require('*/cartridge/scripts/helpers/basketValidationHelpers');
                var currentBasket = BasketMgr.getCurrentBasket();
                var billingData = paymentFormResult.viewData;

                // Removes all previous payment methods before creating new one
                var paymentInstruments = currentBasket.getPaymentInstruments();
                var iterator = paymentInstruments.iterator();
                var paymentInstrument = null;
                Transaction.wrap(function () {
                    while (iterator.hasNext()) {
                        paymentInstrument = iterator.next();
                        currentBasket.removePaymentInstrument(paymentInstrument);
                    }
                });

                if (!currentBasket) {
                    delete billingData.paymentInformation;
                    req.session.privacyCache.set('hasKatapult', '');
                    res.json({
                        error: true,
                        cartError: true,
                        fieldErrors: [],
                        serverErrors: [],
                        redirectUrl: URLUtils.url('Cart-Show').toString()
                    });
                    return;
                }

                var validatedProducts = validationHelpers.validateProducts(currentBasket);
                if (validatedProducts.error) {
                    delete billingData.paymentInformation;
                    req.session.privacyCache.set('hasKatapult', '');
                    res.json({
                        error: true,
                        cartError: true,
                        fieldErrors: [],
                        serverErrors: [],
                        redirectUrl: URLUtils.url('Cart-Show').toString()
                    });
                    return;
                }

                var billingAddress = currentBasket.billingAddress;
                var billingForm = server.forms.getForm('billing');
                var paymentMethodID = billingData.paymentMethod.value;
                var result;

                Transaction.wrap(function () {
                    if (!billingAddress) {
                        billingAddress = currentBasket.createBillingAddress();
                    }

                    billingAddress.setFirstName(billingData.address.firstName.value);
                    billingAddress.setLastName(billingData.address.lastName.value);
                    billingAddress.setAddress1(billingData.address.address1.value);
                    billingAddress.setAddress2(billingData.address.address2.value);
                    billingAddress.setCity(billingData.address.city.value);
                    billingAddress.setPostalCode(billingData.address.postalCode.value);
                    if (Object.prototype.hasOwnProperty.call(billingData.address, 'stateCode')) {
                        billingAddress.setStateCode(billingData.address.stateCode.value);
                    }
                    billingAddress.setCountryCode(billingData.address.countryCode.value);

                    if (billingData.storedPaymentUUID) {
                        billingAddress.setPhone(req.currentCustomer.profile.phone);
                        currentBasket.setCustomerEmail(req.currentCustomer.profile.email);
                    } else {
                        billingAddress.setPhone(billingData.phone.value);
                        currentBasket.setCustomerEmail(billingData.email.value);
                    }

                    paymentInstrument = currentBasket.createPaymentInstrument(
                        paymentMethodIdValue, currentBasket.totalGrossPrice
                    );
                    // paymentInstrument.custom.adyenPaymentMethod = paymentMethodIdValue;
                    paymentInstrument.paymentTransaction.paymentProcessor = paymentProcessor;
                });

                // if there is no selected payment option and balance is greater than zero
                if (!paymentMethodID && currentBasket.totalGrossPrice.value > 0) {
                    var noPaymentMethod = {};
                    req.session.privacyCache.set('hasKatapult', '');
                    noPaymentMethod[billingData.paymentMethod.htmlName] = Resource.msg('error.no.selected.payment.method', 'payment', null);

                    delete billingData.paymentInformation;

                    res.json({
                        form: billingForm,
                        fieldErrors: [noPaymentMethod],
                        serverErrors: [],
                        error: true
                    });
                    return;
                }

                // check to make sure there is a payment processor
                if (!PaymentMgr.getPaymentMethod(paymentMethodID).paymentProcessor) {
                    req.session.privacyCache.set('hasKatapult', '');
                    throw new Error(Resource.msg(
                        'error.payment.processor.missing',
                        'checkout',
                        null
                    ));
                }

                var processor = PaymentMgr.getPaymentMethod(paymentMethodID).getPaymentProcessor();

                if (HookMgr.hasHook('app.payment.processor.' + processor.ID.toLowerCase())) {
                    result = HookMgr.callHook('app.payment.processor.' + processor.ID.toLowerCase(),
                        'Handle',
                        currentBasket,
                        billingData.paymentInformation);
                } else {
                    result = HookMgr.callHook('app.payment.processor.default', 'Handle');
                }

                if (result.error) {
                    delete billingData.paymentInformation;
                    req.session.privacyCache.set('hasKatapult', '');
                    res.json({
                        form: billingForm,
                        fieldErrors: result.fieldErrors,
                        serverErrors: result.serverErrors,
                        error: true
                    });
                    return;
                }

                if (HookMgr.hasHook('app.payment.form.processor.' + processor.ID.toLowerCase())) {
                    HookMgr.callHook('app.payment.form.processor.' + processor.ID.toLowerCase(),
                        'savePaymentInformation',
                        req,
                        currentBasket,
                        billingData);
                } else {
                    HookMgr.callHook('app.payment.form.processor.default', 'savePaymentInformation');
                }

                // Calculate the basket
                Transaction.wrap(function () {
                    basketCalculationHelpers.calculateTotals(currentBasket);
                });

                // Re-calculate the payments.
                var calculatedPaymentTransaction = COHelpers.calculatePaymentTransaction(
                    currentBasket
                );

                if (calculatedPaymentTransaction.error) {
                    req.session.privacyCache.set('hasKatapult', '');
                    res.json({
                        form: paymentForm,
                        fieldErrors: [],
                        serverErrors: [Resource.msg('error.technical', 'checkout', null)],
                        error: true
                    });
                    return;
                }

                var usingMultiShipping = req.session.privacyCache.get('usingMultiShipping');
                if (usingMultiShipping === true && currentBasket.shipments.length < 2) {
                    req.session.privacyCache.set('usingMultiShipping', false);
                    usingMultiShipping = false;
                }

                hooksHelper('app.customer.subscription', 'subscribeTo', [paymentForm.subscribe.checked, paymentForm.contactInfoFields.email.htmlValue], function () {});

                var currentLocale = Locale.getLocale(req.locale.id);

                var basketModel = new OrderModel(
                    currentBasket,
                    { usingMultiShipping: usingMultiShipping, countryCode: currentLocale.country, containerView: 'basket' }
                );

                var accountModel = new AccountModel(req.currentCustomer);
                var renderedStoredPaymentInstrument = COHelpers.getRenderedPaymentInstruments(
                    req,
                    accountModel
                );

                delete billingData.paymentInformation;

                res.json({
                    renderedPaymentInstruments: renderedStoredPaymentInstrument,
                    customer: accountModel,
                    order: basketModel,
                    form: billingForm,
                    error: false
                });

                this.emit('route:Complete', req, res);
            } else {
                sleep(5000);
                res.redirect(URLUtils.url('CheckoutServices-PlaceOrder').toString());
                this.emit('route:Complete', req, res);
            }
        } else {
            res.json({
                message: 'OK'
            });

            this.emit('route:Complete', req, res);
        }
    }
);

/**
 *  Place Order
 */
server.prepend('PlaceOrder', server.middleware.https, function (req, res, next) {
    var BasketMgr = require('dw/order/BasketMgr');
    var Resource = require('dw/web/Resource');
    var OrderMgr = require('dw/order/OrderMgr');
    var basketCalculationHelpers = require('*/cartridge/scripts/helpers/basketCalculationHelpers');
    var hooksHelper = require('*/cartridge/scripts/helpers/hooks');
    var COHelpers = require('*/cartridge/scripts/checkout/checkoutHelpers');
    var validationHelpers = require('*/cartridge/scripts/helpers/basketValidationHelpers');
    var addressHelpers = require('*/cartridge/scripts/helpers/addressHelpers');
    var currentBasket = BasketMgr.getCurrentBasket();
    var isKat = false;

    if (!currentBasket) {
        res.json({
            error: true,
            cartError: true,
            fieldErrors: [],
            serverErrors: [],
            redirectUrl: URLUtils.url('Cart-Show').toString()
        });
        return next();
    }

    var basketID = currentBasket.UUID;
    var isRecordExist = CustomObjectMgr.getCustomObject('katapult_transactions', basketID);

    var paymentForm = server.forms.getForm('billing');
    isKat = (paymentForm.paymentMethod.value === 'KATAPULT');

    if (!isKat) {
        if (isRecordExist) {
            CustomObjectMgr.remove(isRecordExist);
        }
        return next();
    }
    var validatedProducts = validationHelpers.validateProducts(currentBasket);
    if (validatedProducts.error) {
        res.json({
            error: true,
            cartError: true,
            fieldErrors: [],
            serverErrors: [],
            redirectUrl: URLUtils.url('Cart-Show').toString()
        });
        return next();
    }

    if (req.session.privacyCache.get('fraudDetectionStatus')) {
        res.json({
            error: true,
            cartError: true,
            redirectUrl: URLUtils.url('Error-ErrorCode', 'err', '01').toString(),
            errorMessage: Resource.msg('error.technical', 'checkout', null)
        });

        return next();
    }

    var validationOrderStatus = hooksHelper('app.validate.order', 'validateOrder', currentBasket, require('*/cartridge/scripts/hooks/validateOrder').validateOrder);
    if (validationOrderStatus.error) {
        res.json({
            error: true,
            errorMessage: validationOrderStatus.message
        });
        return next();
    }

    // Check to make sure there is a shipping address
    if (currentBasket.defaultShipment.shippingAddress === null) {
        res.json({
            error: true,
            errorStage: {
                stage: 'shipping',
                step: 'address'
            },
            errorMessage: Resource.msg('error.no.shipping.address', 'checkout', null)
        });
        return next();
    }

    // Check to make sure billing address exists
    if (!currentBasket.billingAddress) {
        res.json({
            error: true,
            errorStage: {
                stage: 'payment',
                step: 'billingAddress'
            },
            errorMessage: Resource.msg('error.no.billing.address', 'checkout', null)
        });
        return next();
    }

    // Calculate the basket for sale tax
    Transaction.wrap(function () {
        basketCalculationHelpers.calculateTotalsKatapult(currentBasket);
    });

    // Re-validates existing payment instruments
    var validPayment = COHelpers.validatePayment(req, currentBasket);
    if (validPayment.error) {
        res.json({
            error: true,
            errorStage: {
                stage: 'payment',
                step: 'paymentInstrument'
            },
            errorMessage: Resource.msg('error.payment.not.valid', 'checkout', null)
        });
        return next();
    }

    // Re-calculate the payments.
    var calculatedPaymentTransactionTotal = COHelpers.calculatePaymentTransaction(currentBasket);
    if (calculatedPaymentTransactionTotal.error) {
        res.json({
            error: true,
            errorMessage: Resource.msg('error.technical', 'checkout', null)
        });
        return next();
    }
    // Creates a new order.
    var order = COHelpers.createOrder(currentBasket);
    if (!order) {
        res.json({
            error: true,
            errorMessage: Resource.msg('error.technical', 'checkout', null)
        });
        return next();
    }
    var connectionService = require('*/cartridge/scripts/service/connectionKatapultService');
    // Set katapult values
    if (isRecordExist) {
        Transaction.wrap(function () {
            order.custom.KAT_customer_id = isRecordExist.custom.KAT_customer_id;
            order.custom.KAT_UID = isRecordExist.custom.KAT_uid;
            order.custom.KAT_katapult_id = isRecordExist.custom.KAT_uid;
            order.custom.KAT_zibby_id = isRecordExist.custom.KAT_zibby_id;
            order.setPaymentStatus(dw.order.Order.PAYMENT_STATUS_PAID);
            var paymentInstruments = order.getPaymentInstruments();
             for (var i = 0; i < paymentInstruments.length; i++) {
                    var paymentInstrument = paymentInstruments[i];
                    if (paymentInstrument.paymentMethod === 'KATAPULT') {
                        paymentInstrument.paymentTransaction.transactionID = isRecordExist.custom.KAT_uid;
                        paymentInstrument.paymentTransaction.custom.KAT_UID = isRecordExist.custom.KAT_uid;
                        paymentInstrument.paymentTransaction.custom.authCode = isRecordExist.custom.KAT_uid;
                        paymentInstrument.paymentTransaction.type = PaymentTransaction.TYPE_CAPTURE;
                    }
                }
            CustomObjectMgr.remove(isRecordExist);
        });
    }
    else
    {
    //---------------------Get katapult order information----------------//
    var callAynsOrder = {
            order_id: basketID
        };
        var getAsyncResponse = connectionService.ordersKat.callAynsOrder(JSON.stringify(callAynsOrder));
        if (getAsyncResponse.hasOwnProperty("error")) {
            res.json({
                error: true,
                errorMessage: Resource.msg('error.technical', 'checkout', null)
            });
            return next();
        } else {
            Transaction.wrap(function () {
                order.custom.KAT_customer_id = getAsyncResponse.customer_id;
                order.custom.KAT_UID = getAsyncResponse.uid;
                order.custom.KAT_katapult_id = getAsyncResponse.uid;
                order.custom.KAT_zibby_id = getAsyncResponse.zibby_id;
                order.setPaymentStatus(dw.order.Order.PAYMENT_STATUS_PAID);
                var paymentInstruments = order.getPaymentInstruments();
                 for (var i = 0; i < paymentInstruments.length; i++) {
                        var paymentInstrument = paymentInstruments[i];
                        if (paymentInstrument.paymentMethod === 'KATAPULT') {
                            paymentInstrument.paymentTransaction.transactionID = getAsyncResponse.uid;
                            paymentInstrument.paymentTransaction.custom.KAT_UID = getAsyncResponse.uid;
                            paymentInstrument.paymentTransaction.type = PaymentTransaction.TYPE_CAPTURE;
                        }
                    }
            });
        }
    }
    // Handles payment authorization
    var handlePaymentResult = COHelpers.handlePayments(order, order.orderNo);
    if (handlePaymentResult.error) {
        res.json({
            error: true,
            errorMessage: Resource.msg('error.technical', 'checkout', null)
        });
        return next();
    }

    var fraudDetectionStatus = hooksHelper('app.fraud.detection', 'fraudDetection', currentBasket, require('*/cartridge/scripts/hooks/fraudDetection').fraudDetection);
    if (fraudDetectionStatus.status === 'fail') {
        Transaction.wrap(function () { OrderMgr.failOrder(order, true); });

        // fraud detection failed
        req.session.privacyCache.set('fraudDetectionStatus', true);

        res.json({
            error: true,
            cartError: true,
            redirectUrl: URLUtils.url('Error-ErrorCode', 'err', fraudDetectionStatus.errorCode).toString(),
            errorMessage: Resource.msg('error.technical', 'checkout', null)
        });

        return next();
    }
    
    // Places the order
    var placeOrderResult = COHelpers.placeOrder(order, fraudDetectionStatus);
    if (placeOrderResult.error) {
        res.json({
            error: true,
            errorMessage: Resource.msg('error.technical', 'checkout', null)
        });
        return next();
    }

    if (req.currentCustomer.addressBook) {
        // save all used shipping addresses to address book of the logged in customer
        var allAddresses = addressHelpers.gatherShippingAddresses(order);
        allAddresses.forEach(function (address) {
            if (!addressHelpers.checkIfAddressStored(address, req.currentCustomer.addressBook.addresses)) {
                addressHelpers.saveAddress(address, req.currentCustomer, addressHelpers.generateAddressName(address));
            }
        });
    }
    if (order.getCustomerEmail()) {
        COHelpers.sendConfirmationEmail(order, req.locale.id);
    }
    var orderID = {
        order_id: order.orderNo
    };
    connectionService.ordersKat.confirm(order.custom.KAT_UID, JSON.stringify(orderID));

    // Reset usingMultiShip after successful Order placement
    req.session.privacyCache.set('usingMultiShipping', false);
    req.session.privacyCache.set('hasKatapult', '');
    res.redirect(URLUtils.url('Order-Confirm', 'ID', order.orderNo, 'token', order.orderToken).toString());

    return next();
});

module.exports = server.exports();
