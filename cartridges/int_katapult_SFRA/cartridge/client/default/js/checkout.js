'use strict';

/*
eslint no-undef: "off"
*/
var processInclude = require('base/util');

$(document).ready(function () {
    processInclude(require('./checkout/checkout'));
});
