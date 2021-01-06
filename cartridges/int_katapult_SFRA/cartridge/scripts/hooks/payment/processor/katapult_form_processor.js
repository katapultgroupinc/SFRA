'use strict';
var Resource = require('dw/web/Resource');


/**
 * boleto hook processor for some validations if necessary
 * @return {Object} an object that contains error information
 */
function processForm(req, paymentForm, viewFormData) {
    var viewData = viewFormData;

    delete viewData.paymentInformation;
    
    viewData.paymentMethod = {
        value: paymentForm.paymentMethod.value,
        htmlName: paymentForm.paymentMethod.value
    };

    if (req.form.storedPaymentUUID) {
        viewData.storedPaymentUUID = req.form.storedPaymentUUID;
    }

    return {
        error: false,
        viewData: viewData
    };
}

/**
 * default hook if no save payment information processor is supported
 */
function savePaymentInformation() {
    return;
}

exports.processForm = processForm;
exports.savePaymentInformation = savePaymentInformation;
