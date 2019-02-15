import Storager from "../shared/Storager";
import Utils from "../shared/Utils";
import AutoTag from "./features/AutoTag";
import { FeatureBase } from "./features/FeatureBase";

export let isBuilderLoaded = false;
export const features: Array<{ name: string, processor: FeatureBase }> = [
    {
        name: "autotag",
        processor: new AutoTag(),
    },
];

(async (brow: typeof chrome | typeof browser) => {
    features.forEach(async (f) => {
        const configuration = await Storager.get(f.name);
        f.processor.OnReceiveConfiguration(configuration);

        if (configuration && configuration.enabled) {
            f.processor.OnEnableFeature();
        }
    });

    setInterval(async () => {
        const isLoading: any = await Utils.getBuilderControllerVariable("isLoading");
        const isLoaded = isLoading === false;

        if (isLoaded && isLoaded !== isBuilderLoaded) {
            features.forEach((f) => f.processor.OnLoadBuilder());
        }

        isBuilderLoaded = isLoaded;
    }, 800);
})(chrome || browser);
