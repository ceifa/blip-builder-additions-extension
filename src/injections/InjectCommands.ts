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

    public GetVariable = (selector: string, controllerName: string, route: string): any => {
        return cloneObject(this.GetControllerVariable(selector, controllerName, route));
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
