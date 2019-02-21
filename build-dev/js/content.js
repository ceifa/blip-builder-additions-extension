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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/content/Content.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/content/Content.ts":
/*!********************************!*\
  !*** ./src/content/Content.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Communicator_1 = __webpack_require__(/*! ../shared/Communicator */ "./src/shared/Communicator.ts");
const Storager_1 = __webpack_require__(/*! ../shared/Storager */ "./src/shared/Storager.ts");
const Utils_1 = __webpack_require__(/*! ../shared/Utils */ "./src/shared/Utils.ts");
const AutoTag_1 = __webpack_require__(/*! ./features/AutoTag */ "./src/content/features/AutoTag.ts");
exports.isBuilderLoaded = false;
exports.features = [
    {
        name: "autotag",
        processor: new AutoTag_1.default(),
    },
];
((brow) => __awaiter(this, void 0, void 0, function* () {
    const refreshFeatures = () => __awaiter(this, void 0, void 0, function* () {
        yield Storager_1.default.refresh();
        exports.features.forEach((f) => __awaiter(this, void 0, void 0, function* () {
            const configuration = yield Storager_1.default.get(f.name);
            f.processor.OnReceiveConfiguration(configuration);
            if (configuration && configuration.enabled && !f.processor.isEnabled) {
                f.processor.OnEnableFeature();
            }
        }));
    });
    Communicator_1.default.on("change-settings", refreshFeatures);
    setInterval(() => __awaiter(this, void 0, void 0, function* () {
        const isLoading = yield Utils_1.default.getBuilderControllerVariable("isLoading");
        const isLoaded = isLoading === false;
        if (isLoaded && isLoaded !== exports.isBuilderLoaded) {
            exports.features.forEach((f) => f.processor.OnLoadBuilder());
        }
        exports.isBuilderLoaded = isLoaded;
    }), 800);
    refreshFeatures();
}))(chrome || browser);


/***/ }),

/***/ "./src/content/features/AutoTag.ts":
/*!*****************************************!*\
  !*** ./src/content/features/AutoTag.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_1 = __webpack_require__(/*! ../../shared/Utils */ "./src/shared/Utils.ts");
const FeatureBase_1 = __webpack_require__(/*! ./FeatureBase */ "./src/content/features/FeatureBase.ts");
class AutoTag extends FeatureBase_1.FeatureBase {
    constructor() {
        super(...arguments);
        this.AddEventListeners = () => {
            const elements = document.querySelectorAll("li[ng-click^='$ctrl.onAddAction'], i[ng-click^='$ctrl.onDeleteAction']");
            elements.forEach((e) => {
                e.removeEventListener("click", this.RepairWrongTags);
                e.addEventListener("click", this.RepairWrongTags);
            });
        };
        this.RepairWrongTags = () => __awaiter(this, void 0, void 0, function* () {
            if (!this.isEnabled) {
                return;
            }
            const enteringCustomActions = yield Utils_1.default.getBuilderControllerVariable("editingState.$enteringCustomActions");
            const leavingCustomAction = yield Utils_1.default.getBuilderControllerVariable("editingState.$leavingCustomActions");
            let actions = [...enteringCustomActions, ...leavingCustomAction];
            actions = actions.map((a) => a.type);
            let tags = yield Utils_1.default.getBuilderControllerVariable("editingState.$tags");
            tags = tags.map((t) => t.label);
            const possibleActions = [
                ...new Set(Array.from(document.querySelectorAll("li[ng-click^='$ctrl.onAddAction']"))
                    .map((a) => a.getAttribute("ng-click").match("'(.*)'")[1]))
            ];
            const shouldFixTags = tags.filter((t) => !actions.includes(t) && possibleActions.includes(t));
            shouldFixTags.forEach(this.removeTag);
            const shouldFixActions = actions.filter((a) => !tags.includes(a));
            console.log(shouldFixActions);
            shouldFixActions.forEach(this.addTag);
        });
        this.removeTag = (tagName) => {
            const tagElements = Array.from(document.querySelectorAll(".sidebar-content-header .blip-tag__label"));
            const correctTagElement = tagElements.find((t) => t.textContent.trim() === tagName);
            if (correctTagElement) {
                correctTagElement.nextElementSibling.click();
            }
        };
        this.addTag = (tagName) => __awaiter(this, void 0, void 0, function* () {
            const tab = document.getElementById("node-content-tab");
            const header = tab.getElementsByClassName("sidebar-content-header")[0];
            const tagMenuBtn = header.getElementsByTagName("img");
            if (tagMenuBtn.length > 0) {
                tagMenuBtn[0].click();
            }
            const tagMenu = header.getElementsByTagName("blip-tags")[0];
            const input = tagMenu.getElementsByTagName("input")[0];
            input.value = tagName;
            yield Utils_1.default.sleep(10);
            input.dispatchEvent(new Event("input"));
            yield Utils_1.default.sleep(30);
            const options = tagMenu.getElementsByClassName("blip-select__options");
            options[0].style.display = "none";
            const correctTagOption = options[0].getElementsByClassName("blip-select__option");
            if (correctTagOption && correctTagOption.length > 0) {
                correctTagOption[0].click();
                yield Utils_1.default.sleep(20);
                const color = this.configuration[tagName.toLowerCase()];
                const colorSelector = tagMenu.getElementsByClassName("blip-tag-select-color");
                if (colorSelector && colorSelector.length > 0) {
                    colorSelector[0].style.display = "none";
                    const colors = colorSelector[0].getElementsByClassName("blip-tag-color-option");
                    for (const colorElement of Array.from(colors || [])) {
                        const currentColor = colorElement.getAttribute("data-color");
                        if (currentColor === color) {
                            colorElement.click();
                        }
                    }
                }
            }
        });
    }
    OnLoadBuilder() {
        if (this.isEnabled) {
            this.StartAsync();
        }
    }
    StartAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            Utils_1.default.interceptFunction("SidebarContentService", "showSidebar", this.AddEventListeners);
        });
    }
}
exports.default = AutoTag;


/***/ }),

/***/ "./src/content/features/FeatureBase.ts":
/*!*********************************************!*\
  !*** ./src/content/features/FeatureBase.ts ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class FeatureBase {
    constructor() {
        this.isEnabled = false;
    }
    OnEnableFeature() {
        this.isEnabled = true;
    }
    OnDisableFeature() {
        this.isEnabled = false;
    }
    OnReceiveConfiguration(configuration) {
        this.configuration = configuration;
    }
}
exports.FeatureBase = FeatureBase;


/***/ }),

/***/ "./src/shared/Communicator.ts":
/*!************************************!*\
  !*** ./src/shared/Communicator.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ((brow) => { var _a; return _a = class Communicator {
    },
    _a.on = (type, callback) => {
        brow.runtime.onMessage.addListener((message) => {
            if (message.type === type) {
                callback(message.state);
            }
        });
    },
    _a.emit = (type, state) => {
        brow.tabs.query({ url: "*://*.blip.ai/*" }, (tabs) => {
            for (const tab of tabs) {
                chrome.tabs.sendMessage(tab.id, { type, state });
            }
        });
    },
    _a; })(chrome || browser);


/***/ }),

/***/ "./src/shared/Storager.ts":
/*!********************************!*\
  !*** ./src/shared/Storager.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ((brow) => {
    var _a;
    let storage = null;
    const ensureHasStorage = () => new Promise((resolve) => {
        if (!storage) {
            try {
                storage = brow.storage.sync.get("settings", (result) => {
                    storage = result && result.settings;
                    resolve();
                });
            }
            catch (_a) {
                resolve();
            }
        }
        else {
            resolve();
        }
    });
    const syncStorage = () => __awaiter(this, void 0, void 0, function* () {
        yield ensureHasStorage();
        brow.storage.sync.set({
            settings: storage,
        });
    });
    return _a = class Storager {
        },
        _a.get = (key) => __awaiter(this, void 0, void 0, function* () {
            yield ensureHasStorage();
            let current = storage || {};
            if (key) {
                const keys = key.split(".");
                for (const path of keys) {
                    if (current.hasOwnProperty(path)) {
                        current = current[path];
                    }
                    else {
                        return null;
                    }
                }
            }
            return current;
        }),
        _a.set = (key, value) => __awaiter(this, void 0, void 0, function* () {
            yield ensureHasStorage();
            let current = storage || {};
            const keys = key.split(".");
            for (let i = 0; i < keys.length; i++) {
                const path = keys[i];
                if (i === keys.length - 1) {
                    current[path] = value;
                    break;
                }
                else if (!storage.hasOwnProperty(path)) {
                    current[path] = {};
                }
                current = current[path];
            }
            yield syncStorage();
        }),
        _a.clear = () => __awaiter(this, void 0, void 0, function* () {
            storage = {};
            yield syncStorage();
        }),
        _a.refresh = () => __awaiter(this, void 0, void 0, function* () {
            storage = null;
            yield ensureHasStorage();
        }),
        _a;
})(chrome || browser);


/***/ }),

/***/ "./src/shared/Utils.ts":
/*!*****************************!*\
  !*** ./src/shared/Utils.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class Utils {
    static getRandomId() {
        return Math.random().toString(36).substr(2, 9);
    }
    static getBuilderControllerVariable(path) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.getBuilderControllerVariableInjected) {
                yield Utils.injectPageScript("js/inject.js");
                this.getBuilderControllerVariableInjected = true;
            }
            return new Promise((resolve) => {
                const identifier = this.getRandomId();
                const listener = (ev) => {
                    if (ev.data && ev.data.type === "controller-variable-result" && ev.data.id === identifier) {
                        window.removeEventListener("message", listener);
                        return resolve(ev.data.value);
                    }
                };
                window.addEventListener("message", listener);
                window.postMessage({
                    id: identifier,
                    route: path,
                    type: "controller-variable",
                }, "*");
            });
        });
    }
}
Utils.interceptFunction = (path, func, action) => {
    window.addEventListener("message", (ev) => {
        if (ev.data && ev.data.type === "intercept-function-result" && ev.data.id === path + func) {
            action();
        }
    });
    window.postMessage({
        function: func,
        route: path,
        type: "intercept-function",
    }, "*");
};
Utils.injectPageScript = (file) => __awaiter(this, void 0, void 0, function* () {
    const brow = chrome || browser;
    const src = brow.extension.getURL(file);
    const element = document.createElement("script");
    element.src = src;
    document.head.appendChild(element);
    return new Promise((resolve) => {
        element.addEventListener("load", () => {
            resolve();
        });
    });
});
Utils.sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
Utils.getBuilderControllerVariableInjected = false;
exports.default = Utils;


/***/ })

/******/ });
//# sourceMappingURL=content.js.map