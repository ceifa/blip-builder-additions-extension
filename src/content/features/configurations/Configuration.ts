import Utils from "../../../shared/Utils";
import FeatureBase from "../FeatureBase";
import EventTrackConfiguration from "./EventTrackConfiguration";
import IConfiguration from "./IConfiguration";
import LoopIdentifierConfiguration from "./LoopIdentifierConfiguration";

export const configurations: IConfiguration[] = [
    new EventTrackConfiguration(),
    new LoopIdentifierConfiguration(),
];

export default class Configuration extends FeatureBase {
    private isCustomTabOpened: boolean = false;

    public async OnLoadBuilder(): Promise<void> {
        await Utils.InterceptFunction(
            "#canvas", null, "SidebarContentService", "showSidebar", this.AddCustomConfiguration);
    }

    private AddCustomConfiguration = async (): Promise<void> => {
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

                            await Utils.Sleep(50);
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

                            await this.RenderCustomConfiguration();
                            configurations.forEach((c: IConfiguration) => c.OnLoadConfiguration());
                        }
                    });

                    contentTab.appendChild(customTab);
                }
            });
        }
    }

    private RenderCustomConfiguration = async () => {
        const res = await fetch(Utils.GetUrl("resources/addictionsConfiguration.html"));
        const html = await res.text();

        const configSection = document.querySelector(".content-tabs div");
        const content = document.createElement("div");
        content.id = "customContent";
        content.innerHTML = html;
        configSection.appendChild(content);
    }
}
