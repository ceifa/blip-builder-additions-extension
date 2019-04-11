export default class Utils {
    public static interceptFunction =
        (selector: string, controller: string, path: string, func: string, action: () => void) => {
            window.addEventListener("message", (ev: MessageEvent) => {
                if (ev.data && ev.data.type === "intercept-function-result" && ev.data.id === path + func) {
                    action();
                }
            });

            window.postMessage({
                controller,
                function: func,
                route: path,
                selector,
                type: "intercept-function",
            }, "*");
        }

    public static injectPageScript = async (file: string) => {
        const element = document.createElement("script");
        element.src = Utils.getUrl(file);

        document.head.appendChild(element);

        return new Promise((resolve) => {
            element.addEventListener("load", () => {
                resolve();
            });
        });
    }

    public static getRandomId() {
        return Math.random().toString(36).substr(2, 9);
    }

    public static async getBuilderControllerVariable(selector: string, controller: string, path: string): Promise<any> {
        if (!this.getBuilderControllerVariableInjected) {
            await Utils.injectPageScript("js/injected.js");
            this.getBuilderControllerVariableInjected = true;
        }

        return new Promise((resolve) => {
            const identifier = this.getRandomId();

            const listener = (ev: MessageEvent) => {
                if (ev.data && ev.data.type === "controller-variable-result" && ev.data.id === identifier) {
                    window.removeEventListener("message", listener);
                    return resolve(ev.data.value);
                }
            };

            window.addEventListener("message", listener);

            window.postMessage({
                controller,
                id: identifier,
                route: path,
                selector,
                type: "controller-variable",
            }, "*");
        });
    }

    public static callFunction(selector: string, controller: string, path: string, func: string, params: Array<any>) {
        window.postMessage({
            controller,
            func,
            params,
            route: path,
            selector,
            type: "call-function",
        }, "*");
    }

    public static getUrl = (path: string) => (chrome || browser).extension.getURL(path);

    public static sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    private static getBuilderControllerVariableInjected: boolean = false;
}
