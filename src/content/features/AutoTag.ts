import Utils from "../../shared/Utils";
import { FeatureBase } from "./FeatureBase";

export default class AutoTag extends FeatureBase {
    public OnLoadBuilder(): void {
        console.log("load");
    }

    private AddEventListeners() {
        throw new Error();
    }
}
