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

const getWindowVariable = async (name: string) => new Promise((resolve) => {
    window.addEventListener("message", (ev: Event) => {
        resolve();
    });

    window.postMessage({
        name,
        type: "window-variable",
    }, "*");
});

(async (brow: typeof chrome | typeof browser) => {
    features.forEach(async (f) => {
        const configuration = await Storager.get(f.name);
        f.processor.OnReceiveConfiguration(configuration);

        if (configuration.enabled) {
            f.processor.OnEnableFeature();
        }
    });

    await Utils.injectPageScript(brow, "js/inject.js");

    // setInterval(async () => {
    //     const canvas: Element = document.getElementById("canvas");
    //     const angular: any = await getWindowVariable("angular");

    //     if (canvas) {
    //         const builderController = angular.element(canvas).controller();

    //         if (builderController && !builderController.isLoading) {
    //             features.forEach((f) => f.processor.OnLoadBuilder(builderController));
    //         }
    //     }
    // }, 500);
})(chrome || browser);
