import { FeatureBase } from "./FeatureBase";
import Utils from "../../shared/Utils";

export default class Configuration extends FeatureBase {
    public OnLoadBuilder(): void {
        Utils.interceptFunction("#canvas", null, "SidebarContentService", "showSidebar", this.AddCustomConfiguration);
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
        const res = await fetch(Utils.getUrl("resources/addictionsConfiguration.html"));
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
                Utils.callFunction("#canvas", null, "LoadingService", "startLoading", [false]);

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

                let flow = await Utils.getBuilderControllerVariable("#canvas", null, "flow");
                Object.keys(flow).forEach(k => {
                    flow[k]["$enteringCustomActions"] = replaceExtras(flow[k]["$enteringCustomActions"]);
                    flow[k]["$leavingCustomActions"] = replaceExtras(flow[k]["$leavingCustomActions"]);
                });

                Utils.callFunction("#canvas", null, "BuilderService", "setFlow", [flow]);

                setTimeout(() => {
                    Utils.callFunction("#canvas", null, "LoadingService", "stopLoading", []);
                    Utils.callFunction("#canvas", null, "$state", "reload", []);
                }, 500);
            } catch {
                const toast = Utils.callFunction("#canvas", null, "ngToast", "danger", ["Error when trying to apply event track extras. (nothing was applied)"]);
                Utils.callFunction("#canvas", null, "LoadingService", "stopLoading", []);
            }
        });
    }
}