import Inject from "../Inject";
import Communicator from "../shared/Communicator";
import Storager from "../shared/Storager";
import Utils from "../shared/Utils";

import AutoTag from "./features/AutoTag";
import CleanEnvironment from "./features/CleanEnvironment";
import Configuration from "./features/configurations/ConfigurationManager";
import FeatureBase from "./features/FeatureBase";
import WhatsappMarkdown from "./features/WhatsappMarkdown";

export let isBuilderLoaded = false;
export const features: { name: string, processor: FeatureBase }[] = [
    {
        name: "autotag",
        processor: new AutoTag(),
    },
    {
        name: "whatsappmarkdown",
        processor: new WhatsappMarkdown(),
    },
    {
        name: "cleanenvironment",
        processor: new CleanEnvironment(),
    },
    {
        name: "configuration",
        processor: new Configuration(),
    },
];

export const inject = new Inject();

(async (brow: typeof chrome | typeof browser) => {
    inject.startListeningCommands();

    const refreshFeatures = async (): Promise<void> => {
        await Storager.refresh();

        features.forEach(async (f) => {
            const configuration = await Storager.get(f.name);
            f.processor.onReceiveConfiguration(configuration);

            if (configuration) {
                if (configuration.enabled && !f.processor.isEnabled) {
                    f.processor.onEnableFeature();
                } else if (!configuration.enabled && f.processor.isEnabled) {
                    f.processor.onDisableFeature();
                }
            }
        });
    };

    Communicator.on("change-settings", refreshFeatures);

    setInterval(async (): Promise<void> => {
        const isLoading: any = await inject.getVariable("isLoading");
        const isLoaded = isLoading === false;

        if (isLoaded !== isBuilderLoaded) {
            isBuilderLoaded = isLoaded;

            if (isLoaded) {
                features.forEach((f) => f.processor.onLoadBuilder());
            } else {
                features.forEach((f) => f.processor.onUnloadBuilder());
            }
        }
    }, 800);

    refreshFeatures();
})(Utils.getBrowser());
