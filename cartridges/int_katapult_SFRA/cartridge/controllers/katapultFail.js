var server = require("server");

/**
 * Checkout begin redirect.
 */
server.get("redirect", function (req, res, next) {
    var URLUtils = require('dw/web/URLUtils');
    var urlCancel = decodeURIComponent(URLUtils.url('Checkout-Begin?stage=payment#payment'));

    res.redirect(urlCancel);
    next();
});

module.exports = server.exports();
