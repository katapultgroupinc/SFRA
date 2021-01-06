var HTTPClient = require('dw/net/HTTPClient');
var Log = require('dw/system/Logger');
var Site = require('dw/system/Site');
var KAT_token_api = Site.current.getCustomPreferenceValue('KAT_APIToken');
var KAT_url_api = Site.current.getCustomPreferenceValue('KAT_environment');


function post(apiEndPoint, contentObj) {
    try {
        var client = new HTTPClient();

        client.setTimeout(30000.0);
        client.setRequestHeader('Accept', 'application/json');
        client.setRequestHeader('Authorization', 'Bearer ' + KAT_token_api);
        client.setRequestHeader('Content-Type', 'application/json');
        client.open('POST', KAT_url_api + apiEndPoint);
        client.send(contentObj);

        return client;
    } catch (ex) {
        Log.error('Failed to make GET request to Experian' + ex);
        return null;
    }
}

module.exports = {
    post: post
};