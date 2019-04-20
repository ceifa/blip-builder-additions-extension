export default class Utils {
    public static StartListeningCommands = () => {
        window.addEventListener("message", (message: MessageEvent) => {
            if (message.data.isAddiction && !message.data.fromExtension) {
                Utils.resolvers[message.data.identifier].forEach((f) => f(message.data.result));

                if (message.data.shouldDelete) {
                    delete Utils.resolvers[message.data.identifier];
                }
            }
        });
    }

    public static InjectPageScript = (file: string) => {
        const element = document.createElement("script");
        element.src = Utils.GetUrl(file);

        document.head.appendChild(element);
        return new Promise((resolve) => element.addEventListener("load", resolve));
    }

    public static SendCommand = (functionName: string, ...parameters: any[]): Promise<any> =>
        new Promise(async (resolve) => {
            if (!Utils.isScriptInjected) {
                await Utils.InjectPageScript("js/injected.js");
                Utils.isScriptInjected = true;
            }

            const identifier = Utils.GetRandomIdentifier();
            Utils.resolvers[identifier] = [...(Utils.resolvers[identifier] || []), resolve];

            window.postMessage({
                fromExtension: true,
                function: functionName,
                identifier,
                isAddiction: true,
                parameters,
            }, "*");
        })

    public static InterceptFunction =
        async (selector: string, controllerName: string, route: string, functionName: string, callback: () => void) => {
            await Utils.SendCommand("InterceptFunction", selector, controllerName, route, functionName);

            const key = `${route}_${functionName}`;
            Utils.resolvers[key] = [...(Utils.resolvers[key] || []), callback];
        }

    public static GetRandomIdentifier = () => Math.random().toString(36).substr(2, 9);

    public static GetUrl = (path: string) => (chrome || browser).extension.getURL(path);

    public static Sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    private static resolvers: { [identifier: string]: Array<(value?: any) => void> } = {};

    private static isScriptInjected: boolean = false;
}
