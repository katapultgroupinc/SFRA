'use strict';
    require('./connectionKatapult');

    $("header .navbar-header .pull-left").after('<a class="btn-katapult-preapprove d-none d-md-inline-block mt-3 ml-2" href="#"></a>');
    $(".menu-group .navbar-nav").append('<a class="btn-katapult-preapprove d-inline-block d-md-none mx-auto" href="#"></a>');
        
    $('.btn-katapult-preapprove').on('click', function() {
        katapult.preapprove();
    });

    $('#katapultTrue').add('#checkoutKatapult').on('click', function() {
        var KatapultStart = $('#katapultStart').data('katapult-start');
        var katapultFail = $('#katapultFail').data('katapult-fail');
        var katapultOk = $('#katapultOk').data('katapult-ok');
        var katapultMin = parseFloat($('#katapultLimit').data('katapult-min'));
        var katapultMax = parseFloat($('#katapultLimit').data('katapult-max'));

        $.ajax({
            url: KatapultStart,
            type: 'get',
            dataType: 'json',
            success: function (data) {
                var customerID = data.basketId;
                var customerEmail = data.order.orderEmail;
                var itemsCart = data.itemsCart;
                var totalShippingCost = parseFloat(data.order.totals.totalShippingCost.replace( /^\D+/g, ''));
                var orderDiscount =  parseFloat(data.order.totals.orderLevelDiscountTotal.value);
                var shippingDiscount =  parseFloat(data.order.totals.shippingLevelDiscountTotal.value);                

                // Billing information
                var oTotal = parseFloat(data.order.priceTotal.replace(/[^0-9\.-]+/g,""));
                var billingData = data.order.billing.billingAddress.address;
                var billingArray = {
                    first_name: billingData.firstName,
                    middle_name: "",
                    last_name: billingData.lastName,
                    address: billingData.address1,
                    address2: billingData.address2,
                    city: billingData.city,
                    state: billingData.stateCode,
                    country: billingData.countryCode.displayValue,
                    zip: billingData.postalCode,
                    phone: billingData.phone,
                    email: customerEmail
                };
                
                // Shipping information
                var itemsShipping = data.order.shipping;
                var s = 0;
                for (s in itemsShipping) {
                    var shippingAddressData = {
                        first_name: itemsShipping[s].shippingAddress.firstName,
                        middle_name: "",
                        last_name: itemsShipping[s].shippingAddress.lastName,
                        address: itemsShipping[s].shippingAddress.address1,
                        address2: itemsShipping[s].shippingAddress.address2,
                        city: itemsShipping[s].shippingAddress.city,
                        state: itemsShipping[s].shippingAddress.stateCode,
                        country: itemsShipping[s].shippingAddress.countryCode.displayValue,
                        zip: itemsShipping[s].shippingAddress.postalCode,
                        phone: itemsShipping[s].shippingAddress.phone,
                        email: customerEmail
                    };
                }
                
                if (oTotal >= katapultMin && oTotal <= katapultMax) {
                    getBasket(itemsCart, billingArray, customerID, shippingAddressData, customerEmail, totalShippingCost, orderDiscount, shippingDiscount, katapultOk, katapultFail);
                } else {
                    alert("Katapult cannot be used to this payment, the payment amount has to be between " + katapultMin + " and " + katapultMax);
                }
            }
        });
        
    });


        
    function getBasket(itemsCart,billingArray,customerID, shippingAddressData, customerEmail,  totalShippingCost, orderDiscount, shippingDiscount, katapultOk, katapultFail){
        var checkout = {
            customer: {
                billing: billingArray,
                shipping: shippingAddressData
            },

            items: itemsCart,

            checkout: {
                customer_id: customerID,
                shipping_amount: totalShippingCost,
                discounts: [
                    {discount_name: "orderDiscount", discount_amount: orderDiscount},
                    {discount_name: "shippingDiscount", discount_amount: shippingDiscount}
                ]
            },

            urls: {
                return: katapultOk,
                cancel: katapultFail
            }

            };
            katapult.checkout.set(checkout);
            katapult.checkout.load();
        
    }


