import Storager from "../../../shared/Storager";
import { Command } from "../../../shared/types/Command";
import Utils from "../../../shared/Utils";
import IConfiguration from "./IConfiguration";

export default class EventTrackConfiguration implements IConfiguration {
    private readonly storageKey: string = "event-track-extras";

    public OnLoadConfiguration = (): void => {
        document.getElementById("extras-add-btn").addEventListener("click", this.handleAddExtras);
        document.getElementById("extras-apply-btn").addEventListener("click", this.handleApplyExtras);
        this.populateExtras();
    }

    private handleAddExtras = () => {
        const template = document.getElementById("key-value-template");
        const list = document.getElementById("extras-key-value-list");

        const listItem = document.createElement("li");
        listItem.innerHTML = template.innerHTML;
        listItem.querySelector("i").addEventListener("click", listItem.remove);

        Array.from(listItem.getElementsByTagName("input"))
            .forEach((i) => i.addEventListener("blur", this.saveCurrentExtras));

        list.appendChild(listItem);

        return listItem;
    }

    private handleApplyExtras = async () => {
        try {
            await Utils.SendCommand(
                Command.CallFunction, "#canvas", null, "LoadingService", "startLoading", [false]);

            const extras = this.getCurrentExtras();

            const replaceExtras = (actions: any) => {
                let newActions: any[] = [];

                for (const action of actions) {
                    if (action.type === "TrackEvent") {
                        extras.forEach((e: any) => {
                            if (e.key && e.value) {
                                action.settings.extras[e.key] = e.value;
                            }
                        });
                    }

                    newActions = [...newActions, action];
                }

                return newActions;
            };

            const flow = await Utils.SendCommand(Command.GetVariable, "#canvas", null, "flow");
            Object.keys(flow).forEach((k: string) => {
                flow[k].$enteringCustomActions = replaceExtras(flow[k].$enteringCustomActions);
                flow[k].$leavingCustomActions = replaceExtras(flow[k].$leavingCustomActions);
            });

            await Utils.SendCommand(Command.CallFunction, "#canvas", null, "BuilderService", "setFlow", [flow]);

            await Utils.Sleep(500);
            await Utils.SendCommand(Command.CallFunction, "#canvas", null, "LoadingService", "stopLoading");
            await Utils.SendCommand(Command.CallFunction, "#canvas", null, "$state", "reload");
        } catch {
            await Utils.SendCommand(Command.CallFunction, "#canvas", null, "LoadingService", "stopLoading");
            await Utils.SendCommand(Command.CallFunction, "#canvas", null, "ngToast", "danger",
                ["Error when trying to apply event track extras. (Maybe nothing has been applied)"]);
        }
    }

    private populateExtras = async () => {
        const currentBotIdentifier =
            await Utils.SendCommand(Command.GetVariable, "#canvas", null, "application.shortName");
        const extras = await Storager.get(`${currentBotIdentifier}_${this.storageKey}`);

        if (extras && extras.length > 0) {
            for (const extra of extras) {
                const element = this.handleAddExtras();
                const extraKeyElement = element.getElementsByClassName("extras-key")[0] as HTMLInputElement;
                const extraValueElement = element.getElementsByClassName("extras-value")[0] as HTMLInputElement;

                if (extraKeyElement && extraValueElement) {
                    extraKeyElement.value = extra.key;
                    extraValueElement.value = extra.value;
                }
            }
        }
    }

    private saveCurrentExtras = async () => {
        const currentBotIdentifier =
            await Utils.SendCommand(Command.GetVariable, "#canvas", null, "application.shortName");
        await Storager.set(`${currentBotIdentifier}_${this.storageKey}`, this.getCurrentExtras());
    }

    private getCurrentExtras = () => {
        const extrasKeys = document.getElementsByClassName("extras-key");
        const extrasValues = document.getElementsByClassName("extras-value");

        let extras: Array<{ key: string, value: string }> = [];
        for (let i = 1; i < extrasKeys.length; i++) {
            extras = [...extras, {
                key: (extrasKeys[i] as HTMLInputElement).value,
                value: (extrasValues[i] as HTMLInputElement).value,
            }];
        }

        return extras;
    }
}
