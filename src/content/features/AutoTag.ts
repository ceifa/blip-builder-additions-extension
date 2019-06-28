import Utils from "../../shared/Utils";
import { inject } from "../Content";
import FeatureBase from "./FeatureBase";

export default class AutoTag extends FeatureBase {
    public OnLoadBuilder(): void {
        this.StartAsync();
    }

    private async StartAsync(): Promise<void> {
        await inject.InterceptFunction("SidebarContentService", "showSidebar", this.AddEventListeners);
    }

    private AddEventListeners = () => {
        const elements: NodeListOf<Element> =
            document.querySelectorAll("li[ng-click^='$ctrl.onAddAction'], i[ng-click^='$ctrl.onDeleteAction']");

        elements.forEach((e: Element) => {
            e.removeEventListener("click", this.RepairWrongTags);
            e.addEventListener("click", this.RepairWrongTags);
        });
    }

    private RepairWrongTags = async () => {
        if (!this.isEnabled) {
            return;
        }

        const enteringCustomActions: [] = await inject.GetVariable("editingState.$enteringCustomActions");
        const leavingCustomAction: [] = await inject.GetVariable("editingState.$leavingCustomActions");

        let actions: any[] = [...enteringCustomActions, ...leavingCustomAction];
        actions = actions.map((a) => a.type);

        let tags: any[] = await inject.GetVariable("editingState.$tags");
        tags = tags.map((t) => t.label);

        const possibleActions = [
            ...new Set(Array.from(document.querySelectorAll("li[ng-click^='$ctrl.onAddAction']"))
                .map((a) => a.getAttribute("ng-click").match("'(.*)'")[1]))];

        const shouldFixTags = tags.filter((t) => !actions.includes(t) && possibleActions.includes(t));
        shouldFixTags.forEach(this.RemoveTag);

        const shouldFixActions = actions.filter((a) => !tags.includes(a));
        shouldFixActions.forEach(this.AddTag);
    }

    private RemoveTag = (tagName: string) => {
        const tagElements = Array.from(document.querySelectorAll(".sidebar-content-header .blip-tag__label"));
        const correctTagElement = tagElements.find((t) => t.textContent.trim() === tagName);
        if (correctTagElement && correctTagElement.nextElementSibling) {
            (correctTagElement.nextElementSibling as HTMLElement).click();
        }
    }

    private AddTag = async (tagName: string) => {
        const tab = document.getElementById("node-content-tab");

        const header = tab.getElementsByClassName("sidebar-content-header")[0];
        const tagMenuBtn = header.getElementsByTagName("img");

        if (tagMenuBtn.length > 0) {
            tagMenuBtn[0].click();
        }

        const tagMenu = header.getElementsByTagName("blip-tags")[0];

        const input = tagMenu.getElementsByTagName("input")[0];
        input.value = tagName;

        await Utils.Sleep(10);

        input.dispatchEvent(new Event("input"));

        await Utils.Sleep(30);

        const options = tagMenu.getElementsByClassName("blip-select__options") as HTMLCollectionOf<HTMLElement>;

        if (options.length > 0) {
            options[0].style.display = "none";

            const correctTagOption =
                options[0].getElementsByClassName("blip-select__option") as HTMLCollectionOf<HTMLElement>;

            if (correctTagOption.length > 0) {
                correctTagOption[0].click();

                await Utils.Sleep(20);

                const color = this.configuration[tagName.toLowerCase()];

                const colorSelector =
                    tagMenu.getElementsByClassName("blip-tag-select-color") as HTMLCollectionOf<HTMLElement>;

                if (colorSelector && colorSelector.length > 0) {
                    colorSelector[0].style.display = "none";

                    const colors = colorSelector[0]
                        .getElementsByClassName("blip-tag-color-option") as HTMLCollectionOf<HTMLElement>;

                    if (colors.length > 0) {
                        for (const colorElement of Array.from(colors)) {
                            const currentColor = colorElement.getAttribute("data-color");

                            if (currentColor === color) {
                                colorElement.click();
                            }
                        }
                    }

                }
            }
        }
    }
}
