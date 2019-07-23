import ICommands from "./Commands";
import { cloneObject } from "./InjectHelper";

export default class Injectables implements ICommands {
    [key: string]: any;

    public interceptFunction(route: string, functionName: string): void {
        const source = this.getControllerVariable("#canvas", null, route);
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

    public callFunction(route: string, functionName: string, parameters: any[]): any {
        const functionSource = this.getControllerVariable("#canvas", null, route);
        const result = functionSource && functionSource[functionName](...(parameters || []));
        return this.resolvePromise(result);
    }

    public setVariable(route: string, value: any): void {
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

    public getVariable(route: string): any {
        return cloneObject(this.getControllerVariable("#canvas", null, route));
    }

    private resolvePromise = (promise: any): any => {
        return Promise.resolve(promise).then((r: any) => {
            if (r && typeof r.then === "function") {
                return this.resolvePromise(r);
            }

            return r;
        });
    }

    private getController = (selector: string, controllerName: string): any => {
        const element = window.angular && window.angular.element(document.querySelector(selector));
        return element && (controllerName ? element.controller(controllerName) : element.controller());
    }

    private getControllerVariable = (selector: string, controllerName: string, route: string): any => {
        const controller = this.getController(selector, controllerName);

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
