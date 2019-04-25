import { Command } from "../../../shared/types/Command";
import Utils from "../../../shared/Utils";
import IConfiguration from "./IConfiguration";

export default class EventTrackConfiguration implements IConfiguration {
    public OnLoadConfiguration = (): void => {
        document.getElementById("extras-add-btn").addEventListener("click", ev => {
            const template = document.getElementById("key-value-template");
            const list = document.getElementById("extras-key-value-list");

            const listItem = document.createElement("li");
            listItem.innerHTML = template.innerHTML;
            listItem.querySelector("i").addEventListener("click", ev => {
                listItem.remove();
            });

            list.appendChild(listItem);
        });

        document.getElementById("extras-apply-btn").addEventListener("click", async ev => {
            try {
                await Utils.SendCommand(
                    Command.CallFunction, "#canvas", null, "LoadingService", "startLoading", [false]);

                let extras: { key: string, value: string }[] = [];

                const extrasKeys = document.getElementsByClassName("extras-key");
                const extrasValues = document.getElementsByClassName("extras-value");

                for (let i = 0; i < extrasKeys.length; i++) {
                    extras = [...extras, { key: (<HTMLInputElement>extrasKeys[i]).value, value: (<HTMLInputElement>extrasValues[i]).value }]
                }

                const replaceExtras = (search: any) => {
                    for (let i = 0; i < search.length; i++) {
                        if (search[i].type === "TrackEvent") {
                            extras.forEach((e: any) => {
                                if (e.key && e.value) {
                                    search[i].settings.extras[e.key] = e.value;
                                }
                            });
                        }
                    }

                    return search;
                }

                let flow = await Utils.SendCommand(Command.GetVariable, "#canvas", null, "flow");
                Object.keys(flow).forEach(k => {
                    flow[k]["$enteringCustomActions"] = replaceExtras(flow[k]["$enteringCustomActions"]);
                    flow[k]["$leavingCustomActions"] = replaceExtras(flow[k]["$leavingCustomActions"]);
                });

                await Utils.SendCommand(Command.CallFunction, "#canvas", null, "BuilderService", "setFlow", [flow]);

                await Utils.Sleep(500);
                await Utils.SendCommand(Command.CallFunction, "#canvas", null, "LoadingService", "stopLoading", []);
                await Utils.SendCommand(Command.CallFunction, "#canvas", null, "$state", "reload", []);
            } catch {
                await Utils.SendCommand(Command.CallFunction, "#canvas", null, "ngToast", "danger", ["Error when trying to apply event track extras. (nothing was applied)"]);
                await Utils.SendCommand(Command.CallFunction, "#canvas", null, "LoadingService", "stopLoading", []);
            }
        });

    };
}
