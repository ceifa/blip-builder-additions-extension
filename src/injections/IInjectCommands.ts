export default interface IInjectCommands {
    InterceptFunction(route: string, functionName: string, callback: () => void): void;

    CallFunction(route: string, functionName: string, parameters: any[]): any;

    SetVariable(route: string, value: any): void;

    GetVariable(route: string): any;
}
