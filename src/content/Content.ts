import Storager from "../shared/Storager";
import Utils from "../shared/Utils";
import AutoTag from "./features/AutoTag";
import { FeatureBase } from "./features/FeatureBase";
import Communicator from "../shared/Communicator";

export let isBuilderLoaded = false;
export const features: Array<{ name: string, processor: FeatureBase }> = [
    {
        name: "autotag",
        processor: new AutoTag(),
    },
];

(async (brow: typeof chrome | typeof browser) => {
    const refreshFeatures = (): void => {
        features.forEach(async (f) => {
            const configuration = await Storager.get(f.name);
            f.processor.OnReceiveConfiguration(configuration);

            if (configuration && configuration.enabled && !f.processor.isEnabled) {
                f.processor.OnEnableFeature();
            }
        });
    };

    Communicator.on("change-settings", refreshFeatures);

    setInterval(async (): Promise<void> => {
        const isLoading: any = await Utils.getBuilderControllerVariable("isLoading");
        const isLoaded = isLoading === false;

        if (isLoaded && isLoaded !== isBuilderLoaded) {
            features.forEach((f) => f.processor.OnLoadBuilder());
        }

        isBuilderLoaded = isLoaded;
    }, 800);

    refreshFeatures();
})(chrome || browser);
