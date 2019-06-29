import Utils from "./Utils";

export default ((brow: typeof browser | typeof chrome) => class Communicator {
    public static on = (type: string, callback: (state: any) => void) => {
        brow.runtime.onMessage.addListener((message: any) => {
            if (message.type === type) {
                callback(message.state);
            }
        });
    }

    public static emit = (type: string, state: any) => {
        brow.tabs.query({ url: "*://*.blip.ai/*" }, (tabs: chrome.tabs.Tab[]) => {
            for (const tab of tabs) {
                Utils.getBrowser().tabs.sendMessage(tab.id, { type, state }, {});
            }
        });
    }
})(Utils.getBrowser());
