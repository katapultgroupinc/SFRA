'use strict';

var BasketMgr = require('dw/order/BasketMgr');
/**
 * Katapult check leaseable products.
 * @return {boolean} true or false.
 */
function getCustomLeasable() {
    var currentBasket = BasketMgr.getCurrentBasket();
    var itemsFeatures = currentBasket.productLineItems;
    var itemsLeasable = 0;
    var index = 0;
    for (index in itemsFeatures) {
        var Kat_isLeasable = itemsFeatures[index].product.custom.KAT_isLeasable;
        if (Kat_isLeasable || Kat_isLeasable == true) {
            itemsLeasable++;
        }
    }

    if(itemsLeasable >= 1){
        var enableKatapult = true;
    }else{
        var enableKatapult = false;
    }

    return enableKatapult;
}

module.exports = {
    getCustomLeasable: getCustomLeasable
};
