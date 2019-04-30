import Communicator from "../../shared/Communicator";
import Storager from "../../shared/Storager";

export default (() => {
    let currentFeatureSettings: string = null;

    const addSettingsManipulationHandlers = (): void => {
        const featureElements = document.getElementById("features").querySelectorAll(`[feature]`);

        featureElements.forEach((f) => {
            const featureName = f.getAttribute("feature");
            const iconConfigElement = f.getElementsByClassName("icon-config");

            if (iconConfigElement.length === 1) {
                iconConfigElement[0].addEventListener("mousedown", (_) => {
                    const settingsSection = document.getElementById("settings");

                    if (currentFeatureSettings === featureName) {
                        currentFeatureSettings = null;
                        settingsSection.classList.add("invisible");
                    } else {
                        currentFeatureSettings = featureName;
                        settingsSection.classList.remove("invisible");

                        const settingsFeatureElements = settingsSection.querySelectorAll("[feature]");
                        settingsFeatureElements.forEach((s) => {
                            if (s.getAttribute("feature") === featureName) {
                                s.classList.remove("invisible");
                            } else {
                                s.classList.add("invisible");
                            }
                        });
                    }
                });
            }
        });
    };

    const addInputEventListeners = (): void => {
        const inputs = document.querySelectorAll("input[config]");
        inputs.forEach((i) => {
            i.addEventListener("change", async (ev) => {
                const target = ev.target as HTMLInputElement;
                const value = target.type === "checkbox" ? target.checked : target.value;
                await Storager.set(target.getAttribute("config"), value);
                Communicator.emit("change-settings", null);
            });
        });
    };

    const fixSettingsValues = async (): Promise<void> => {
        const inputs = document.querySelectorAll("input[config]");

        for (const input of Array.from(inputs) as HTMLInputElement[]) {
            const configKey = input.getAttribute("config");
            let value = await Storager.get(configKey);

            if (value === null) {
                value = input.getAttribute("default");

                switch (value.toLowerCase()) {
                    case "true":
                        value = true;
                    case "false":
                        value = false;
                }

                await Storager.set(configKey, value);
            }

            if (input.type === "checkbox") {
                input.checked = value.toString() === "true";
            } else {
                input.value = value;
            }

            input.dispatchEvent(new Event("change"));
        }
    };

    return class Manipulator {
        public colorChooserAttachedInput: HTMLInputElement;

        // Create DOM events inside class, manipulators outside
        constructor() {
            document.addEventListener("DOMContentLoaded", () => {
                addSettingsManipulationHandlers();
                fixSettingsValues().then(addInputEventListeners);

                for (const element of Array.from(document.all)) {
                    for (const attribute of Array.from(element.attributes)) {
                        if (attribute.name.indexOf("event-") === 0) {
                            const event = attribute.name.replace("event-", "");
                            element.addEventListener(event, (this as any)[attribute.value]);
                        }
                    }
                }
            });
        }

        public openColorChooseDialog = (ev: Event): void => {
            const target = ev.target as Element;

            const top = target.getBoundingClientRect().top;
            const heightPos = top - 130;

            const colorChooser = document.getElementById("tag-color-selector");
            colorChooser.style.top = heightPos.toString();

            this.colorChooserAttachedInput = target.nextElementSibling as HTMLInputElement;

            colorChooser.classList.toggle("transited-visible");

            ev.stopPropagation();
        }

        public hideTransitedVisibles = (): void => {
            const elementsToHide = document.getElementsByClassName("transited-visible");
            for (const element of Array.from(elementsToHide)) {
                element.classList.remove("transited-visible");
            }
        }

        public changeInputTagColor = (ev: Event): void => {
            const target = ev.target as Element;

            const color = target.getAttribute("color");
            this.colorChooserAttachedInput.value = color;
            this.colorChooserAttachedInput.dispatchEvent(new Event("change"));
        }

        public changeDisplayTagColor = (ev: Event): void => {
            const target = ev.target as HTMLInputElement;

            const displayElement = target.previousElementSibling as HTMLDivElement;
            displayElement.style.backgroundColor = target.value;
        }

        public resetConfig = async (): Promise<void> => {
            await Storager.clear();
            await fixSettingsValues();
        }
    };
})();
