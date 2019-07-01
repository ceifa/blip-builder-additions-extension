import { inject } from "../../Content";
import IConfiguration from "./Configuration";

export default class ActionNameFixerConfiguration implements IConfiguration {
    public onLoadConfiguration = (): void => {
        document.getElementById("fix-action-names-apply-btn").addEventListener("click", this.handleFixActionNames);
    }

    private handleFixActionNames = async () => {
        try {
            await inject.callFunction("LoadingService", "startLoading", [false]);

            // LOGIC HERE

            await inject.callFunction("LoadingService", "stopLoading", []);
            await inject.callFunction("$state", "reload", []);
        } catch {
            await inject.callFunction("LoadingService", "stopLoading", []);
            await inject.callFunction("ngToast", "danger",
                ["Error when trying to apply action names. (Maybe nothing has been applied)"]);
        }
    }
}
