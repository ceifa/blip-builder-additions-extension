import Storager from "../shared/Storager";
import Utils from "../shared/Utils";
import AutoTag from "./features/AutoTag";
import { FeatureBase } from "./features/FeatureBase";

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

        if (configuration.enabled) {
            f.processor.OnEnableFeature();
        }
    });

    setInterval(async () => {
        const isLoading: any = await Utils.getBuilderControllerVariable("isLoading");

        if (isLoading === false) {
            features.forEach((f) => f.processor.OnLoadBuilder());
        }
    }, 500);
})(chrome || browser);
