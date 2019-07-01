export default interface ICommands {
    interceptFunction(route: string, functionName: string, callback: () => void): void;

    callFunction(route: string, functionName: string, parameters: any[]): any;

    setVariable(route: string, value: any): void;

    getVariable(route: string): any;
}
