var OrderMgr = require("dw/order/OrderMgr");
var Transaction = require("dw/system/Transaction");
var guard = require('*/cartridge/scripts/guard');

/**
 * Katapult Order Item cancelation.
 * @param httpParameterMap.oid - Order Number.
 * @param httpParameterMap.oli - Order line item product Id to cancel.
 * @return {object} JSON object with canceled Items.
 */
function cancelItem() {
  var orderId = request.httpParameterMap.oid.getStringValue();
  var order = OrderMgr.getOrder(orderId);
  var lineItem = request.httpParameterMap.oli.getStringValue();

    for (i in order.productLineItems) {
      if (lineItem === order.productLineItems[i].productID) {
        Transaction.wrap(function () {
          order.productLineItems[i].externalLineItemStatus = "canceled";
          order.productLineItems[i].custom.KAT_cancelItem = true;
        });
      }
    }
  let r = require('*/cartridge/scripts/util/Response');
  r.renderJSON({ message: "Seu(s) item(ns) na ordem " + orderId + " foram cancelados com sucesso." });
}

exports.cancelItem = guard.ensure(['get', 'https'], cancelItem);
