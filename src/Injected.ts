window.addEventListener("message", (ev) => {
    function clone(cloneable: any): any {
        let copy: any;

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

    const getController = (selector: string, controller: string) => {
        const element = window.angular && window.angular.element(document.querySelector(selector));

        if (element) {
            if (controller) {
                return element.controller(controller);
            } else {
                return element.controller();
            }
        }

        return false;
    };

    const getControllerVariable = (selector: string, controllerName: string, route: string) => {
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
        const result = (value: any) => {
            try {
                window.postMessage({
                    id: ev.data.id,
                    type: "controller-variable-result",
                    value: clone(value),
                }, "*");
            } catch{
                window.postMessage({
                    id: ev.data.id,
                    type: "controller-variable-result",
                    value: null,
                }, "*");
            }
        };

        return result(getControllerVariable(ev.data.selector, ev.data.controller, ev.data.route));
    } else if (ev.data && ev.data.type === "intercept-function" && ev.data.function) {
        const obj = getControllerVariable(ev.data.selector, ev.data.controller, ev.data.route);

        if (obj) {
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
    } else if (ev.data && ev.data.type === "call-function") {
        const obj = getControllerVariable(ev.data.selector, ev.data.controller, ev.data.route);
        obj[ev.data.func](...ev.data.params);
    }
});
