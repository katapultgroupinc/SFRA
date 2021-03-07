var Log = require('dw/system/Logger');
var connectionService = require('*/cartridge/scripts/service/connectionKatapultService');
/**
 * Katapult service API Call.
 * @param apiEndPoint - API EndPoint.
 * @param contentObj - Request Content.
 * @return {object} callResult.
 */
function post(apiEndPoint, contentObj) {
    try {     

        var callResult = connectionService.ordersKat.connect(contentObj, apiEndPoint);

        return callResult;
    } catch (ex) {
        Log.error('Failed to make GET request to Experian' + ex);
        return null;
    }
}

module.exports = {
    post: post
};