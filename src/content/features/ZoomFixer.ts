import { Command } from "../../shared/types/Command";
import { isBuilderLoaded } from "../Content";
import FeatureBase from "./FeatureBase";

export default class ZoomFixer extends FeatureBase {
    public OnDisableFeature() {
        super.OnDisableFeature();
        this.Stop();
    }

    public OnEnableFeature() {
        super.OnEnableFeature();
        this.Start();
    }

    public OnLoadBuilder(): void {
        this.Start();
    }

    public OnUnloadBuilder(): void {
        this.Stop();
    }

    private async Start() {
        if (!this.isEnabled || !isBuilderLoaded) {
            return;
        }

        chrome.runtime.sendMessage("StartZoomBlock");
    }

    private async Stop() {
        chrome.runtime.sendMessage("StopZoomBlock");
    }
}
