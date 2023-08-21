'use strict';

var HookMgr = require('dw/system/HookMgr');

/**
 * Calculate sales taxes
 * @param {dw.order.Basket} basket - current basket
 * @returns {Object} - object describing taxes that needs to be applied
 */
function calculateTaxes(basket) {
    var hooksHelper = require('*/cartridge/scripts/helpers/hooks');
    return hooksHelper('app.basket.taxes', 'calculateTaxes', basket, require('*/cartridge/scripts/hooks/taxes').calculateTaxes);
}

/**
 * Calculate all totals as well as shipping and taxes
 * @param {dw.order.Basket} basket - current basket
 */
function calculateTotals(basket) {
    HookMgr.callHook('dw.order.calculate', 'calculate', basket);
}
/**
 * Calculate sales taxes
 * @param {dw.order.Basket} basket - current basket
 * @returns {Object} - object describing taxes that needs to be applied
 */
 function calculateTaxeskatapult(basket) {
    var hooksHelper = require('*/cartridge/scripts/helpers/hooks');
    return hooksHelper('app.basket.taxes', 'calculateTaxes', basket, require('*/cartridge/scripts/hooks/taxesKatapult').calculateTaxes);
}

/**
 * Calculate all totals as well as shipping and taxes
 * @param {dw.order.Basket} basket - current basket
 */
function calculateTotalsKatapult(basket) {
    HookMgr.callHook('dw.order.calculateKatapult', 'calculate', basket);
}

module.exports = {
    calculateTotals: calculateTotals,
    calculateTaxes: calculateTaxes,
    calculateTotalsKatapult: calculateTotalsKatapult,
    calculateTaxeskatapult: calculateTaxeskatapult
};
