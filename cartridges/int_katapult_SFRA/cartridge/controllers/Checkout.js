'use strict';

var server = require('server');
var checkout = module.superModule;
server.extend(checkout);
var Transaction = require('dw/system/Transaction');

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
    Transaction.wrap(function () {
        currentBasket.removeAllPaymentInstruments();
    });

    res.json({
        success: true,
        enableKAT: enableKAT
    });
    next();
});

module.exports = server.exports();
