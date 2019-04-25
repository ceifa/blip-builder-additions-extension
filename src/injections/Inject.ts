import Injectables from "./InjectCommands";

window.addEventListener("message", (message: MessageEvent) => {
    if (message.data.isAddiction && message.data.fromExtension) {
        const injectables = new Injectables();

        const response: any = {
            identifier: message.data.identifier,
            isAddiction: true,
            shouldDelete: true,
            type: "command-response",
        };

        try {
            response.result = injectables[message.data.function](...message.data.parameters);
        } catch (e) {
            response.error = e.message;
        }

        window.postMessage(response, "*");
    }
});
