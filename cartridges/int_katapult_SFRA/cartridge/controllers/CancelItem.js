'use strict';

var server = require('server');
var OrderMgr = require('dw/order/OrderMgr');
var Transaction = require('dw/system/Transaction');

/**
 * Katapult Order Item cancelation.
 * @param querystring.oid - Order Number.
 * @param querystring.oli - Order line item product Id to cancel.
 * @return {object} JSON object with canceled Items.
 */
server.get('cancelItem', function (req, res, next) {
    var orderId = req.querystring.oid;
    var orderToken = req.querystring.otoken ? req.querystring.otoken : OrderMgr.getOrder(orderId).getOrderToken();
    var order = OrderMgr.getOrder(orderId, orderToken);
    var lineItem = req.querystring.oli;
    Transaction.wrap(function () {
        for (var i = 0; i < order.productLineItems.length; i += 1) {
            if (lineItem === order.productLineItems[i].productID) {
                order.productLineItems[i].externalLineItemStatus = 'canceled';
                order.productLineItems[i].custom.KAT_cancelItem = true;
            }
        }
    });

    res.json({
        success: true,
        msg: 'Update a item custom attribute as a canceled',
        return: 'item(s) at ' + orderId + ' cancelled.'
    });

    next();
});

module.exports = server.exports();
