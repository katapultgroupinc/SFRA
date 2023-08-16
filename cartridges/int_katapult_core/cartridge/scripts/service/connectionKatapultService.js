/* eslint-env es6 */

'use strict';
var system = require('dw/system');
var Site = require('dw/system/Site');

var LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');
/**
 * Creates a Local Services Framework service definition
 *
 * @returns {dw.svc.Service} - The created service definition.
 */
function getKatapultServiceDefinition() {

    return LocalServiceRegistry.createService('katapultService', {

        /**
         * A callback function to configure HTTP request parameters before
         * a call is made to Stripe web service
         *
         * @param {dw.svc.Service} svc Service instance
         * @param {string} requestObject - Request object, containing the end point, query string params, payload etc.
         * @returns {string} - The body of HTTP request
         */
        createRequest: function(svc, requestObject) {
            var KAT_token_api = Site.current.getCustomPreferenceValue('KAT_APIToken');
            
            svc.addHeader('Content-Type', 'application/json');
            svc.addHeader('Authorization', 'Bearer ' + KAT_token_api)
            svc;

            var URL = svc.configuration.credential.URL;
            URL += requestObject.endpoint;

            svc.setURL(URL);

            if (requestObject.httpMethod) {
                svc.setRequestMethod(requestObject.httpMethod);
            }

            if (requestObject.payload) {
                return requestObject.payload;
            }
            return null;
        },

        /**
         * A callback function to parse Katapult web service response
         *
         * @param {dw.svc.Service} svc - Service instance
         * @param {dw.net.HTTPClient} httpClient - HTTP client instance
         * @returns {string} - Response body in case of a successful request or null
         */
        parseResponse: function(svc, httpClient) {
            return JSON.parse(httpClient.text);
        },

        mockCall: function(svc) {
            var mockResponsesHelper = require('./mockResponsesHelper');

            return mockResponsesHelper.getMockedResponse(svc);
        },
        getRequestLogMessage: function (request) {
            return request;
        },

        getResponseLogMessage: function (response) {
            return response.error.message;
        }
    });
}
// Only for unit testing!
exports.getKatapultServiceDefinition = getKatapultServiceDefinition;

/**
 * Creates an Error and appends web service call result as callResult
 *
 * @param {dw.svc.Result} callResult - Web service call result
 * @return {Error} - Error created
 */
function KatapultServiceError(callResult) {
    var message = 'Katapult web service call failed';
    if (callResult && callResult.errorMessage) {
        message += ': ' + callResult.errorMessage;
    }

    var err = new Error(message);
    err.callResult = callResult;
    err.name = 'KatapultServiceError';

    return err;
}

/**
 * Makes a call to Stripe web service given a request object.
 * Throws an error (KatapultServiceError, which will have the call dw.svc.Result
 * object in callResult property) in case the result of a call is not ok.
 *
 * @param {Object} requestObject - An object having details for the request to
 *   be made, including endpoint, payload etc.
 * @return {dw.svc.Result} - Result returned by the call.
 */
function callService(requestObject) {
    if (!requestObject) {
        throw new Error('Required requestObject parameter missing or incorrect.');
    }

    var callResult = getKatapultServiceDefinition().call(requestObject);

    if (!callResult.ok) {
        return JSON.parse(callResult.errorMessage);
    } 

    return callResult.object;
}

exports.call = callService;


// https://sandbox.katapult.com
exports.ordersKat = {
    cancel: function(kat_uid) {
        var requestObject = {
            endpoint: '/api/v3/application/'+ kat_uid +'/cancel_order/',
            httpMethod: 'GET'
        };

        return callService(requestObject);
    },

    shipping: function(itemsObj, kat_uid) {
        var requestObject = {
            endpoint: '/api/v3/application/'+ kat_uid +'/delivery/',
            httpMethod: 'POST',
            payload: itemsObj
        };

        return callService(requestObject);
    },

    confirm: function(kat_uid, orderID) {
        var requestObject = {
            endpoint: '/api/v3/application/'+ kat_uid +'/confirm_order/',
            httpMethod: 'POST',
            payload: orderID
        };

        return callService(requestObject);
    },

    callAynsOrder: function(orderPayload) {
        var requestObject = {
            endpoint: '/api/v3/application/sync/',
            httpMethod: 'POST',
            payload: orderPayload
        };

        return callService(requestObject);
    },
    cancelItem: function(itemsObj, kat_uid) {
        var requestObject = {
            endpoint: '/api/v3/application/'+ kat_uid +'/cancel_item/',
            httpMethod: 'POST',
            payload: itemsObj
        };

        return callService(requestObject);
    },
    connect: function(contentObj, apiEndPoint) {
        var requestObject = {
            endpoint: apiEndPoint,
            httpMethod: 'POST',
            payload: contentObj
        };

        return callService(requestObject);
    }

};
