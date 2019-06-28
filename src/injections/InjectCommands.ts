import IInjectCommands from "./IInjectCommands";
import { cloneObject } from "./InjectHelper";

export default class Injectables implements IInjectCommands {
    [key: string]: any;

    public InterceptFunction(route: string, functionName: string): void {
        const source = this.GetControllerVariable("#canvas", null, route);
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

    public CallFunction(route: string, functionName: string, parameters: any[]): any {
        const functionSource = this.GetControllerVariable("#canvas", null, route);
        return functionSource && functionSource[functionName](...(parameters || []));
    }

    public SetVariable(route: string, value: any): void {
        const controller = this.GetController("#canvas", null);

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
    }

    public GetVariable(route: string): any {
        return cloneObject(this.GetControllerVariable("#canvas", null, route));
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
