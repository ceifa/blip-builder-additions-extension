import IInjectCommands from "./injections/IInjectCommands";
import Utils from "./shared/Utils";

export default class Inject implements IInjectCommands {
    private resolvers: { [identifier: string]: Array<(value?: any) => void> } = {};

    private isScriptInjected: boolean = false;

    public InterceptFunction(route: string, functionName: string, callback: () => any): void {
        // tslint:disable-next-line: no-arg
        this.SendCommand(this.InterceptFunction.name, route, functionName);

        const key = `${route}_${functionName}`;
        this.resolvers[key] = [...(this.resolvers[key] || []), callback];
    }

    public CallFunction(route: string, functionName: string, parameters: any[]) {
        // tslint:disable-next-line: no-arg
        return this.SendCommand(this.CallFunction.name, ...arguments);
    }

    public SetVariable(route: string, value: any): void {
        // tslint:disable-next-line: no-arg
        this.SendCommand(this.SetVariable.name, ...arguments);
    }

    public GetVariable(route: string): any {
        // tslint:disable-next-line: no-arg
        return this.SendCommand(this.GetVariable.name, ...arguments);
    }

    public StartListeningCommands() {
        window.addEventListener("message", (message: MessageEvent) => {
            if (message.data.isAddiction && !message.data.fromExtension) {
                this.resolvers[message.data.identifier].forEach((f) => f(message.data.result));

                if (message.data.shouldDelete) {
                    delete this.resolvers[message.data.identifier];
                }
            }
        });
    }

    private SendCommand(command: string, ...parameters: any[]): Promise<any> {
        return new Promise(async (resolve) => {
            if (!this.isScriptInjected) {
                await Utils.InjectPageScript("js/injected.js");
                this.isScriptInjected = true;
            }

            const identifier = Utils.GetRandomIdentifier();
            this.resolvers[identifier] = [...(this.resolvers[identifier] || []), resolve];

            window.postMessage({
                fromExtension: true,
                function: command,
                identifier,
                isAddiction: true,
                parameters,
            }, "*");
        });
    }
}
