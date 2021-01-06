"use strict";

/* Script Modules */
var app = require('*/cartridge/scripts/app');
var guard = require('*/cartridge/scripts/guard');
var formatMoney = require('dw/util/StringUtils').formatMoney;
var CustomObjectMgr = require('dw/object/CustomObjectMgr');
var BasketMgr = require('dw/order/BasketMgr');
var Transaction = require('dw/system/Transaction');
var URLUtils = require('dw/web/URLUtils');
function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}
function payment() {
    var req = request;   

    if (req.httpParameterMap.requestBodyAsString && req.httpMethod == "POST") {
        var bodyObject = JSON.parse(req.httpParameterMap.requestBodyAsString);
        // If it comes from katapult
        if (bodyObject.zibby_id) {
            var basket = req.httpParameterMap.basket.stringValue;
            var isRecordExist = CustomObjectMgr.getCustomObject(
                "katapult_transactions",
                basket
            );
            if (!isRecordExist) {
                Transaction.begin();
                var transaction = CustomObjectMgr.createCustomObject(
                "katapult_transactions",
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
            let r = require('*/cartridge/scripts/util/Response');

            r.renderJSON({ message: "OK" });
            return;
        } else { // else go to the next controller
          return
        }            
    } else if (req.httpHeaders.origin != "https://sandbox.katapult.com") {
        sleep(5000);
        var basketUUID =  BasketMgr.getCurrentBasket().UUID;
        var placeOrderResult = app.getController('COPlaceOrder').Start();
        if (placeOrderResult.error) {
            return;
        } else {
            showConfirmation(placeOrderResult.Order, basketUUID);
        }
    } else {
        let r = require('*/cartridge/scripts/util/Response');

        r.renderJSON({
            success: "OK",
            message: "Teste"
        });
        return;

    }    

        //response.redirect(dw.web.URLUtils.https('COBilling-Billing'));
        //https://zzrn-013.sandbox.us01.dx.commercecloud.salesforce.com/on/demandware.store/Sites-SiteGenesis-Site/en_US/KatapultOK-Payment
}

/**
 * Renders the order confirmation page after successful order
 * creation. If a nonregistered customer has checked out, the confirmation page
 * provides a "Create Account" form. This function handles the
 * account creation.
 */
function showConfirmation(order, basketID) {
    var CustomObjectMgr = require('dw/object/CustomObjectMgr');
    var isRecordExist = CustomObjectMgr.getCustomObject('katapult_transactions', basketID);
    
    isKat = (order.paymentInstrument.paymentMethod == 'KATAPULT') ? true : false;

    if (!isKat){
        if (isRecordExist) {
            CustomObjectMgr.remove(isRecordExist);
        }
    }

    if (isRecordExist) {
        Transaction.wrap(function () {
            order.custom.KAT_customer_id = isRecordExist.custom.KAT_customer_id;
            order.custom.KAT_UID = isRecordExist.custom.KAT_uid;
            order.custom.KAT_katapult_id = isRecordExist.custom.KAT_uid;
            order.custom.KAT_zibby_id = isRecordExist.custom.KAT_zibby_id;
            order.setPaymentStatus(dw.order.Order.PAYMENT_STATUS_PAID);
            var paymentInstruments = order.getPaymentInstruments('KATAPULT');
            if (paymentInstruments) {
                for each (let paymentInstrument in paymentInstruments) {
                    if (paymentInstrument.paymentMethod.equals("KATAPULT")) {
                        paymentInstrument.paymentTransaction.transactionID = isRecordExist.custom.KAT_uid;
                    }
                }
            }
            CustomObjectMgr.remove(isRecordExist);
         });
    }

    if (!customer.authenticated) {
        // Initializes the account creation form for guest checkouts by populating the first and last name with the
        // used billing address.
        var customerForm = app.getForm('profile.customer');
        customerForm.setValue('firstname', order.billingAddress.firstName);
        customerForm.setValue('lastname', order.billingAddress.lastName);
        customerForm.setValue('email', order.customerEmail);
        customerForm.setValue('orderNo', order.orderNo);
    }

    var connectionService = require('*/cartridge/scripts/service/connectionKatapultService');
    var orderID = {
        "order_id" : order.orderNo
    };
    connectionService.ordersKat.confirm(order.custom.KAT_UID, JSON.stringify(orderID));

    app.getForm('profile.login.passwordconfirm').clear();
    app.getForm('profile.login.password').clear();

    app.getView({
        Order: order,
        ContinueURL: URLUtils.https('Account-RegistrationForm') // needed by registration form after anonymous checkouts
    }).render('checkout/confirmation/confirmation');
}

exports.Payment = guard.ensure(['https'], payment);
//exports.Payment = guard.ensure(['post', 'https'], payment);