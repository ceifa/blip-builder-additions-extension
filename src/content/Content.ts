import Storager from "../shared/Storager";
import AutoTag from "./features/AutoTag";
import { FeatureBase } from "./features/FeatureBase";

export const features: Array<{ name: string, processor: FeatureBase }> = [
    {
        name: "autotag",
        processor: new AutoTag(),
    },
];

features.forEach(async (f) => {
    const configuration = await Storager.get(f.name);
    f.processor.OnReceiveConfiguration(configuration);

    if (configuration.enabled) {
        f.processor.OnEnableFeature();
    }
});

setInterval(() => {
    const canvas = document.getElementById("canvas");

    if (canvas) {
        // @ts-ignore
        const builderController = window.angular.element(canvas).controller();

        if (builderController && !builderController.isLoading) {
            features.forEach((f) => f.processor.OnLoadBuilder(builderController));
        }
    }
}, 500);
