import Utils from "../../../shared/Utils";
import FeatureBase from "../FeatureBase";
import EventTrackConfiguration from "./EventTrackConfiguration";
import IConfiguration from "./IConfiguration";

export const configurations: IConfiguration[] = [
    new EventTrackConfiguration(),
];

export default class Configuration extends FeatureBase {
    public async OnLoadBuilder(): Promise<void> {
        await Utils.InterceptFunction(
            "#canvas", null, "SidebarContentService", "showSidebar", this.AddCustomConfiguration);
    }

    private AddCustomConfiguration = (): void => {
        const configurationTab = document.getElementById("flow-config-tab");
        const contentTabItems = document.querySelector("ul.content-tabs-items");

        if (configurationTab && contentTabItems.childElementCount === 2) {
            const customTab = document.createElement("li");
            contentTabItems.childNodes.forEach((c: ChildNode) =>
                c.addEventListener("click", () => {
                    const customContent = document.getElementById("customContent");

                    if (customContent) {
                        customContent.remove();
                        customTab.classList.remove("active");
                    }
                }));

            customTab.id = "addictionsTab";
            customTab.innerHTML = "<span>Addictions</span>";
            customTab.classList.add("cursor-pointer");
            customTab.addEventListener("click", async () => {
                contentTabItems.childNodes.forEach((t: Element) => t && t.classList && t.classList.remove("active"));
                customTab.classList.add("active");

                const contents = document.querySelectorAll(".tab-content");
                contents.forEach((c: Element) => !c.classList.contains("ng-hide") && c.classList.add("ng-hide"));

                await this.RenderCustomConfiguration();
                configurations.forEach((c: IConfiguration) => c.OnLoadConfiguration());
            });

            contentTabItems.appendChild(customTab);
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
