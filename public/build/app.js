(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["app"],{

/***/ "./assets/css/app.scss":
/*!*****************************!*\
  !*** ./assets/css/app.scss ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./assets/icons/svgxuse.js":
/*!*********************************!*\
  !*** ./assets/icons/svgxuse.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! core-js/modules/es.object.create */ "./node_modules/core-js/modules/es.object.create.js");

__webpack_require__(/*! core-js/modules/es.regexp.exec */ "./node_modules/core-js/modules/es.regexp.exec.js");

__webpack_require__(/*! core-js/modules/es.string.replace */ "./node_modules/core-js/modules/es.string.replace.js");

__webpack_require__(/*! core-js/modules/es.string.split */ "./node_modules/core-js/modules/es.string.split.js");

__webpack_require__(/*! core-js/modules/web.timers */ "./node_modules/core-js/modules/web.timers.js");

/*!
 * @copyright Copyright (c) 2017 IcoMoon.io
 * @license   Licensed under MIT license
 *            See https://github.com/Keyamoon/svgxuse
 * @version   1.2.6
 */

/*jslint browser: true */

/*global XDomainRequest, MutationObserver, window */
(function () {
  "use strict";

  if (typeof window !== "undefined" && window.addEventListener) {
    var cache = Object.create(null); // holds xhr objects to prevent multiple requests

    var checkUseElems;
    var tid; // timeout id

    var debouncedCheck = function debouncedCheck() {
      clearTimeout(tid);
      tid = setTimeout(checkUseElems, 100);
    };

    var unobserveChanges = function unobserveChanges() {
      return;
    };

    var observeChanges = function observeChanges() {
      var observer;
      window.addEventListener("resize", debouncedCheck, false);
      window.addEventListener("orientationchange", debouncedCheck, false);

      if (window.MutationObserver) {
        observer = new MutationObserver(debouncedCheck);
        observer.observe(document.documentElement, {
          childList: true,
          subtree: true,
          attributes: true
        });

        unobserveChanges = function unobserveChanges() {
          try {
            observer.disconnect();
            window.removeEventListener("resize", debouncedCheck, false);
            window.removeEventListener("orientationchange", debouncedCheck, false);
          } catch (ignore) {}
        };
      } else {
        document.documentElement.addEventListener("DOMSubtreeModified", debouncedCheck, false);

        unobserveChanges = function unobserveChanges() {
          document.documentElement.removeEventListener("DOMSubtreeModified", debouncedCheck, false);
          window.removeEventListener("resize", debouncedCheck, false);
          window.removeEventListener("orientationchange", debouncedCheck, false);
        };
      }
    };

    var createRequest = function createRequest(url) {
      // In IE 9, cross origin requests can only be sent using XDomainRequest.
      // XDomainRequest would fail if CORS headers are not set.
      // Therefore, XDomainRequest should only be used with cross origin requests.
      function getOrigin(loc) {
        var a;

        if (loc.protocol !== undefined) {
          a = loc;
        } else {
          a = document.createElement("a");
          a.href = loc;
        }

        return a.protocol.replace(/:/g, "") + a.host;
      }

      var Request;
      var origin;
      var origin2;

      if (window.XMLHttpRequest) {
        Request = new XMLHttpRequest();
        origin = getOrigin(location);
        origin2 = getOrigin(url);

        if (Request.withCredentials === undefined && origin2 !== "" && origin2 !== origin) {
          Request = XDomainRequest || undefined;
        } else {
          Request = XMLHttpRequest;
        }
      }

      return Request;
    };

    var xlinkNS = "http://www.w3.org/1999/xlink";

    checkUseElems = function checkUseElems() {
      var base;
      var bcr;
      var fallback = ""; // optional fallback URL in case no base path to SVG file was given and no symbol definition was found.

      var hash;
      var href;
      var i;
      var inProgressCount = 0;
      var isHidden;
      var Request;
      var url;
      var uses;
      var xhr;

      function observeIfDone() {
        // If done with making changes, start watching for chagnes in DOM again
        inProgressCount -= 1;

        if (inProgressCount === 0) {
          // if all xhrs were resolved
          unobserveChanges(); // make sure to remove old handlers

          observeChanges(); // watch for changes to DOM
        }
      }

      function attrUpdateFunc(spec) {
        return function () {
          if (cache[spec.base] !== true) {
            spec.useEl.setAttributeNS(xlinkNS, "xlink:href", "#" + spec.hash);

            if (spec.useEl.hasAttribute("href")) {
              spec.useEl.setAttribute("href", "#" + spec.hash);
            }
          }
        };
      }

      function onloadFunc(xhr) {
        return function () {
          var body = document.body;
          var x = document.createElement("x");
          var svg;
          xhr.onload = null;
          x.innerHTML = xhr.responseText;
          svg = x.getElementsByTagName("svg")[0];

          if (svg) {
            svg.setAttribute("aria-hidden", "true");
            svg.style.position = "absolute";
            svg.style.width = 0;
            svg.style.height = 0;
            svg.style.overflow = "hidden";
            body.insertBefore(svg, body.firstChild);
          }

          observeIfDone();
        };
      }

      function onErrorTimeout(xhr) {
        return function () {
          xhr.onerror = null;
          xhr.ontimeout = null;
          observeIfDone();
        };
      }

      unobserveChanges(); // stop watching for changes to DOM
      // find all use elements

      uses = document.getElementsByTagName("use");

      for (i = 0; i < uses.length; i += 1) {
        try {
          bcr = uses[i].getBoundingClientRect();
        } catch (ignore) {
          // failed to get bounding rectangle of the use element
          bcr = false;
        }

        href = uses[i].getAttribute("href") || uses[i].getAttributeNS(xlinkNS, "href") || uses[i].getAttribute("xlink:href");

        if (href && href.split) {
          url = href.split("#");
        } else {
          url = ["", ""];
        }

        base = url[0];
        hash = url[1];
        isHidden = bcr && bcr.left === 0 && bcr.right === 0 && bcr.top === 0 && bcr.bottom === 0;

        if (bcr && bcr.width === 0 && bcr.height === 0 && !isHidden) {
          // the use element is empty
          // if there is a reference to an external SVG, try to fetch it
          // use the optional fallback URL if there is no reference to an external SVG
          if (fallback && !base.length && hash && !document.getElementById(hash)) {
            base = fallback;
          }

          if (uses[i].hasAttribute("href")) {
            uses[i].setAttributeNS(xlinkNS, "xlink:href", href);
          }

          if (base.length) {
            // schedule updating xlink:href
            xhr = cache[base];

            if (xhr !== true) {
              // true signifies that prepending the SVG was not required
              setTimeout(attrUpdateFunc({
                useEl: uses[i],
                base: base,
                hash: hash
              }), 0);
            }

            if (xhr === undefined) {
              Request = createRequest(base);

              if (Request !== undefined) {
                xhr = new Request();
                cache[base] = xhr;
                xhr.onload = onloadFunc(xhr);
                xhr.onerror = onErrorTimeout(xhr);
                xhr.ontimeout = onErrorTimeout(xhr);
                xhr.open("GET", base);
                xhr.send();
                inProgressCount += 1;
              }
            }
          }
        } else {
          if (!isHidden) {
            if (cache[base] === undefined) {
              // remember this URL if the use element was not empty and no request was sent
              cache[base] = true;
            } else if (cache[base].onload) {
              // if it turns out that prepending the SVG is not necessary,
              // abort the in-progress xhr.
              cache[base].abort();
              delete cache[base].onload;
              cache[base] = true;
            }
          } else if (base.length && cache[base]) {
            setTimeout(attrUpdateFunc({
              useEl: uses[i],
              base: base,
              hash: hash
            }), 0);
          }
        }
      }

      uses = "";
      inProgressCount += 1;
      observeIfDone();
    };

    var _winLoad;

    _winLoad = function winLoad() {
      window.removeEventListener("load", _winLoad, false); // to prevent memory leaks

      tid = setTimeout(checkUseElems, 0);
    };

    if (document.readyState !== "complete") {
      // The load event fires when all resources have finished loading, which allows detecting whether SVG use elements are empty.
      window.addEventListener("load", _winLoad, false);
    } else {
      // No need to add a listener if the document is already loaded, initialize immediately.
      _winLoad();
    }
  }
})();

/***/ }),

/***/ "./assets/js/Components/Welcome.js":
/*!*****************************************!*\
  !*** ./assets/js/Components/Welcome.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_es_symbol__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.symbol */ "./node_modules/core-js/modules/es.symbol.js");
/* harmony import */ var core_js_modules_es_symbol__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_symbol__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_symbol_description__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.symbol.description */ "./node_modules/core-js/modules/es.symbol.description.js");
/* harmony import */ var core_js_modules_es_symbol_description__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_symbol_description__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_es_symbol_iterator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/es.symbol.iterator */ "./node_modules/core-js/modules/es.symbol.iterator.js");
/* harmony import */ var core_js_modules_es_symbol_iterator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_symbol_iterator__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var core_js_modules_es_array_iterator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/es.array.iterator */ "./node_modules/core-js/modules/es.array.iterator.js");
/* harmony import */ var core_js_modules_es_array_iterator__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_iterator__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var core_js_modules_es_object_create__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! core-js/modules/es.object.create */ "./node_modules/core-js/modules/es.object.create.js");
/* harmony import */ var core_js_modules_es_object_create__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_create__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var core_js_modules_es_object_define_property__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! core-js/modules/es.object.define-property */ "./node_modules/core-js/modules/es.object.define-property.js");
/* harmony import */ var core_js_modules_es_object_define_property__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_define_property__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var core_js_modules_es_object_get_prototype_of__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! core-js/modules/es.object.get-prototype-of */ "./node_modules/core-js/modules/es.object.get-prototype-of.js");
/* harmony import */ var core_js_modules_es_object_get_prototype_of__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_get_prototype_of__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var core_js_modules_es_object_set_prototype_of__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! core-js/modules/es.object.set-prototype-of */ "./node_modules/core-js/modules/es.object.set-prototype-of.js");
/* harmony import */ var core_js_modules_es_object_set_prototype_of__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_set_prototype_of__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var core_js_modules_es_object_to_string__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! core-js/modules/es.object.to-string */ "./node_modules/core-js/modules/es.object.to-string.js");
/* harmony import */ var core_js_modules_es_object_to_string__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_to_string__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var core_js_modules_es_string_iterator__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! core-js/modules/es.string.iterator */ "./node_modules/core-js/modules/es.string.iterator.js");
/* harmony import */ var core_js_modules_es_string_iterator__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_iterator__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator */ "./node_modules/core-js/modules/web.dom-collections.iterator.js");
/* harmony import */ var core_js_modules_web_dom_collections_iterator__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_11__);












function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }



var Welcome =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Welcome, _React$Component);

  function Welcome() {
    _classCallCheck(this, Welcome);

    return _possibleConstructorReturn(this, _getPrototypeOf(Welcome).apply(this, arguments));
  }

  _createClass(Welcome, [{
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_11___default.a.createElement("div", null, "Hello React !");
    }
  }]);

  return Welcome;
}(react__WEBPACK_IMPORTED_MODULE_11___default.a.Component);

/* harmony default export */ __webpack_exports__["default"] = (Welcome);

/***/ }),

/***/ "./assets/js/app.js":
/*!**************************!*\
  !*** ./assets/js/app.js ***!
  \**************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_es_symbol__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.symbol */ "./node_modules/core-js/modules/es.symbol.js");
/* harmony import */ var core_js_modules_es_symbol__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_symbol__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_symbol_description__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.symbol.description */ "./node_modules/core-js/modules/es.symbol.description.js");
/* harmony import */ var core_js_modules_es_symbol_description__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_symbol_description__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_es_symbol_iterator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/es.symbol.iterator */ "./node_modules/core-js/modules/es.symbol.iterator.js");
/* harmony import */ var core_js_modules_es_symbol_iterator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_symbol_iterator__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var core_js_modules_es_array_iterator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/es.array.iterator */ "./node_modules/core-js/modules/es.array.iterator.js");
/* harmony import */ var core_js_modules_es_array_iterator__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_iterator__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var core_js_modules_es_object_create__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! core-js/modules/es.object.create */ "./node_modules/core-js/modules/es.object.create.js");
/* harmony import */ var core_js_modules_es_object_create__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_create__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var core_js_modules_es_object_define_property__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! core-js/modules/es.object.define-property */ "./node_modules/core-js/modules/es.object.define-property.js");
/* harmony import */ var core_js_modules_es_object_define_property__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_define_property__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var core_js_modules_es_object_get_prototype_of__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! core-js/modules/es.object.get-prototype-of */ "./node_modules/core-js/modules/es.object.get-prototype-of.js");
/* harmony import */ var core_js_modules_es_object_get_prototype_of__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_get_prototype_of__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var core_js_modules_es_object_set_prototype_of__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! core-js/modules/es.object.set-prototype-of */ "./node_modules/core-js/modules/es.object.set-prototype-of.js");
/* harmony import */ var core_js_modules_es_object_set_prototype_of__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_set_prototype_of__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var core_js_modules_es_object_to_string__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! core-js/modules/es.object.to-string */ "./node_modules/core-js/modules/es.object.to-string.js");
/* harmony import */ var core_js_modules_es_object_to_string__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_to_string__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var core_js_modules_es_string_iterator__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! core-js/modules/es.string.iterator */ "./node_modules/core-js/modules/es.string.iterator.js");
/* harmony import */ var core_js_modules_es_string_iterator__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_iterator__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator */ "./node_modules/core-js/modules/web.dom-collections.iterator.js");
/* harmony import */ var core_js_modules_web_dom_collections_iterator__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! react-dom */ "./node_modules/react-dom/index.js");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _Components_Welcome__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./Components/Welcome */ "./assets/js/Components/Welcome.js");












function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

// any CSS you require will output into a single css file (app.css in this case)
__webpack_require__(/*! ../css/app.scss */ "./assets/css/app.scss");

__webpack_require__(/*! ../icons/svgxuse.js */ "./assets/icons/svgxuse.js");





var App =
/*#__PURE__*/
function (_React$Component) {
  _inherits(App, _React$Component);

  function App() {
    _classCallCheck(this, App);

    return _possibleConstructorReturn(this, _getPrototypeOf(App).apply(this, arguments));
  }

  _createClass(App, [{
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_11___default.a.createElement(_Components_Welcome__WEBPACK_IMPORTED_MODULE_13__["default"], null);
    }
  }]);

  return App;
}(react__WEBPACK_IMPORTED_MODULE_11___default.a.Component);

react_dom__WEBPACK_IMPORTED_MODULE_12___default.a.render(react__WEBPACK_IMPORTED_MODULE_11___default.a.createElement(App, null), document.getElementById('root'));

/***/ })

},[["./assets/js/app.js","runtime","vendors~app"]]]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hc3NldHMvY3NzL2FwcC5zY3NzIiwid2VicGFjazovLy8uL2Fzc2V0cy9pY29ucy9zdmd4dXNlLmpzIiwid2VicGFjazovLy8uL2Fzc2V0cy9qcy9Db21wb25lbnRzL1dlbGNvbWUuanMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2pzL2FwcC5qcyJdLCJuYW1lcyI6WyJ3aW5kb3ciLCJhZGRFdmVudExpc3RlbmVyIiwiY2FjaGUiLCJPYmplY3QiLCJjcmVhdGUiLCJjaGVja1VzZUVsZW1zIiwidGlkIiwiZGVib3VuY2VkQ2hlY2siLCJjbGVhclRpbWVvdXQiLCJzZXRUaW1lb3V0IiwidW5vYnNlcnZlQ2hhbmdlcyIsIm9ic2VydmVDaGFuZ2VzIiwib2JzZXJ2ZXIiLCJNdXRhdGlvbk9ic2VydmVyIiwib2JzZXJ2ZSIsImRvY3VtZW50IiwiZG9jdW1lbnRFbGVtZW50IiwiY2hpbGRMaXN0Iiwic3VidHJlZSIsImF0dHJpYnV0ZXMiLCJkaXNjb25uZWN0IiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImlnbm9yZSIsImNyZWF0ZVJlcXVlc3QiLCJ1cmwiLCJnZXRPcmlnaW4iLCJsb2MiLCJhIiwicHJvdG9jb2wiLCJ1bmRlZmluZWQiLCJjcmVhdGVFbGVtZW50IiwiaHJlZiIsInJlcGxhY2UiLCJob3N0IiwiUmVxdWVzdCIsIm9yaWdpbiIsIm9yaWdpbjIiLCJYTUxIdHRwUmVxdWVzdCIsImxvY2F0aW9uIiwid2l0aENyZWRlbnRpYWxzIiwiWERvbWFpblJlcXVlc3QiLCJ4bGlua05TIiwiYmFzZSIsImJjciIsImZhbGxiYWNrIiwiaGFzaCIsImkiLCJpblByb2dyZXNzQ291bnQiLCJpc0hpZGRlbiIsInVzZXMiLCJ4aHIiLCJvYnNlcnZlSWZEb25lIiwiYXR0clVwZGF0ZUZ1bmMiLCJzcGVjIiwidXNlRWwiLCJzZXRBdHRyaWJ1dGVOUyIsImhhc0F0dHJpYnV0ZSIsInNldEF0dHJpYnV0ZSIsIm9ubG9hZEZ1bmMiLCJib2R5IiwieCIsInN2ZyIsIm9ubG9hZCIsImlubmVySFRNTCIsInJlc3BvbnNlVGV4dCIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwic3R5bGUiLCJwb3NpdGlvbiIsIndpZHRoIiwiaGVpZ2h0Iiwib3ZlcmZsb3ciLCJpbnNlcnRCZWZvcmUiLCJmaXJzdENoaWxkIiwib25FcnJvclRpbWVvdXQiLCJvbmVycm9yIiwib250aW1lb3V0IiwibGVuZ3RoIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiZ2V0QXR0cmlidXRlIiwiZ2V0QXR0cmlidXRlTlMiLCJzcGxpdCIsImxlZnQiLCJyaWdodCIsInRvcCIsImJvdHRvbSIsImdldEVsZW1lbnRCeUlkIiwib3BlbiIsInNlbmQiLCJhYm9ydCIsIndpbkxvYWQiLCJyZWFkeVN0YXRlIiwiV2VsY29tZSIsIlJlYWN0IiwiQ29tcG9uZW50IiwicmVxdWlyZSIsIkFwcCIsIlJlYWN0RE9NIiwicmVuZGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSx1Qzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7QUFNQTs7QUFDQTtBQUNDLGFBQVk7QUFDVDs7QUFDQSxNQUFJLE9BQU9BLE1BQVAsS0FBa0IsV0FBbEIsSUFBaUNBLE1BQU0sQ0FBQ0MsZ0JBQTVDLEVBQThEO0FBQzFELFFBQUlDLEtBQUssR0FBR0MsTUFBTSxDQUFDQyxNQUFQLENBQWMsSUFBZCxDQUFaLENBRDBELENBQ3pCOztBQUNqQyxRQUFJQyxhQUFKO0FBQ0EsUUFBSUMsR0FBSixDQUgwRCxDQUdqRDs7QUFDVCxRQUFJQyxjQUFjLEdBQUcsU0FBakJBLGNBQWlCLEdBQVk7QUFDN0JDLGtCQUFZLENBQUNGLEdBQUQsQ0FBWjtBQUNBQSxTQUFHLEdBQUdHLFVBQVUsQ0FBQ0osYUFBRCxFQUFnQixHQUFoQixDQUFoQjtBQUNILEtBSEQ7O0FBSUEsUUFBSUssZ0JBQWdCLEdBQUcsNEJBQVk7QUFDL0I7QUFDSCxLQUZEOztBQUdBLFFBQUlDLGNBQWMsR0FBRyxTQUFqQkEsY0FBaUIsR0FBWTtBQUM3QixVQUFJQyxR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Q3dGLFFBQWhDLEVBQXlDLEtBQXpDO0FBQ0gsS0FIRCxNQUdPO0FBQ0g7QUFDQUEsY0FBTztBQUNWO0FBQ0o7QUFDSixDQTdOQSxHQUFELEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNSQTs7SUFFTUUsTzs7Ozs7Ozs7Ozs7Ozs2QkFDSztBQUNQLGFBQ0UseUZBREY7QUFLRDs7OztFQVBtQkMsNkNBQUssQ0FBQ0MsUzs7QUFVYkYsc0VBQWYsRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1pBO0FBQ0FHLG1CQUFPLENBQUMsOENBQUQsQ0FBUDs7QUFDQUEsbUJBQU8sQ0FBQyxzREFBRCxDQUFQOztBQUVBO0FBQ0E7QUFFQTs7SUFHTUMsRzs7Ozs7Ozs7Ozs7Ozs2QkFDSztBQUNQLGFBQ0UsNERBQUMsNERBQUQsT0FERjtBQUdEOzs7O0VBTGVILDZDQUFLLENBQUNDLFM7O0FBUXhCRyxpREFBUSxDQUFDQyxNQUFULENBQWdCLDREQUFDLEdBQUQsT0FBaEIsRUFBeUJsRixRQUFRLENBQUNzRSxjQUFULENBQXdCLE1BQXhCLENBQXpCLEUiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luIiwiLyohXG4gKiBAY29weXJpZ2h0IENvcHlyaWdodCAoYykgMjAxNyBJY29Nb29uLmlvXG4gKiBAbGljZW5zZSAgIExpY2Vuc2VkIHVuZGVyIE1JVCBsaWNlbnNlXG4gKiAgICAgICAgICAgIFNlZSBodHRwczovL2dpdGh1Yi5jb20vS2V5YW1vb24vc3ZneHVzZVxuICogQHZlcnNpb24gICAxLjIuNlxuICovXG4vKmpzbGludCBicm93c2VyOiB0cnVlICovXG4vKmdsb2JhbCBYRG9tYWluUmVxdWVzdCwgTXV0YXRpb25PYnNlcnZlciwgd2luZG93ICovXG4oZnVuY3Rpb24gKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiICYmIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgIHZhciBjYWNoZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7IC8vIGhvbGRzIHhociBvYmplY3RzIHRvIHByZXZlbnQgbXVsdGlwbGUgcmVxdWVzdHNcbiAgICAgICAgdmFyIGNoZWNrVXNlRWxlbXM7XG4gICAgICAgIHZhciB0aWQ7IC8vIHRpbWVvdXQgaWRcbiAgICAgICAgdmFyIGRlYm91bmNlZENoZWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpZCk7XG4gICAgICAgICAgICB0aWQgPSBzZXRUaW1lb3V0KGNoZWNrVXNlRWxlbXMsIDEwMCk7XG4gICAgICAgIH07XG4gICAgICAgIHZhciB1bm9ic2VydmVDaGFuZ2VzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9O1xuICAgICAgICB2YXIgb2JzZXJ2ZUNoYW5nZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgb2JzZXJ2ZXI7XG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCBkZWJvdW5jZWRDaGVjaywgZmFsc2UpO1xuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJvcmllbnRhdGlvbmNoYW5nZVwiLCBkZWJvdW5jZWRDaGVjaywgZmFsc2UpO1xuICAgICAgICAgICAgaWYgKHdpbmRvdy5NdXRhdGlvbk9ic2VydmVyKSB7XG4gICAgICAgICAgICAgICAgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihkZWJvdW5jZWRDaGVjayk7XG4gICAgICAgICAgICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsIHtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBzdWJ0cmVlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzOiB0cnVlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdW5vYnNlcnZlQ2hhbmdlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIGRlYm91bmNlZENoZWNrLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm9yaWVudGF0aW9uY2hhbmdlXCIsIGRlYm91bmNlZENoZWNrLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGlnbm9yZSkge31cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTVN1YnRyZWVNb2RpZmllZFwiLCBkZWJvdW5jZWRDaGVjaywgZmFsc2UpO1xuICAgICAgICAgICAgICAgIHVub2JzZXJ2ZUNoYW5nZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiRE9NU3VidHJlZU1vZGlmaWVkXCIsIGRlYm91bmNlZENoZWNrLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIGRlYm91bmNlZENoZWNrLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwib3JpZW50YXRpb25jaGFuZ2VcIiwgZGVib3VuY2VkQ2hlY2ssIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB2YXIgY3JlYXRlUmVxdWVzdCA9IGZ1bmN0aW9uICh1cmwpIHtcbiAgICAgICAgICAgIC8vIEluIElFIDksIGNyb3NzIG9yaWdpbiByZXF1ZXN0cyBjYW4gb25seSBiZSBzZW50IHVzaW5nIFhEb21haW5SZXF1ZXN0LlxuICAgICAgICAgICAgLy8gWERvbWFpblJlcXVlc3Qgd291bGQgZmFpbCBpZiBDT1JTIGhlYWRlcnMgYXJlIG5vdCBzZXQuXG4gICAgICAgICAgICAvLyBUaGVyZWZvcmUsIFhEb21haW5SZXF1ZXN0IHNob3VsZCBvbmx5IGJlIHVzZWQgd2l0aCBjcm9zcyBvcmlnaW4gcmVxdWVzdHMuXG4gICAgICAgICAgICBmdW5jdGlvbiBnZXRPcmlnaW4obG9jKSB7XG4gICAgICAgICAgICAgICAgdmFyIGE7XG4gICAgICAgICAgICAgICAgaWYgKGxvYy5wcm90b2NvbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGEgPSBsb2M7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuICAgICAgICAgICAgICAgICAgICBhLmhyZWYgPSBsb2M7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBhLnByb3RvY29sLnJlcGxhY2UoLzovZywgXCJcIikgKyBhLmhvc3Q7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgUmVxdWVzdDtcbiAgICAgICAgICAgIHZhciBvcmlnaW47XG4gICAgICAgICAgICB2YXIgb3JpZ2luMjtcbiAgICAgICAgICAgIGlmICh3aW5kb3cuWE1MSHR0cFJlcXVlc3QpIHtcbiAgICAgICAgICAgICAgICBSZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgICAgICAgICAgb3JpZ2luID0gZ2V0T3JpZ2luKGxvY2F0aW9uKTtcbiAgICAgICAgICAgICAgICBvcmlnaW4yID0gZ2V0T3JpZ2luKHVybCk7XG4gICAgICAgICAgICAgICAgaWYgKFJlcXVlc3Qud2l0aENyZWRlbnRpYWxzID09PSB1bmRlZmluZWQgJiYgb3JpZ2luMiAhPT0gXCJcIiAmJiBvcmlnaW4yICE9PSBvcmlnaW4pIHtcbiAgICAgICAgICAgICAgICAgICAgUmVxdWVzdCA9IFhEb21haW5SZXF1ZXN0IHx8IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBSZXF1ZXN0ID0gWE1MSHR0cFJlcXVlc3Q7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIFJlcXVlc3Q7XG4gICAgICAgIH07XG4gICAgICAgIHZhciB4bGlua05TID0gXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCI7XG4gICAgICAgIGNoZWNrVXNlRWxlbXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgYmFzZTtcbiAgICAgICAgICAgIHZhciBiY3I7XG4gICAgICAgICAgICB2YXIgZmFsbGJhY2sgPSBcIlwiOyAvLyBvcHRpb25hbCBmYWxsYmFjayBVUkwgaW4gY2FzZSBubyBiYXNlIHBhdGggdG8gU1ZHIGZpbGUgd2FzIGdpdmVuIGFuZCBubyBzeW1ib2wgZGVmaW5pdGlvbiB3YXMgZm91bmQuXG4gICAgICAgICAgICB2YXIgaGFzaDtcbiAgICAgICAgICAgIHZhciBocmVmO1xuICAgICAgICAgICAgdmFyIGk7XG4gICAgICAgICAgICB2YXIgaW5Qcm9ncmVzc0NvdW50ID0gMDtcbiAgICAgICAgICAgIHZhciBpc0hpZGRlbjtcbiAgICAgICAgICAgIHZhciBSZXF1ZXN0O1xuICAgICAgICAgICAgdmFyIHVybDtcbiAgICAgICAgICAgIHZhciB1c2VzO1xuICAgICAgICAgICAgdmFyIHhocjtcbiAgICAgICAgICAgIGZ1bmN0aW9uIG9ic2VydmVJZkRvbmUoKSB7XG4gICAgICAgICAgICAgICAgLy8gSWYgZG9uZSB3aXRoIG1ha2luZyBjaGFuZ2VzLCBzdGFydCB3YXRjaGluZyBmb3IgY2hhZ25lcyBpbiBET00gYWdhaW5cbiAgICAgICAgICAgICAgICBpblByb2dyZXNzQ291bnQgLT0gMTtcbiAgICAgICAgICAgICAgICBpZiAoaW5Qcm9ncmVzc0NvdW50ID09PSAwKSB7IC8vIGlmIGFsbCB4aHJzIHdlcmUgcmVzb2x2ZWRcbiAgICAgICAgICAgICAgICAgICAgdW5vYnNlcnZlQ2hhbmdlcygpOyAvLyBtYWtlIHN1cmUgdG8gcmVtb3ZlIG9sZCBoYW5kbGVyc1xuICAgICAgICAgICAgICAgICAgICBvYnNlcnZlQ2hhbmdlcygpOyAvLyB3YXRjaCBmb3IgY2hhbmdlcyB0byBET01cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmdW5jdGlvbiBhdHRyVXBkYXRlRnVuYyhzcGVjKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhY2hlW3NwZWMuYmFzZV0gIT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNwZWMudXNlRWwuc2V0QXR0cmlidXRlTlMoeGxpbmtOUywgXCJ4bGluazpocmVmXCIsIFwiI1wiICsgc3BlYy5oYXNoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzcGVjLnVzZUVsLmhhc0F0dHJpYnV0ZShcImhyZWZcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcGVjLnVzZUVsLnNldEF0dHJpYnV0ZShcImhyZWZcIiwgXCIjXCIgKyBzcGVjLmhhc2gpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZ1bmN0aW9uIG9ubG9hZEZ1bmMoeGhyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGJvZHkgPSBkb2N1bWVudC5ib2R5O1xuICAgICAgICAgICAgICAgICAgICB2YXIgeCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ4XCIpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3ZnO1xuICAgICAgICAgICAgICAgICAgICB4aHIub25sb2FkID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgeC5pbm5lckhUTUwgPSB4aHIucmVzcG9uc2VUZXh0O1xuICAgICAgICAgICAgICAgICAgICBzdmcgPSB4LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic3ZnXCIpWzBdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3ZnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdmcuc2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIiwgXCJ0cnVlXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3ZnLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3ZnLnN0eWxlLndpZHRoID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN2Zy5zdHlsZS5oZWlnaHQgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3ZnLnN0eWxlLm92ZXJmbG93ID0gXCJoaWRkZW5cIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvZHkuaW5zZXJ0QmVmb3JlKHN2ZywgYm9keS5maXJzdENoaWxkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBvYnNlcnZlSWZEb25lKCk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZ1bmN0aW9uIG9uRXJyb3JUaW1lb3V0KHhocikge1xuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHhoci5vbmVycm9yID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgeGhyLm9udGltZW91dCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIG9ic2VydmVJZkRvbmUoKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdW5vYnNlcnZlQ2hhbmdlcygpOyAvLyBzdG9wIHdhdGNoaW5nIGZvciBjaGFuZ2VzIHRvIERPTVxuICAgICAgICAgICAgLy8gZmluZCBhbGwgdXNlIGVsZW1lbnRzXG4gICAgICAgICAgICB1c2VzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ1c2VcIik7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdXNlcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGJjciA9IHVzZXNbaV0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoaWdub3JlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGZhaWxlZCB0byBnZXQgYm91bmRpbmcgcmVjdGFuZ2xlIG9mIHRoZSB1c2UgZWxlbWVudFxuICAgICAgICAgICAgICAgICAgICBiY3IgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaHJlZiA9IHVzZXNbaV0uZ2V0QXR0cmlidXRlKFwiaHJlZlwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgfHwgdXNlc1tpXS5nZXRBdHRyaWJ1dGVOUyh4bGlua05TLCBcImhyZWZcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIHx8IHVzZXNbaV0uZ2V0QXR0cmlidXRlKFwieGxpbms6aHJlZlwiKTtcbiAgICAgICAgICAgICAgICBpZiAoaHJlZiAmJiBocmVmLnNwbGl0KSB7XG4gICAgICAgICAgICAgICAgICAgIHVybCA9IGhyZWYuc3BsaXQoXCIjXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHVybCA9IFtcIlwiLCBcIlwiXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYmFzZSA9IHVybFswXTtcbiAgICAgICAgICAgICAgICBoYXNoID0gdXJsWzFdO1xuICAgICAgICAgICAgICAgIGlzSGlkZGVuID0gYmNyICYmIGJjci5sZWZ0ID09PSAwICYmIGJjci5yaWdodCA9PT0gMCAmJiBiY3IudG9wID09PSAwICYmIGJjci5ib3R0b20gPT09IDA7XG4gICAgICAgICAgICAgICAgaWYgKGJjciAmJiBiY3Iud2lkdGggPT09IDAgJiYgYmNyLmhlaWdodCA9PT0gMCAmJiAhaXNIaWRkZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhlIHVzZSBlbGVtZW50IGlzIGVtcHR5XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoZXJlIGlzIGEgcmVmZXJlbmNlIHRvIGFuIGV4dGVybmFsIFNWRywgdHJ5IHRvIGZldGNoIGl0XG4gICAgICAgICAgICAgICAgICAgIC8vIHVzZSB0aGUgb3B0aW9uYWwgZmFsbGJhY2sgVVJMIGlmIHRoZXJlIGlzIG5vIHJlZmVyZW5jZSB0byBhbiBleHRlcm5hbCBTVkdcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZhbGxiYWNrICYmICFiYXNlLmxlbmd0aCAmJiBoYXNoICYmICFkb2N1bWVudC5nZXRFbGVtZW50QnlJZChoYXNoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYmFzZSA9IGZhbGxiYWNrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh1c2VzW2ldLmhhc0F0dHJpYnV0ZShcImhyZWZcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVzZXNbaV0uc2V0QXR0cmlidXRlTlMoeGxpbmtOUywgXCJ4bGluazpocmVmXCIsIGhyZWYpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChiYXNlLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2NoZWR1bGUgdXBkYXRpbmcgeGxpbms6aHJlZlxuICAgICAgICAgICAgICAgICAgICAgICAgeGhyID0gY2FjaGVbYmFzZV07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoeGhyICE9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdHJ1ZSBzaWduaWZpZXMgdGhhdCBwcmVwZW5kaW5nIHRoZSBTVkcgd2FzIG5vdCByZXF1aXJlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoYXR0clVwZGF0ZUZ1bmMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VFbDogdXNlc1tpXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFzZTogYmFzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFzaDogaGFzaFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh4aHIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlcXVlc3QgPSBjcmVhdGVSZXF1ZXN0KGJhc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChSZXF1ZXN0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeGhyID0gbmV3IFJlcXVlc3QoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGVbYmFzZV0gPSB4aHI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHhoci5vbmxvYWQgPSBvbmxvYWRGdW5jKHhocik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHhoci5vbmVycm9yID0gb25FcnJvclRpbWVvdXQoeGhyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeGhyLm9udGltZW91dCA9IG9uRXJyb3JUaW1lb3V0KHhocik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHhoci5vcGVuKFwiR0VUXCIsIGJhc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4aHIuc2VuZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpblByb2dyZXNzQ291bnQgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWlzSGlkZGVuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FjaGVbYmFzZV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlbWVtYmVyIHRoaXMgVVJMIGlmIHRoZSB1c2UgZWxlbWVudCB3YXMgbm90IGVtcHR5IGFuZCBubyByZXF1ZXN0IHdhcyBzZW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGVbYmFzZV0gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjYWNoZVtiYXNlXS5vbmxvYWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiBpdCB0dXJucyBvdXQgdGhhdCBwcmVwZW5kaW5nIHRoZSBTVkcgaXMgbm90IG5lY2Vzc2FyeSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhYm9ydCB0aGUgaW4tcHJvZ3Jlc3MgeGhyLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlW2Jhc2VdLmFib3J0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGNhY2hlW2Jhc2VdLm9ubG9hZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWNoZVtiYXNlXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYmFzZS5sZW5ndGggJiYgY2FjaGVbYmFzZV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoYXR0clVwZGF0ZUZ1bmMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZUVsOiB1c2VzW2ldLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhc2U6IGJhc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFzaDogaGFzaFxuICAgICAgICAgICAgICAgICAgICAgICAgfSksIDApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdXNlcyA9IFwiXCI7XG4gICAgICAgICAgICBpblByb2dyZXNzQ291bnQgKz0gMTtcbiAgICAgICAgICAgIG9ic2VydmVJZkRvbmUoKTtcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIHdpbkxvYWQ7XG4gICAgICAgIHdpbkxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgd2luTG9hZCwgZmFsc2UpOyAvLyB0byBwcmV2ZW50IG1lbW9yeSBsZWFrc1xuICAgICAgICAgICAgdGlkID0gc2V0VGltZW91dChjaGVja1VzZUVsZW1zLCAwKTtcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgIT09IFwiY29tcGxldGVcIikge1xuICAgICAgICAgICAgLy8gVGhlIGxvYWQgZXZlbnQgZmlyZXMgd2hlbiBhbGwgcmVzb3VyY2VzIGhhdmUgZmluaXNoZWQgbG9hZGluZywgd2hpY2ggYWxsb3dzIGRldGVjdGluZyB3aGV0aGVyIFNWRyB1c2UgZWxlbWVudHMgYXJlIGVtcHR5LlxuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIHdpbkxvYWQsIGZhbHNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIE5vIG5lZWQgdG8gYWRkIGEgbGlzdGVuZXIgaWYgdGhlIGRvY3VtZW50IGlzIGFscmVhZHkgbG9hZGVkLCBpbml0aWFsaXplIGltbWVkaWF0ZWx5LlxuICAgICAgICAgICAgd2luTG9hZCgpO1xuICAgICAgICB9XG4gICAgfVxufSgpKTtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmNsYXNzIFdlbGNvbWUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIEhlbGxvIFJlYWN0ICFcbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgV2VsY29tZTsiLCIvLyBhbnkgQ1NTIHlvdSByZXF1aXJlIHdpbGwgb3V0cHV0IGludG8gYSBzaW5nbGUgY3NzIGZpbGUgKGFwcC5jc3MgaW4gdGhpcyBjYXNlKVxucmVxdWlyZSgnLi4vY3NzL2FwcC5zY3NzJyk7XG5yZXF1aXJlKCcuLi9pY29ucy9zdmd4dXNlLmpzJyk7XG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJztcblxuaW1wb3J0IFdlbGNvbWUgZnJvbSAnLi9Db21wb25lbnRzL1dlbGNvbWUnO1xuXG5cbmNsYXNzIEFwcCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPFdlbGNvbWU+PC9XZWxjb21lPlxuICAgICk7XG4gIH1cbn1cblxuUmVhY3RET00ucmVuZGVyKDxBcHAgLz4sIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb290JykpOyJdLCJzb3VyY2VSb290IjoiIn0=