import Communicator from "../shared/Communicator";
import Storager from "../shared/Storager";
import { Command } from "../shared/types/Command";
import Utils from "../shared/Utils";
import AutoTag from "./features/AutoTag";
import CleanEnvironment from "./features/CleanEnvironment";
import Configuration from "./features/configurations/Configuration";
import FeatureBase from "./features/FeatureBase";
import WhatsappMarkdown from "./features/WhatsappMarkdown";

export let isBuilderLoaded = false;
export const features: Array<{ name: string, processor: FeatureBase }> = [
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

(async (brow: typeof chrome | typeof browser) => {
    Utils.StartListeningCommands();

    const refreshFeatures = async (): Promise<void> => {
        await Storager.refresh();

        features.forEach(async (f) => {
            const configuration = await Storager.get(f.name);
            f.processor.OnReceiveConfiguration(configuration);

            if (configuration) {
                if (configuration.enabled && !f.processor.isEnabled) {
                    f.processor.OnEnableFeature();
                } else if (!configuration.enabled && f.processor.isEnabled) {
                    f.processor.OnDisableFeature();
                }
            }
        });
    };

    Communicator.on("change-settings", refreshFeatures);

    setInterval(async (): Promise<void> => {
        const isLoading: any = await Utils.SendCommand(Command.GetVariable, "#canvas", null, "isLoading");
        const isLoaded = isLoading === false;

        if (isLoaded !== isBuilderLoaded) {
            if (isLoaded) {
                features.forEach((f) => f.processor.OnLoadBuilder());
            } else {
                features.forEach((f) => f.processor.OnUnloadBuilder());
            }
        }

        isBuilderLoaded = isLoaded;
    }, 800);

    refreshFeatures();
})(chrome || browser);
