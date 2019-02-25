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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/Injected.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/Injected.ts":
/*!*************************!*\
  !*** ./src/Injected.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

window.addEventListener("message", (ev) => {
    function clone(cloneable) {
        let copy;
        // Handle the 3 simple types, and null or undefined
        if (null == cloneable || "object" !== typeof cloneable) {
            return cloneable;
        }
        // Handle Date
        if (cloneable instanceof Date) {
            copy = new Date();
            copy.setTime(cloneable.getTime());
            return copy;
        }
        // Handle Array
        if (cloneable instanceof Array) {
            copy = [];
            for (let i = 0, len = cloneable.length; i < len; i++) {
                copy[i] = clone(cloneable[i]);
            }
            return copy;
        }
        // Handle Object
        if (cloneable instanceof Object) {
            copy = {};
            for (const attr in cloneable) {
                if (cloneable.hasOwnProperty(attr)) {
                    copy[attr] = clone(cloneable[attr]);
                }
            }
            return copy;
        }
        throw new Error("Unable to copy obj! Its type isn't supported.");
    }
    const getController = (selector, controller) => {
        const element = window.angular.element(document.querySelector(selector));
        if (element) {
            if (controller) {
                return element.controller(controller);
            }
            else {
                return element.controller();
            }
        }
        return false;
    };
    const getControllerVariable = (selector, controllerName, route) => {
        const controller = getController(selector, controllerName);
        if (controller) {
            const paths = route && route.split(".");
            let current = controller;
            if (paths) {
                for (const path of paths) {
                    current = current[path];
                    if (current == null) {
                        return null;
                    }
                }
            }
            return current;
        }
        return null;
    };
    if (ev.data && ev.data.type === "controller-variable" && ev.data.route) {
        const result = (value) => {
            window.postMessage({
                id: ev.data.id,
                type: "controller-variable-result",
                value: clone(value),
            }, "*");
        };
        return result(getControllerVariable(ev.data.selector, ev.data.controller, ev.data.route));
    }
    else if (ev.data && ev.data.type === "intercept-function" && ev.data.function) {
        const obj = getControllerVariable(ev.data.selector, ev.data.controller, ev.data.route);
        const fnToWrap = obj[ev.data.function];
        obj[ev.data.function] = function () {
            const result = fnToWrap.apply(this, arguments);
            window.postMessage({
                id: ev.data.route + ev.data.function,
                type: "intercept-function-result",
            }, "*");
            return result;
        };
    }
});


/***/ })

/******/ });
//# sourceMappingURL=injected.js.map