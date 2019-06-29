import { isBuilderLoaded } from "../Content";
import FeatureBase from "./FeatureBase";

export default class ZoomFixer extends FeatureBase {
    public onDisableFeature() {
        super.onDisableFeature();
        this.stop();
    }

    public onEnableFeature() {
        super.onEnableFeature();
        this.start();
    }

    public onLoadBuilder(): void {
        this.start();
    }

    public onUnloadBuilder(): void {
        this.stop();
    }

    private async start() {
        if (!this.isEnabled || !isBuilderLoaded) {
            return;
        }

        this.sendMessage("StartZoomBlock");
    }

    private async stop() {
        this.sendMessage("StopZoomBlock");
    }

    private sendMessage(message: any) {
        if (chrome) {
            chrome.runtime.sendMessage(message);
        } else if (browser) {
            browser.runtime.sendMessage(message);
        }
    }
}
