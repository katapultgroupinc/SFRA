"use strict";
var server = require("server");
var OrderMgr = require("dw/order/OrderMgr");
var Order = require("dw/order/Order");
var Logger = require("dw/system/Logger");
var Transaction = require("dw/system/Transaction");

server.get("cancelItem", function (req, res, next) {
    var orderId = req.querystring.oid;
  var order = OrderMgr.getOrder(orderId);
  var lineItem = req.querystring.oli;

  
    for (i in order.productLineItems) {
      if (lineItem == order.productLineItems[i].productID) {
        Transaction.wrap(function () {
        order.productLineItems[i].externalLineItemStatus = "canceled";
        order.productLineItems[i].custom.KAT_cancelItem = true;
    });
      }
    }
 

  res.json({
    return: ["Seu(s) item(ns) na ordem " + orderId + " foram cancelados com sucesso." ]
});

  next();
});

module.exports = server.exports();
