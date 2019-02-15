import Utils from "../../shared/Utils";
import { FeatureBase } from "./FeatureBase";

export default class AutoTag extends FeatureBase {
    public OnLoadBuilder(): void {
        if (this.isEnabled) {
            this.StartAsync();
        }
    }

    private async StartAsync(): Promise<void> {
        Utils.interceptFunction("SidebarContentService", "showSidebar", () => {
            this.AddEventListeners();
        });
    }

    private AddEventListeners() {
        const elements: NodeListOf<Element> =
            document.querySelectorAll("li[ng-click^='$ctrl.onAddAction'], i[ng-click^='$ctrl.onDeleteAction']");

        const listener = async (ev: Event) => {
            await this.FixWrongTags();
        };

        elements.forEach((e: Element) => {
            e.removeEventListener("click", listener);
            e.addEventListener("click", listener);
        });
    }

    private async FixWrongTags() {
        const enteringCustomActions: [] =
            await Utils.getBuilderControllerVariable("editingState.$enteringCustomActions");
        const leavingCustomAction: [] =
            await Utils.getBuilderControllerVariable("editingState.$leavingCustomActions")

        const actions: any[] = [...enteringCustomActions, ...leavingCustomAction];

        const tags = await Utils.getBuilderControllerVariable("editingState.$tags");

        console.log(tags);
        console.log(actions);
    }
}
