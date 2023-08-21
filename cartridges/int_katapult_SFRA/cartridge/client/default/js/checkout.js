'use strict';

/*
eslint no-undef: "off"
*/
var processInclude = require('base/util');

$(document).ready(function () {
    processInclude(require('./checkout/checkout'));
});
function checkForZibbyClose(response){
    if (!response.origin.includes("katapult.com")) return;
    try {
        const data =  JSON.parse(response.data);
        if(data.message === "zibbyjs:close"){
            var redirectToCheckoutBegain = $('#checkoutBegin').data('begin');
            window.location.href =redirectToCheckoutBegain;
        }
    } catch (e) {
        return response.data;
    }
}
window.addEventListener('message', checkForZibbyClose, false);