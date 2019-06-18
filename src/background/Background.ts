import Utils from "../shared/Utils";

const browser = Utils.GetBrowser();

const zoomConfig = (enabled: boolean): browser.tabs.ZoomSettings => ({
    mode: enabled ? "automatic" : "disabled",
    scope: "per-tab",
});

browser.runtime.onMessage.addListener((requestMessage: string, sender: any) => {
    switch (requestMessage) {
        case "StartZoomBlock":
            browser.tabs.setZoomSettings(sender.tab.id, zoomConfig(false));
            break;
        case "StopZoomBlock":
            browser.tabs.setZoomSettings(sender.tab.id, zoomConfig(true));
            break;
    }
});
