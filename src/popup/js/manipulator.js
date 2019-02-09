import storager from "../../shared/storager";

export default (() => {
    let currentFeatureSettings = null;

    const addSettingsManipulationHandlers = () => {
        const featureElements = document.getElementById('features').querySelectorAll(`[feature]`);

        for (const featureElement of featureElements) {
            const featureName = featureElement.getAttribute('feature')
            const iconConfigElement = featureElement.getElementsByClassName('icon-config');

            if (iconConfigElement.length === 1) {
                iconConfigElement[0].addEventListener('mousedown', _ => {
                    const settingsSection = document.getElementById('settings');

                    if (currentFeatureSettings === featureName) {
                        currentFeatureSettings = null;
                        settingsSection.classList.add('invisible');
                    } else {
                        currentFeatureSettings = featureName;
                        settingsSection.classList.remove('invisible');

                        const settingsFeatureElements = settingsSection.querySelectorAll('[feature]');
                        for (const settingsFeatureElement of settingsFeatureElements) {
                            if (settingsFeatureElement.getAttribute('feature') === featureName) {
                                settingsFeatureElement.classList.remove('invisible');
                            } else {
                                settingsFeatureElement.classList.add('invisible');
                            }
                        }
                    }
                });
            }
        }
    }

    const addInputEventListeners = () => {
        const inputs = document.querySelectorAll('input[config]');
        for (const inputElement of inputs) {
            inputElement.addEventListener('change', async ev => {
                const value = ev.target.type === 'checkbox' ? ev.target.checked : ev.target.value;
                await storager.set(ev.target.getAttribute('config'), value);
            });
        }
    }

    const fixSettingsValues = async () => {
        const inputs = document.querySelectorAll('input[config]');
        for (const inputElement of inputs) {
            const value = await storager.get(inputElement.getAttribute('config'));

            if (inputElement.type === 'checkbox') {
                inputElement.checked = value;
            } else {
                inputElement.value = value;
            }

            inputElement.dispatchEvent(new Event("change"));
        }
    }

    return class Manipulator {
        // Create DOM events inside class, manipulators outside
        constructor() {
            document.addEventListener('DOMContentLoaded', ev => {
                addSettingsManipulationHandlers();
                fixSettingsValues().then(_ => {
                    addInputEventListeners();
                });

                for (const element of document.all) {
                    for (const attribute of element.attributes) {
                        if (attribute.name.indexOf('event-') === 0) {
                            const event = attribute.name.replace('event-', '');
                            element.addEventListener(event, this[attribute.value]);
                        }
                    }
                }
            });
        }

        openColorChooseDialog = ev => {
            const heightPos = ev.target.offsetTop - 130;

            const colorChooser = document.getElementById('tag-color-selector');
            colorChooser.style.top = heightPos.toString();

            this.colorChooserAttachedInput = ev.target.nextElementSibling;

            colorChooser.classList.toggle('transited-visible');

            ev.stopPropagation();
        }

        hideTransitedVisibles = () => {
            const elementsToHide = document.getElementsByClassName('transited-visible');
            for (const element of elementsToHide) {
                element.classList.remove('transited-visible');
            }
        }

        changeInputTagColor = ev => {
            const color = ev.target.getAttribute('color');
            this.colorChooserAttachedInput.value = color;
            this.colorChooserAttachedInput.dispatchEvent(new Event('change'));
        }

        changeDisplayTagColor = ev => {
            const displayElement = ev.target.previousElementSibling;
            displayElement.style.backgroundColor = ev.target.value;
        }

        resetConfig = async ev => {
            await storager.clear();
            await fixSettingsValues();
        }
    }
})();