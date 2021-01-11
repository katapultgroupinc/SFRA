var server = require('server');

/**
 * Endpoint to render guarantee template
 */
server.get('Show', function (req, res, next) {
    var ContentMgr = require('dw/content/ContentMgr');
    var ContentModel = require('*/cartridge/models/content');

    var apiContent = ContentMgr.getContent('GuaranteeKatapult');
    var content = new ContentModel(
        apiContent,
        'components/content/contentAssetInc'
    );
    res.render(content.template, { content: content });

    next();
});

module.exports = server.exports();
