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

        this.SendMessage("StartZoomBlock");
    }

    private async Stop() {
        this.SendMessage("StopZoomBlock");
    }

    private SendMessage(message: any) {
        if (chrome) {
            chrome.runtime.sendMessage(message);
        } else if (browser) {
            browser.runtime.sendMessage(message);
        }
    }
}
