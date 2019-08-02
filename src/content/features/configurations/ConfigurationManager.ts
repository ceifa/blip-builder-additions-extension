import Utils from "../../../shared/Utils";
import { inject } from "../../Content";
import FeatureBase from "../FeatureBase";
import ActionNameFixerConfiguration from "./ActionNameFixerConfiguration";
import IConfiguration from "./Configuration";
import EventTrackConfiguration from "./EventTrackConfiguration";
import LoopIdentifierConfiguration from "./LoopIdentifierConfiguration";

export const configurations: IConfiguration[] = [
    new EventTrackConfiguration(),
    new LoopIdentifierConfiguration(),
    new ActionNameFixerConfiguration(),
];

export default class ConfigurationManager extends FeatureBase {
    public async onLoadBuilder(): Promise<void> {
        this.addEventListeners();
        await this.renderAddictionsMenuButton();
    }

    public async onUnloadBuilder(): Promise<void> {
        this.closeAddictionsMenuSidebar();
    }

    private addEventListeners = async () => {
        await inject.interceptFunction(null, "closeSidebar", this.closeAddictionsMenuSidebar);
        await inject.interceptFunction("SidebarContentService", "showSidebar", this.closeAddictionsMenuSidebar);
    }

    private renderAddictionsMenuButton = async () => {
        const res = await fetch(Utils.getUrl("resources/menuActionButton.html"));
        const html = await res.text();

        const iconButtonList = document.querySelector(".icon-button-list");
        const addictionsButton = document.createElement("li");

        addictionsButton.id = "addictions-menu-button";
        addictionsButton.innerHTML = html;
        addictionsButton.onclick = this.openCustomSidebar;

        iconButtonList.appendChild(addictionsButton);
    }

    private openCustomSidebar = async () => {
        await inject.callFunction(null, "closeSidebar", []);
        const addictionsSidebar = await this.renderAddictionsMenuSidebar();

        const closeButton = addictionsSidebar.querySelector("#addictions-menu-close");
        closeButton.addEventListener("click", this.closeAddictionsMenuSidebar);

        configurations.forEach((c: IConfiguration) => c.onLoadConfiguration());
    }

    private renderAddictionsMenuSidebar = async () => {
        const res = await fetch(Utils.getUrl("resources/addictionsConfiguration.html"));
        const html = await res.text();

        const mainArea = document.getElementById("main-content-area");
        const addictionsSidebar = document.createElement("div");
        addictionsSidebar.id = "addictions-menu";
        addictionsSidebar.innerHTML = html;

        mainArea.appendChild(addictionsSidebar);

        await Utils.sleep(350);
        addictionsSidebar.children.item(0).classList.add("ng-enter-active");

        return addictionsSidebar;
    }

    private closeAddictionsMenuSidebar = async () => {
        const menuElement = document.getElementById("addictions-menu");
        if (menuElement) {
            menuElement.remove();
        }
    }
}
