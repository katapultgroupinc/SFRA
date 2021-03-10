'use strict';

/*
eslint no-undef: "off"
*/
var OrderMgr = require('dw/order/OrderMgr');
var Transaction = require('dw/system/Transaction');
var guard = require('*/cartridge/scripts/guard');

/**
 * Katapult Order Item cancelation.
 * oid - Order Number.
 * oli - Order line item product Id to cancel.
 */
function cancelItem() {
    var orderId = request.httpParameterMap.oid.getStringValue();
    var orderToken = request.httpParameterMap.otoken.getStringValue() ? request.httpParameterMap.otoken.getStringValue() : OrderMgr.getOrder(orderId).getOrderToken();
    var order = OrderMgr.getOrder(orderId, orderToken);
    var lineItem = request.httpParameterMap.oli.getStringValue();
    Transaction.wrap(function () {
        for (var i = 0; i < order.productLineItems.length; i += 1) {
            if (lineItem === order.productLineItems[i].productID) {
                var line = order.productLineItems[i];

                line.externalLineItemStatus = 'canceled';
                line.custom.KAT_cancelItem = true;
            }
        }
    });
    var r = require('*/cartridge/scripts/util/Response');
    r.renderJSON({ message: 'Item(s) at ' + orderId + ' were canceled.' });
}

exports.cancelItem = guard.ensure(['get', 'https'], cancelItem);
