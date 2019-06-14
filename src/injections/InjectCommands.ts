import { cloneObject } from "./InjectHelper";

export default class Injectables {
    [key: string]: any;

    public InterceptFunction =
        (selector: string, controllerName: string, route: string, functionName: string): void => {
            const source = this.GetControllerVariable(selector, controllerName, route);
            const functionToWrap = source[functionName];

            source[functionName] = function() {
                const result = functionToWrap.apply(this, arguments);

                window.postMessage({
                    identifier: `${route}_${functionName}`,
                    isAddiction: true,
                    type: "intercept-function-call",
                }, "*");

                return result;
            };
        }

    public CallFunction =
        (selector: string, controllerName: string, route: string, functionName: string, parameters: any[]): any => {
            const functionSource = this.GetControllerVariable(selector, controllerName, route);
            return functionSource && functionSource[functionName](...(parameters || []));
        }

    public SetVariable = (selector: string, controllerName: string, route: string, value: any): any => {
        const controller = this.GetController(selector, controllerName);
        if (controller) {
            const paths = route && route.split(".");
            let current = controller;

            if (paths) {
                for (const path of paths.slice(0, -1)) {
                    current = current[path];
                }
            }

            current[paths[paths.length - 1]] = value;
        }

        return true;
    }

    public GetVariable = (selector: string, controllerName: string, route: string): any => {
        return cloneObject(this.GetControllerVariable(selector, controllerName, route));
    }

    public StartZoom = async () => {
        this.StopZoom();

        const builderContainer = document.querySelector(".builder-container");
        builderContainer.addEventListener("mousewheel", this.ZoomHandler, true);
        builderContainer.addEventListener("DOMMouseScroll", this.ZoomHandler, true);
    }

    public StopZoom = () => {
        const builderContainer = document.querySelector(".builder-container");
        builderContainer.removeEventListener("mousewheel", this.ZoomHandler, true);
        builderContainer.removeEventListener("DOMMouseScroll", this.ZoomHandler, true);
    }

    private ZoomHandler = async (ev: MouseWheelEvent) => {
        try {
            ev.stopImmediatePropagation();
            ev.stopPropagation();
            ev.preventDefault();
            return false;
        } finally {
            const incrementValue = 10;
            await this.SetZoom(ev.deltaY > 0 ? incrementValue : -incrementValue);
        }
    }

    private SetZoom = async (increment: number) => {
        const currentZoomValue = await this.GetVariable("#canvas", null, "zoomValue");
        const value = Math.max(Math.min(currentZoomValue + increment, 100), 20);

        await this.CallFunction("#canvas", null, null, "setZoomValue", [value]);
        await this.SetVariable("#canvas", null, "zoomValue", value);

        for (let i = 0; i < 2; i++) {
            (document.querySelector(".zoom.zoom-display") as HTMLElement).click();
        }
    }

    private GetController = (selector: string, controllerName: string): any => {
        const element = window.angular && window.angular.element(document.querySelector(selector));
        return element && (controllerName ? element.controller(controllerName) : element.controller());
    }

    private GetControllerVariable = (selector: string, controllerName: string, route: string): any => {
        const controller = this.GetController(selector, controllerName);

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
    }
}
