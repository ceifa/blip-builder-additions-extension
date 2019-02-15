window.addEventListener("message", function (ev) {
    if (ev.data && ev.data.type === "controller-variable" && ev.data.route) {
        var result = function(value) {
            window.postMessage({
                type: "controller-variable-result",
                value: value,
                id: ev.data.id
            }, "*");
        };

        var canvas = document.getElementById("canvas");

        if (canvas) {
            var current = window.angular.element(canvas).controller();
            var route = ev.data.route.split('.');

            for (var i = 0; i < route.length; i++) {
                current = current[route[i]];

                if (current == null) {
                    return result(null);
                }
            }

            return result(current);
        }

        return result(null);
    }
});