/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./cartridges/int_katapult_SFRA/cartridge/client/default/js/senderBasket.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./cartridges/int_katapult_SFRA/cartridge/client/default/js/connectionKatapult.js":
/*!****************************************************************************************!*\
  !*** ./cartridges/int_katapult_SFRA/cartridge/client/default/js/connectionKatapult.js ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval(" /**\r\n * Katapult prepare connection.\r\n */\r\n$(document).ready(function () {\r\n    var katapultApiK = $('#katapultCredentials').data('katapult-apik');\r\n    var katapultEnv = $('#katapultCredentials').data('katapult-env');\r\n\r\n    var katapultConfig = {\r\n        api_key: katapultApiK,\r\n        environment: katapultEnv\r\n    };\r\n\r\n    !(function (e, t) {\r\n e.katapult = e.katapult || {}; var n,\r\ni,\r\nr; i = !1, n = document.createElement(\"script\"), n.type = \"text/javascript\", n.async = !0, n.src = t.environment + \"/\" + \"plugin/js/katapult.js\", n.onload = n.onreadystatechange = function () { i || this.readyState && this.readyState != \"complete\" || (i = !0, e.katapult.setConfig(t.api_key)); }, r = document.getElementsByTagName(\"script\")[0], r.parentNode.insertBefore(n, r); var s = document.createElement(\"link\"); s.setAttribute(\"rel\", \"stylesheet\"), s.setAttribute(\"type\", \"text/css\"), s.setAttribute(\"href\", t.environment + \"/\" + \"plugin/css/katapult.css\"); var a = document.querySelector(\"head\"); a.insertBefore(s, a.firstChild);\r\n}(window, katapultConfig));\r\n});\r\n\n\n//# sourceURL=webpack:///./cartridges/int_katapult_SFRA/cartridge/client/default/js/connectionKatapult.js?");

/***/ }),

/***/ "./cartridges/int_katapult_SFRA/cartridge/client/default/js/senderBasket.js":
/*!**********************************************************************************!*\
  !*** ./cartridges/int_katapult_SFRA/cartridge/client/default/js/senderBasket.js ***!
  \**********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("    __webpack_require__(/*! ./connectionKatapult */ \"./cartridges/int_katapult_SFRA/cartridge/client/default/js/connectionKatapult.js\");\r\n\r\n    $(\"header .navbar-header .pull-left\").after('<a class=\"btn-katapult-preapprove d-none d-md-inline-block mt-3 ml-2\" href=\"#\"></a>');\r\n    $(\".menu-group .navbar-nav\").append('<a class=\"btn-katapult-preapprove d-inline-block d-md-none mx-auto\" href=\"#\"></a>');\r\n\r\n    $('.btn-katapult-preapprove').on('click', function () {\r\n        katapult.preapprove();\r\n    });\r\n/**\r\n * Katapult open modal.\r\n */\r\n    $('#katapultTrue').add('#checkoutKatapult').on('click', function () {\r\n        var KatapultStart = $('#katapultStart').data('katapult-start');\r\n        var katapultFail = $('#katapultFail').data('katapult-fail');\r\n        var katapultOk = $('#katapultOk').data('katapult-ok');\r\n        var katapultMin = parseFloat($('#katapultLimit').data('katapult-min'));\r\n        var katapultMax = parseFloat($('#katapultLimit').data('katapult-max'));\r\n\r\n        $.ajax({\r\n            url: KatapultStart,\r\n            type: 'get',\r\n            dataType: 'json',\r\n            success: function (data) {\r\n                var customerID = data.basketId;\r\n                var customerEmail = data.order.orderEmail;\r\n                var itemsCart = data.itemsCart;\r\n                var totalShippingCost = parseFloat(data.order.totals.totalShippingCost.replace(/^\\D+/g, ''));\r\n                var orderDiscount = parseFloat(data.order.totals.orderLevelDiscountTotal.value);\r\n                var shippingDiscount = parseFloat(data.order.totals.shippingLevelDiscountTotal.value);\r\n\r\n                // Billing information\r\n                var oTotal = parseFloat(data.order.priceTotal.replace(/[^0-9\\.-]+/g, \"\"));\r\n                var billingData = data.order.billing.billingAddress.address;\r\n                var billingArray = {\r\n                    first_name: billingData.firstName,\r\n                    middle_name: \"\",\r\n                    last_name: billingData.lastName,\r\n                    address: billingData.address1,\r\n                    address2: billingData.address2,\r\n                    city: billingData.city,\r\n                    state: billingData.stateCode,\r\n                    country: billingData.countryCode.displayValue,\r\n                    zip: billingData.postalCode,\r\n                    phone: billingData.phone,\r\n                    email: customerEmail\r\n                };\r\n\r\n                // Shipping information\r\n                var itemsShipping = data.order.shipping;\r\n                var s = 0;\r\n                for (s in itemsShipping) {\r\n                    var shippingAddressData = {\r\n                        first_name: itemsShipping[s].shippingAddress.firstName,\r\n                        middle_name: \"\",\r\n                        last_name: itemsShipping[s].shippingAddress.lastName,\r\n                        address: itemsShipping[s].shippingAddress.address1,\r\n                        address2: itemsShipping[s].shippingAddress.address2,\r\n                        city: itemsShipping[s].shippingAddress.city,\r\n                        state: itemsShipping[s].shippingAddress.stateCode,\r\n                        country: itemsShipping[s].shippingAddress.countryCode.displayValue,\r\n                        zip: itemsShipping[s].shippingAddress.postalCode,\r\n                        phone: itemsShipping[s].shippingAddress.phone,\r\n                        email: customerEmail\r\n                    };\r\n                }\r\n\r\n                if (oTotal >= katapultMin && oTotal <= katapultMax) {\r\n                    getBasket(itemsCart, billingArray, customerID, shippingAddressData, customerEmail, totalShippingCost, orderDiscount, shippingDiscount, katapultOk, katapultFail);\r\n                } else {\r\n                    alert(\"Katapult cannot be used to this payment, the payment amount has to be between \" + katapultMin + \" and \" + katapultMax);\r\n                }\r\n            }\r\n        });\r\n    });\r\n /**\r\n * Katapult prepare checkout object.\r\n */\r\n    function getBasket(itemsCart, billingArray, customerID, shippingAddressData, customerEmail, totalShippingCost, orderDiscount, shippingDiscount, katapultOk, katapultFail) {\r\n        var checkout = {\r\n            customer: {\r\n                billing: billingArray,\r\n                shipping: shippingAddressData\r\n            },\r\n\r\n            items: itemsCart,\r\n\r\n            checkout: {\r\n                customer_id: customerID,\r\n                shipping_amount: totalShippingCost,\r\n                discounts: [\r\n                    { discount_name: \"orderDiscount\", discount_amount: orderDiscount },\r\n                    { discount_name: \"shippingDiscount\", discount_amount: shippingDiscount }\r\n                ]\r\n            },\r\n\r\n            urls: {\r\n                return: katapultOk,\r\n                cancel: katapultFail\r\n            }\r\n\r\n            };\r\n            katapult.checkout.set(checkout);\r\n            katapult.checkout.load();\r\n    }\r\n\n\n//# sourceURL=webpack:///./cartridges/int_katapult_SFRA/cartridge/client/default/js/senderBasket.js?");

/***/ })

/******/ });