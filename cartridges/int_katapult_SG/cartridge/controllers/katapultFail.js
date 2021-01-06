"use strict";

/* Script Modules */
var guard = require('*/cartridge/scripts/guard');

function redirect() {
    var URLUtils = require('dw/web/URLUtils');
    var urlCancel = decodeURIComponent(URLUtils.url('COShipping'));

    response.redirect(urlCancel);
};

exports.redirect = guard.ensure(['get', 'https'], redirect);