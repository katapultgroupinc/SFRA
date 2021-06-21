var Response = require('dw/system/Response');
var Site = require('dw/system/Site');
var KAT_environment = Site.current.getCustomPreferenceValue('KAT_environment');

/**
*  Formating Katapul URL
*/
KAT_environment = KAT_environment.trim();
var index = KAT_environment.lastIndexOf("/",KAT_environment.length);

if (KAT_environment[KAT_environment.length-1] == "/") {
  KAT_environment = KAT_environment.slice(0,index);
}
/**
 * Sets response headers
 * @param {httpResponse} res Response object
 */
 function setResponseHeaders(res) {
    res.setHttpHeader(Response.ACCESS_CONTROL_ALLOW_ORIGIN, KAT_environment);
    res.setHttpHeader(Response.ACCESS_CONTROL_ALLOW_METHODS, 'POST');
    res.setHttpHeader(Response.ACCESS_CONTROL_ALLOW_CREDENTIALS, 'true');
    res.setHttpHeader(Response.ACCESS_CONTROL_ALLOW_HEADERS, 'content-type');
}

module.exports = {
    setResponseHeaders: setResponseHeaders
};