'use strict';

var server = require('server');
var checkout = module.superModule;
server.extend(checkout);
var Transaction = require('dw/system/Transaction');
var csrfProtection = require('*/cartridge/scripts/middleware/csrf');
var consentTracking = require('*/cartridge/scripts/middleware/consentTracking');
/**
 * Main entry point for Checkout
 */

  /**
  * Checkout-Login : The Checkout-Login endpoint will render a checkout landing page that allows the shopper to select checkout as guest or as returning shopper
  * @name Base/Checkout-Login
  * @function
  * @memberof Checkout
  * @param {middleware} - server.middleware.https
  * @param {middleware} - consentTracking.consent
  * @param {middleware} - csrfProtection.generateToken
  * @param {category} - sensitive
  * @param {renders} - isml
  * @param {serverfunction} - get
  */
server.get(
    'Login',
    server.middleware.https,
    consentTracking.consent,
    csrfProtection.generateToken,
    function (req, res, next) {
        var BasketMgr = require('dw/order/BasketMgr');
        var ProductLineItemsModel = require('*/cartridge/models/productLineItems');
        var TotalsModel = require('*/cartridge/models/totals');
        var URLUtils = require('dw/web/URLUtils');
        var reportingUrlsHelper = require('*/cartridge/scripts/reportingUrls');
        var validationHelpers = require('*/cartridge/scripts/helpers/basketValidationHelpers');

        var currentBasket = BasketMgr.getCurrentBasket();
        var reportingURLs;

        if (!currentBasket) {
            res.redirect(URLUtils.url('Cart-Show'));
            return next();
        }

        var validatedProducts = validationHelpers.validateProducts(currentBasket);
        if (validatedProducts.error) {
            res.redirect(URLUtils.url('Cart-Show'));
            return next();
        }

        if (req.currentCustomer.profile) {
            res.redirect(URLUtils.url('Checkout-Begin'));
        } else {
            var rememberMe = false;
            var userName = '';
            var actionUrl = URLUtils.url('Account-Login', 'rurl', 2);
            var totalsModel = new TotalsModel(currentBasket);
            var details = {
                subTotal: totalsModel.subTotal,
                totalQuantity: ProductLineItemsModel.getTotalQuantity(
                    currentBasket.productLineItems
                )
            };

            if (req.currentCustomer.credentials) {
                rememberMe = true;
                userName = req.currentCustomer.credentials.username;
            }

            reportingURLs = reportingUrlsHelper.getCheckoutReportingURLs(
                currentBasket.UUID,
                1,
                'CheckoutMethod'
            );

            res.render('/checkout/checkoutLogin', {
                rememberMe: rememberMe,
                userName: userName,
                actionUrl: actionUrl,
                details: details,
                reportingURLs: reportingURLs,
                oAuthReentryEndpoint: 2
            });
        }

        return next();
    }
);
/**
 * Katapult prepare payments.
 */
server.prepend('Begin', function (req, res, next) {
    var katapultHelpers = require('*/cartridge/scripts/helpers/katapultHelpers');
    var enableKAT = katapultHelpers.getCustomLeasable();
    // clear katapult verification
    req.session.privacyCache.set('hasKatapult', '');
    var BasketMgr = require('dw/order/BasketMgr');
    var currentBasket = BasketMgr.getCurrentBasket();
    var KatapultPI = currentBasket.getPaymentInstruments('KATAPULT');

    if(KatapultPI.length > 0) {
        Transaction.wrap(function () {
            currentBasket.removeAllPaymentInstruments();
        });
    }

    res.json({
        success: true,
        enableKAT: enableKAT
    });
    next();
});

module.exports = server.exports();
