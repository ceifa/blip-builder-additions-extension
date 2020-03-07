import ICommands from "./injections/Commands";
import Utils from "./shared/Utils";

export default class Inject implements ICommands {
    private resolvers: { [identifier: string]: ((value?: any) => void)[] } = {};

    private isScriptInjected: boolean = false;

    public interceptFunction(route: string, functionName: string, callback: () => any): void {
        this.sendCommand(this.interceptFunction.name, route, functionName);

        const key = `${route}_${functionName}`;
        this.resolvers[key] = [...(this.resolvers[key] || []), callback];
    }

    public callFunction(route: string, functionName: string, parameters: any[]) {
        // tslint:disable-next-line: no-arg
        return this.sendCommand(this.callFunction.name, ...arguments);
    }

    public setVariable(route: string, value: any): void {
        // tslint:disable-next-line: no-arg
        this.sendCommand(this.setVariable.name, ...arguments);
    }

    public getVariable(route: string): any {
        // tslint:disable-next-line: no-arg
        return this.sendCommand(this.getVariable.name, ...arguments);
    }

    public startListeningCommands() {
        window.addEventListener("message", (message: MessageEvent) => {
            if (message.data.isAddiction && !message.data.fromExtension) {
                this.resolvers[message.data.identifier].forEach((f) => f(message.data.result));

                if (message.data.shouldDelete) {
                    delete this.resolvers[message.data.identifier];
                }
            }
        });
    }

    private sendCommand(command: string, ...parameters: any[]): Promise<any> {
        return new Promise(async (resolve) => {
            if (!this.isScriptInjected) {
                await Utils.injectPageScript("js/injected.js");
                this.isScriptInjected = true;
            }

            const identifier = Utils.getRandomIdentifier();
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
