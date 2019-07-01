import Utils from "../../../shared/Utils";
import { inject } from "../../Content";
import IConfiguration from "./Configuration";

export default class ActionNameFixerConfiguration implements IConfiguration {
    private readonly possibleActions = [{
        alias: ["Registro de eventos", "Event tracking"],
        name: "TrackEvent",
        nameResolver: (settings: any) => `Track "${settings.category}"`,
    }, {
        alias: ["Executar script", "Execute script"],
        name: "ExecuteScript",
        nameResolver: (settings: any) => `Process "${settings.outputVariable}"`,
    }, {
        alias: ["Gerenciar lista de distribuição", "Manage distribution list"],
        name: "ManageList",
        nameResolver: (settings: any) => `${settings.action} ${settings.action === "Add" ? "to" : "from"}
            list "${settings.listName.replace("@broadcast.msging.net", "")}"`,
    }, {
        alias: ["Redirecionar a um serviço", "Redirect to service"],
        name: "Redirect",
        nameResolver: (settings: any) => `Redirect to "${settings.address}"`,
    }, {
        alias: ["Definir contato", "Set contact"],
        name: "MergeContact",
        nameResolver: (settings: any) => `Set ${Object.keys(settings).join(", ")} to contact`,
    }, {
        alias: ["Requisição HTTP", "Process HTTP"],
        name: "ProcessHttp",
        nameResolver: (settings: any) => `Process "${settings.responseBodyVariable}" using "${settings.method}"`,
    }, {
        alias: ["Definir variável", "Set variable"],
        name: "SetVariable",
        nameResolver: (settings: any) => `Set "${settings.variable}" to "${settings.value}"`,
    }, {
        alias: ["Processar comando", "Process command"],
        name: "ProcessCommand",
        nameResolver: (settings: any) => `Process "${settings.method.toUpperCase()}" to "${settings.uri}"`,
    }];

    public onLoadConfiguration = (): void => {
        document.getElementById("fix-action-names-apply-btn").addEventListener("click", this.handleFixActionNames);
    }

    private handleFixActionNames = async () => {
        try {
            await inject.callFunction("LoadingService", "startLoading", [false]);

            const flow = await inject.getVariable("flow");
            Object.keys(flow).forEach((k: string) => {
                flow[k].$enteringCustomActions = flow[k].$enteringCustomActions.map(this.replaceActionNameIfDefault);
                flow[k].$leavingCustomActions = flow[k].$leavingCustomActions.map(this.replaceActionNameIfDefault);
            });

            await inject.callFunction("BuilderService", "setFlow", [flow]);

            await Utils.sleep(500);
            await inject.callFunction("LoadingService", "stopLoading", []);
            await inject.callFunction("$state", "reload", []);
        } catch (e) {
            // tslint:disable-next-line: no-console
            console.error(e);

            await inject.callFunction("LoadingService", "stopLoading", []);
            await inject.callFunction("ngToast", "danger",
                ["Error when trying to apply action names. (Maybe nothing has been applied)"]);
        }
    }

    private replaceActionNameIfDefault = (action: any) => {
        const actionNameResolver = this.possibleActions.find((p) => p.name === action.type);
        if (actionNameResolver.alias.includes(action.$title)) {
            action.$title = actionNameResolver.nameResolver(action.settings).substring(0, 50);
        }
        return action;
    }
}
