/* Script Modules */
var app = require('*/cartridge/scripts/app');
var guard = require('*/cartridge/scripts/guard');
var formatMoney = require('dw/util/StringUtils').formatMoney;

/**
 * Katapult Shipping discount.
 * @return {object} JSON object Shipping discount.
 */
function getShippingLevelDiscountTotal(lineItemContainer) {
    var totalExcludingShippingDiscount = lineItemContainer.shippingTotalPrice;
    var totalIncludingShippingDiscount = lineItemContainer.adjustedShippingTotalPrice;
    var shippingDiscount = totalExcludingShippingDiscount.subtract(totalIncludingShippingDiscount);
    return {
        value: shippingDiscount.value,
        formatted: formatMoney(shippingDiscount)
    };
}

/**
 * Katapult Order discount.
 * @return {object} JSON object order discount.
 */
function getOrderLevelDiscountTotal(lineItemContainer) {
    var totalExcludingOrderDiscount = lineItemContainer.getAdjustedMerchandizeTotalPrice(false);
    var totalIncludingOrderDiscount = lineItemContainer.getAdjustedMerchandizeTotalPrice(true);
    var orderDiscount = totalExcludingOrderDiscount.subtract(totalIncludingOrderDiscount);
    return {
        value: orderDiscount.value,
        formatted: formatMoney(orderDiscount)
    };
}

/**
 * Katapult get basket to generate checkout to Katapult.
 * @return {object} JSON object.
 */
    function infoShop() {
        var BasketMgr = require('dw/order/BasketMgr');
        var URLUtils = require('dw/web/URLUtils');
        var currentBasket = BasketMgr.getCurrentBasket();
        var basketId = BasketMgr.getCurrentBasket().getUUID();
        var currentCustomer = { profile: { email: "" } };
        var currentCustomerData = customer.getProfile();// .getCustomer();
        currentCustomer.profile.email = currentCustomerData ? currentCustomerData.email.toString() : currentBasket.customerEmail;
        var modelBasket = { items: [], basketId: basketId };
        var modelOrder = {
 shipping: [], billing: { billingAddress: {} }, totals: { totalShippingCost: {}, orderLevelDiscountTotal: {}, shippingLevelDiscountTotal: {} }, priceTotal: 0
};
        var shipmentsInt = currentBasket.shipments.iterator();
        while (shipmentsInt.hasNext()) {
            var shipmentLine = shipmentsInt.next();
            modelOrder.shipping.push({
shippingAddress: {
                firstName: shipmentLine.shippingAddress.firstName,
                lastName: shipmentLine.shippingAddress.lastName,
                address1: shipmentLine.shippingAddress.address1,
                address2: shipmentLine.shippingAddress.address2,
                city: shipmentLine.shippingAddress.city,
                stateCode: shipmentLine.shippingAddress.stateCode,
                countryCode: shipmentLine.shippingAddress.countryCode.displayValue,
                postalCode: shipmentLine.shippingAddress.postalCode,
                phone: shipmentLine.shippingAddress.phone
            }
        });
        }
        var billingA = currentBasket.billingAddress ? currentBasket.billingAddress : currentBasket.shipments[0].shippingAddress;
        modelOrder.billing.billingAddress = {
            firstName: billingA.firstName,
            lastName: billingA.lastName,
            address1: billingA.address1,
            address2: billingA.address2,
            city: billingA.city,
            stateCode: billingA.stateCode,
            countryCode: billingA.countryCode.displayValue,
            postalCode: billingA.postalCode,
            phone: billingA.phone
        };
        modelOrder.totals.totalShippingCost = currentBasket.adjustedShippingTotalGrossPrice.value;
        modelOrder.totals.orderLevelDiscountTotal = getOrderLevelDiscountTotal(currentBasket);
        modelOrder.totals.shippingLevelDiscountTotal = getShippingLevelDiscountTotal(currentBasket);
        modelOrder.priceTotal = currentBasket.totalGrossPrice.value;

        var itemsBasket = currentBasket.productLineItems;
        var itemsCart = [];
        var i = 0;
        for (i in itemsBasket) {
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

        let res = require('*/cartridge/scripts/util/Response');
        res.renderJSON({
            success: true,
            account: currentCustomer,
            basketModel: modelBasket,
            basketId: basketId,
            itemsCart: itemsCart,
            order: modelOrder,
            redirectUrlFail: URLUtils.url('Cart-Show').toString()
        });
    }
    exports.infoShop = guard.ensure(['get', 'https'], infoShop);
