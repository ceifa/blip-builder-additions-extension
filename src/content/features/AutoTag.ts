import Utils from "../../shared/Utils";
import { FeatureBase } from "./FeatureBase";

export default class AutoTag extends FeatureBase {
    public OnLoadBuilder(builderController: any): void {
        Utils.interceptFunction(builderController.SidebarContentService, "showSidebar", this.AddEventListeners);
    }

    private AddEventListeners() {
        throw new Error();
    }
}
