'use strict';

/*
eslint no-undef: "off"
*/
/* Script Modules */
var guard = require('*/cartridge/scripts/guard');
/**
 * Katapult payment fails.
 * @redirect checkout step.
 */
function redirect() {
    var URLUtils = require('dw/web/URLUtils');
    var urlCancel = decodeURIComponent(URLUtils.url('COShipping'));

    response.redirect(urlCancel);
}
exports.redirect = guard.ensure(['get', 'https'], redirect);
