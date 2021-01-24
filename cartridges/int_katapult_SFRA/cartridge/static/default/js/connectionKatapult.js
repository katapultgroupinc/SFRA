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
/******/ 	return __webpack_require__(__webpack_require__.s = "./cartridges/int_katapult_SFRA/cartridge/client/default/js/connectionKatapult.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./cartridges/int_katapult_SFRA/cartridge/client/default/js/connectionKatapult.js":
/*!****************************************************************************************!*\
  !*** ./cartridges/int_katapult_SFRA/cartridge/client/default/js/connectionKatapult.js ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("$(document).ready(function () {\r\n    var katapultApiK = $('#katapultCredentials').data('katapult-apik');\r\n    var katapultEnv = $('#katapultCredentials').data('katapult-env');\r\n\r\n    var katapultConfig = {\r\n        api_key: katapultApiK,\r\n        environment: katapultEnv\r\n    };\r\n\r\n    !(function (e, t) {\r\n e.katapult = e.katapult || {}; var n,\r\ni,\r\nr; i = !1, n = document.createElement(\"script\"), n.type = \"text/javascript\", n.async = !0, n.src = t.environment + \"/\" + \"plugin/js/katapult.js\", n.onload = n.onreadystatechange = function () { i || this.readyState && this.readyState != \"complete\" || (i = !0, e.katapult.setConfig(t.api_key)); }, r = document.getElementsByTagName(\"script\")[0], r.parentNode.insertBefore(n, r); var s = document.createElement(\"link\"); s.setAttribute(\"rel\", \"stylesheet\"), s.setAttribute(\"type\", \"text/css\"), s.setAttribute(\"href\", t.environment + \"/\" + \"plugin/css/katapult.css\"); var a = document.querySelector(\"head\"); a.insertBefore(s, a.firstChild);\r\n}(window, katapultConfig));\r\n});\r\n\n\n//# sourceURL=webpack:///./cartridges/int_katapult_SFRA/cartridge/client/default/js/connectionKatapult.js?");

/***/ })

/******/ });