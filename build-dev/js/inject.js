window.addEventListener("message", function (ev) {
    function clone(obj) {
        var copy;
    
        // Handle the 3 simple types, and null or undefined
        if (null == obj || "object" != typeof obj) return obj;
    
        // Handle Date
        if (obj instanceof Date) {
            copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }
    
        // Handle Array
        if (obj instanceof Array) {
            copy = [];
            for (var i = 0, len = obj.length; i < len; i++) {
                copy[i] = clone(obj[i]);
            }
            return copy;
        }
    
        // Handle Object
        if (obj instanceof Object) {
            copy = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
            }
            return copy;
        }
    
        throw new Error("Unable to copy obj! Its type isn't supported.");
    }

    var getController = function getController() {
        var canvas = document.getElementById("canvas");

        if (canvas) {
            return window.angular.element(canvas).controller();
        }

        return false;
    };

    var getControllerVariable = function getControllerVariable(route) {
        var controller = getController();

        if (controller) {
            var route = route && route.split('.');
            var current = controller;

            if (route) {
                for (var i = 0; i < route.length; i++) {
                    current = current[route[i]];

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
        var result = function result(value) {
            window.postMessage({
                type: "controller-variable-result",
                value: clone(value),
                id: ev.data.id
            }, "*");
        };

        return result(getControllerVariable(ev.data.route));
    } else if (ev.data && ev.data.type === "intercept-function" && ev.data.function) {
        var obj = getControllerVariable(ev.data.route);
        var fnToWrap = obj[ev.data.function];

        obj[ev.data.function] = function () {
            var result = fnToWrap.apply(this, arguments);

            window.postMessage({
                type: "intercept-function-result",
                id: ev.data.route + ev.data.function
            });
            return result;
        };
    }
});