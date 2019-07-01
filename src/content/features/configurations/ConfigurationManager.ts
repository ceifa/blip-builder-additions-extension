import Utils from "../../../shared/Utils";
import { inject } from "../../Content";
import FeatureBase from "../FeatureBase";
import IConfiguration from "./Configuration";
import EventTrackConfiguration from "./EventTrackConfiguration";
import LoopIdentifierConfiguration from "./LoopIdentifierConfiguration";

export const configurations: IConfiguration[] = [
    new EventTrackConfiguration(),
    new LoopIdentifierConfiguration(),
];

export default class ConfigurationManager extends FeatureBase {
    private isCustomTabOpened: boolean = false;

    public async onLoadBuilder(): Promise<void> {
        await inject.interceptFunction("SidebarContentService", "showSidebar", this.addCustomConfiguration);
    }

    private addCustomConfiguration = async (): Promise<void> => {
        const configurationTab = document.getElementById("flow-config-tab");
        const contentTabItems = document.querySelectorAll("ul.content-tabs-items");

        if (configurationTab) {
            this.isCustomTabOpened = false;

            contentTabItems.forEach((contentTab) => {
                if (contentTab.childElementCount === 2) {
                    let currentActive: Element;

                    const customTab = document.createElement("li");
                    contentTab.childNodes.forEach((c) => c.addEventListener("click", async () => {
                        if (this.isCustomTabOpened) {
                            this.isCustomTabOpened = false;

                            const customContent = document.getElementById("customContent");
                            if (customContent) {
                                customContent.remove();
                            }

                            customTab.classList.remove("active");

                            await Utils.sleep(50);
                            const contents = document.querySelectorAll(".tab-content");
                            if (Array.from(contents)
                                .every((content: Element) => content.classList.contains("ng-hide"))) {
                                currentActive.classList.remove("ng-hide");
                            }
                        }
                    }));

                    customTab.id = "addictionsTab";
                    customTab.innerHTML = "<span>Addictions</span>";
                    customTab.classList.add("cursor-pointer");
                    customTab.addEventListener("click", async () => {
                        if (!this.isCustomTabOpened) {
                            this.isCustomTabOpened = true;

                            contentTab.childNodes.forEach((t: Element) =>
                                t && t.classList && t.classList.remove("active"));

                            customTab.classList.add("active");

                            const contents = document.querySelectorAll(".tab-content");
                            currentActive = Array.from(contents).find((c) => !c.classList.contains("ng-hide"));
                            if (currentActive) {
                                currentActive.classList.add("ng-hide");
                            }

                            await this.renderCustomConfiguration();
                            configurations.forEach((c: IConfiguration) => c.onLoadConfiguration());
                        }
                    });

                    contentTab.appendChild(customTab);
                }
            });
        }
    }

    private renderCustomConfiguration = async () => {
        const res = await fetch(Utils.getUrl("resources/addictionsConfiguration.html"));
        const html = await res.text();

        const configSection = document.querySelector(".content-tabs div");
        const content = document.createElement("div");
        content.id = "customContent";
        content.innerHTML = html;
        configSection.appendChild(content);
    }
}
