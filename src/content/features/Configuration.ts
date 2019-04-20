import Utils from "../../shared/Utils";
import { FeatureBase } from "./FeatureBase";

export default class Configuration extends FeatureBase {
    public async OnLoadBuilder(): Promise<void> {
        await Utils.InterceptFunction(
            "#canvas", null, "SidebarContentService", "showSidebar", this.AddCustomConfiguration);
    }

    private AddCustomConfiguration = (): void => {
        setTimeout(() => {
            const configurationTab = document.getElementById("flow-config-tab");
            const contentTabItems = document.querySelector("ul.content-tabs-items");

            if (configurationTab && contentTabItems.childElementCount === 2) {
                const customTab = document.createElement("li");
                contentTabItems.childNodes.forEach(c => c.addEventListener("click", e => {
                    document.getElementById("customContent") && document.getElementById("customContent").remove();
                    customTab.classList.remove("active");
                }));

                customTab.id = "addictionsTab";
                customTab.innerHTML = "<span>Addictions</span>";
                customTab.classList.add("cursor-pointer");
                customTab.addEventListener("click", async e => {
                    contentTabItems.childNodes.forEach((t: Element) => t && t.classList && t.classList.remove("active"));
                    customTab.classList.add("active");

                    const contents = document.querySelectorAll(".tab-content");
                    contents.forEach(c => !c.classList.contains("ng-hide") && c.classList.add("ng-hide"));
                    await this.RenderCustomConfiguration();
                });

                contentTabItems.appendChild(customTab);
            }
        }, 100);
    }

    private RenderCustomConfiguration = async () => {
        const res = await fetch(Utils.GetUrl("resources/addictionsConfiguration.html"));
        const html = await res.text();

        const configSection = document.querySelector(".content-tabs div");
        const content = document.createElement("div");
        content.id = "customContent";
        content.innerHTML = html;
        configSection.appendChild(content);

        this.AddEventTrackExtrasHandle();
    }

    private AddEventTrackExtrasHandle = () => {
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
                await Utils.SendCommand("CallFunction", "#canvas", null, "LoadingService", "startLoading", [false]);

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

                let flow = await Utils.SendCommand("Variable", "#canvas", null, "flow");
                Object.keys(flow).forEach(k => {
                    flow[k]["$enteringCustomActions"] = replaceExtras(flow[k]["$enteringCustomActions"]);
                    flow[k]["$leavingCustomActions"] = replaceExtras(flow[k]["$leavingCustomActions"]);
                });

                await Utils.SendCommand("CallFunction", "#canvas", null, "BuilderService", "setFlow", [flow]);

                await Utils.Sleep(500);
                await Utils.SendCommand("CallFunction", "#canvas", null, "LoadingService", "stopLoading", []);
                await Utils.SendCommand("CallFunction", "#canvas", null, "$state", "reload", []);
            } catch {
                await Utils.SendCommand("CallFunction", "#canvas", null, "ngToast", "danger", ["Error when trying to apply event track extras. (nothing was applied)"]);
                await Utils.SendCommand("CallFunction", "#canvas", null, "LoadingService", "stopLoading", []);
            }
        });
    }
}