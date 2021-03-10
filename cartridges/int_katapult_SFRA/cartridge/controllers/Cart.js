'use strict';

/*
eslint no-undef: "off"
*/
var server = require('server');
var cart = module.superModule;
server.extend(cart);

/**
 * Katapult get basket to generate checkout to Katapult.
 * @return {object} JSON object.
 */
server.get('infoShop', server.middleware.https, function (req, res, next) {
    var BasketMgr = require('dw/order/BasketMgr');
    var CartModel = require('*/cartridge/models/cart');
    var OrderModel = require('*/cartridge/models/order');
    var COHelpers = require('*/cartridge/scripts/checkout/checkoutHelpers');
    var Locale = require('dw/util/Locale');
    var URLUtils = require('dw/web/URLUtils');
    var currentBasket = BasketMgr.getCurrentBasket();
    var basketId = BasketMgr.getCurrentBasket().getUUID();
    var basketModel = new CartModel(currentBasket);
    var allValid = COHelpers.ensureValidShipments(currentBasket);
    var currentCustomer = req.currentCustomer.raw;
    var currentLocale = Locale.getLocale(req.locale.id);
    var usingMultiShipping = req.session.privacyCache.get('usingMultiShipping');

    if (currentBasket) {
        var itemsBasket = currentBasket.productLineItems;
        var itemsCart = [];
        for (var i = 0; i < itemsBasket.length; i += 1) {
            var isLeasable = itemsBasket[i].product.custom.KAT_isLeasable;
            if (empty(isLeasable) || isLeasable === false) {
                isLeasable = false;
            }

            var price = itemsBasket[i].basePrice.value.toFixed(2);

            itemsCart.push({
                display_name: itemsBasket[i].productName,
                sku: itemsBasket[i].productID,
                unit_price: price,
                quantity: itemsBasket[i].quantity.value,
                leasable: isLeasable
            });

            var isEmpty = itemsBasket[i].optionProductLineItems.empty;

            if (isEmpty === false) {
                var wPrice = itemsBasket[i].optionProductLineItems[0].basePrice.value.toFixed(2);

                itemsCart[itemsCart.length - 1].warranty = {
                    unit_price: wPrice,
                    display_name: itemsBasket[i].optionProductLineItems[0].productName,
                    sku: itemsBasket[i].optionProductLineItems[0].UUID
                };
            }
        }

        var orderModel = new OrderModel(
            currentBasket,
            {
                customer: currentCustomer,
                usingMultiShipping: usingMultiShipping,
                shippable: allValid,
                countryCode: currentLocale.country,
                containerView: 'basket'
            }
        );

        res.json({
            success: true,
            basketModel: basketModel,
            basketId: basketId,
            order: orderModel,
            itemsCart: itemsCart,
            redirectUrlFail: URLUtils.url('Cart-Show').toString(),
            msg: 'The basket was found'
        });
    } else {
        res.json({
            success: true,
            msg: 'No current basket was found.'
        });
    }

    next();
});
module.exports = server.exports();
