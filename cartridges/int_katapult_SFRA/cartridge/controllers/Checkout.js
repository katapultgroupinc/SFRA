var server = require("server");
var checkout = module.superModule;
    server.extend(checkout);
/**
 * Katapult prepare payments.
 */
server.prepend('Begin', function (req, res, next) {
    var katapultHelpers = require('*/cartridge/scripts/helpers/katapultHelpers');
    var enableKAT = katapultHelpers.getCustomLeasable();
    // clear katapult verification
    req.session.privacyCache.set('hasKatapult', "");
    res.json({
        success: true,
        enableKAT: enableKAT
    });
    next();
});

module.exports = server.exports();
