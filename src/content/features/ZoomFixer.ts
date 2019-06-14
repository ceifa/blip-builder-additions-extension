import { Command } from "../../shared/types/Command";
import Utils from "../../shared/Utils";
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

    private async Start() {
        if (!this.isEnabled || !isBuilderLoaded) {
            return;
        }

        await Utils.SendCommand(Command.StartZoom);
    }

    private async Stop() {
        await Utils.SendCommand(Command.StopZoom);
    }
}
