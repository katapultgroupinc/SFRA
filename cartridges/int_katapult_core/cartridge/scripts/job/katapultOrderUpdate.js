'use strict';
var OrderMgr = require('dw/order/OrderMgr');
var Order = require('dw/order/Order');
var Logger = require('dw/system/Logger');
var ORDER_STATUS_CREATED = Order.ORDER_STATUS_CREATED;
var ORDER_STATUS_NEW = Order.ORDER_STATUS_NEW;
var ORDER_STATUS_OPEN = Order.ORDER_STATUS_OPEN;
var SHIPPING_STATUS_SHIPPED = Order.SHIPPING_STATUS_SHIPPED;
var ORDER_STATUS_CANCELLED = Order.ORDER_STATUS_CANCELLED;
var ORDER_STATUS_FAILED = Order.ORDER_STATUS_FAILED;
var ORDER_STATUS_COMPLETED = Order.ORDER_STATUS_COMPLETED;
var Transaction = require('dw/system/Transaction');

 /**
 * Katapult Set Orders as Completed.
 */
function complete(){
    var orders = OrderMgr.searchOrders(
        "custom.KAT_completed != 'true'  AND " +         
        "status = " + ORDER_STATUS_COMPLETED, " creationDate asc");

	while (orders.hasNext()) {
        var order = orders.next();
        var paymentMethod = order.paymentInstrument.paymentMethod;
        if (paymentMethod == "KATAPULT" && order.custom.KAT_completed !== 'true') {
            Transaction.wrap(function(){               
                order.custom.KAT_completed = 'true';               
            });
            Logger.info("--> Katapult completed process " + order.orderNo + " -- kat_uid -->" + order.custom.KAT_UID);
        }
    }
}

 /**
 * Katapult Set Orders as Shipped.
 */
function shipping(){
    var connectionService = require('*/cartridge/scripts/service/connectionKatapultService');
    var orders = OrderMgr.searchOrders(
        "custom.KAT_UID != '' AND " +
        "custom.KAT_shipped != 'true' AND " +
        "(status = " + ORDER_STATUS_CREATED + " OR " + 
        "status = " + ORDER_STATUS_NEW + " OR " + 
        "status = " + ORDER_STATUS_OPEN + ") AND " + 
        "shippingStatus = " + SHIPPING_STATUS_SHIPPED, " creationDate asc");

    var ordersRes = [];
	while (orders.hasNext()) {
        var order = orders.next();
        var paymentMethod = order.paymentInstrument.paymentMethod;
        if (paymentMethod == "KATAPULT") {
            if (order.custom.KAT_completed !== 'true' && order.custom.KAT_shipped !== 'true') {
                ordersRes.push({
                    order: order
                });
            }
            Transaction.wrap(function(){               
                order.custom.KAT_shipped = 'true';               
            });            
        }
    }
    var i = 0;
    for (i in ordersRes) {
        try {
            var kat_uid = ordersRes[i].order.custom.KAT_UID;
            var orderNo = ordersRes[i].order.orderNo;
            var dateDelivered = ordersRes[i].order.defaultShipment.lastModified;
            var itemsObj  = {
                items:[],
                delivery_date: dateDelivered,
            }
            var t = 0;
            for (t in ordersRes[i].order.productLineItems) {              
                    itemsObj.items.push({
                        sku: ordersRes[i].order.productLineItems[t].productID,
                        display_name: ordersRes[i].order.productLineItems[t].productName,
                        unit_price: ordersRes[i].order.productLineItems[t].price.value,
                        quantity: ordersRes[i].order.productLineItems[t].quantityValue
                    });
            }
        
            if (kat_uid){
                var callResult = connectionService.ordersKat.shipping(JSON.stringify(itemsObj), kat_uid);
            } else {
                throw new Error('kat_uid cannot be null');
            }
            
            
            if (callResult.hasOwnProperty("error")) {
                Logger.info("--> ERROR " + orderNo + callResult.error.code + " " +callResult.error.message + ". To try again uncheck KAT_shipped at Order.");
            } else {
                Logger.info("--> Shipping date updated in order " + orderNo + " -- kat_uid -->" + kat_uid);
            }
            
        } catch (e) {
            Logger.error('--> Unable to update shipping date in order ' + orderNo + " -- kat_uid -->" + kat_uid + '--'+ e.message  + ". To try again uncheck KAT_shipped at Order.");
        }
    }
}

 /**
 * Katapult Set Orders as Canceled.
 */
function cancel(){
    var connectionService = require('*/cartridge/scripts/service/connectionKatapultService');
    var orders = OrderMgr.searchOrders(
        "custom.KAT_completed != 'true' AND " + 
        "(status = " + ORDER_STATUS_CANCELLED + " OR " + 
        "status = " + ORDER_STATUS_FAILED + ")", " creationDate asc");
    var ordersRes = [];
    while (orders.hasNext()) {
        var order = orders.next();
        var paymentMethod = order.paymentInstrument.paymentMethod;
        if (paymentMethod == "KATAPULT") {
            if (order.custom.KAT_completed !== 'true') {
                ordersRes.push({
                    order: order
                });
                Transaction.wrap(function(){              
                    order.custom.KAT_completed = 'true';               
                });
            }
        }
    }
    var i = 0;
    for (i in ordersRes) {
        try {
            var kat_uid = ordersRes[i].order.custom.KAT_UID;
            var orderNo = ordersRes[i].order.orderNo;

            if (kat_uid){
                var callResult = connectionService.ordersKat.cancel(kat_uid);
            } else {
                throw new Error('kat_uid cannot be null');
            }
            
            if (callResult.hasOwnProperty("error")) {
                Logger.info("--> ERROR cancelling order " + orderNo + callResult.error.code + " " +callResult.error.message + ". To try again uncheck KAT_completed at Order.");
            } else {
                Logger.info("--> Canceled order " + orderNo + " -- kat_uid -->" + kat_uid);
            }
            
        } catch (error) {
            Logger.error('--> Unable to cancel order ' + orderNo + " -- kat_uid -->" + kat_uid + '--'+ error.message);
        }
    }  
}
 /**
 * Katapult Cancel single Item.
 */
function cancelItem () {
    var connectionService = require('*/cartridge/scripts/service/connectionKatapultService');
    var orders = OrderMgr.searchOrders(
        "custom.KAT_UID != '' AND " +
        "status = " + ORDER_STATUS_CREATED + " OR " + 
        "status = " + ORDER_STATUS_NEW + " OR " + 
        "status = " + ORDER_STATUS_OPEN, " creationDate asc");

        while (orders.hasNext()) {
            var order = orders.next();
            var orderNo = order.orderNo;
            var i = 0;
            for (i in order.productLineItems) {
                var itemsStatus = order.productLineItems[i].externalLineItemStatus;
                var KAT_cancelItem = order.productLineItems[i].custom.KAT_cancelItem;
                var itemsObj  = {
                    items:[]
                }
                if (itemsStatus == "canceled" || KAT_cancelItem == true) {
                        itemsObj.items.push({
                        sku: order.productLineItems[i].productID,
                        display_name: order.productLineItems[i].productName,
                        unit_price: order.productLineItems[i].price.value,
                        quantity: order.productLineItems[i].quantityValue
                    })
                    if (itemsObj.items.length > 0 && order.productLineItems.length > 1) {
                        var kat_uid = order.custom.KAT_UID
                        var callResult = connectionService.ordersKat.cancelItem(JSON.stringify(itemsObj), kat_uid);
                        if (callResult.hasOwnProperty("error")) {
                            Logger.info("--> ERROR " + orderNo + callResult.error.code + " " +callResult.error.message + ". Try again.");
                        } else {
                            Logger.info("The items in the order" + orderNo + "was canceled successfully.");
                        }
                    } else {
                        if (order.productLineItems.length == 1) {
                            Logger.info("--> ERROR. " + orderNo + " You cannot cancel a item in this order. For orders that have just one product you have to cancel the entire order."); 
                        }
                        Logger.info("--> ERROR. " + orderNo + " You cannot cancel a item in this order");
                    } 
                    
            }

        }

    }
}

module.exports = {
    shipping: shipping,
    cancel: cancel,
    complete: complete,
    cancelItem: cancelItem
};