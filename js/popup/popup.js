function loadData(){
    chrome.storage.sync.get([ 'settings' ], (result) => {
        let settings = !result || Object.keys(result).length === 0 ? defaultSettings : result.settings;            
        jsonToForm(settings);
    });

    loadExtras();
};

function hideVisibles() {
    let visibles = document.getElementsByClassName('visible');
    Array.from(visibles).forEach(el => el.classList.remove('visible'));
}

function addExtrasInputs() {
    let currentExtraInputs = document.querySelectorAll("input[name|='extras']");
    let hasError = false;

    const defaultBorderColor = '#c9dfe4';

    for (let input of currentExtraInputs) {
        let box = closestElement(input, '.bp-input-wrapper');

        if (!input.value && !input.hasAttribute('template')){
            box.style.borderColor = 'red';
            hasError = true;
        }
        else {
            box.style.borderColor = defaultBorderColor;
        }
    }

    if (!hasError){
        let elementClone = document.getElementById('key-value-inputs').cloneNode(true);
        Array.from(elementClone.getElementsByTagName('input')).forEach(el => { el.value = ''; el.removeAttribute('template'); });
    
        const form = document.getElementById('autotrackextras-settings');
    
        form.appendChild(elementClone);
        reloadEvents();
    }
}

function trackExtrasBlur() {
    let extraKeyInputs = document.getElementsByName('extras-key');    
    let extraValueInputs = document.getElementsByName('extras-value');
    
    let extras = [];
    for (let i = 0; i < extraKeyInputs.length; i++) {
        extras.push({key: extraKeyInputs[i].value, value: extraValueInputs[i].value})
    }

    chrome.storage.sync.set({ extras });
}

function loadExtras() {
    chrome.storage.sync.get([ 'extras' ], (result) => {
        if (!result || !result.extras || result.extras.length === 0)
            return;

        for (let extra of result.extras) {
            if (!extra.key || !extra.value)
                continue;
                
            let elementClone = document.getElementById('key-value-inputs').cloneNode(true);
            let inputs = elementClone.getElementsByTagName('input');

            inputs[0].value = extra.key;
            inputs[1].value = extra.value;

            const form = document.getElementById('autotrackextras-settings');
            form.appendChild(elementClone);
        }
    });
}

function displaySettings(ev) {
    let featureSettings = document.getElementsByClassName('feature-settings');

    for (let el of featureSettings) {
        el.classList.remove('feature-visible');
    }

    let config = ev.target.parentElement.getAttribute('config');
    let correctSettings = document.getElementById(config + '-settings-section');

    correctSettings.classList.add('feature-visible');
}

function resetConfigs() {
    jsonToForm(defaultSettings);
    chrome.storage.sync.set({ settings: defaultSettings });
    chrome.tabs.query({url: '*://*.blip.ai/*'}, (tabs) => {
        if (tabs.length < 1)
            return;

        for (let tab of tabs){
            chrome.tabs.sendMessage(tab.id, {type: "form-change", defaultSettings});
        }
    });
}

function autoTagChanged(ev){
    let viewId = ev.target.name.replace('-color', '-view');
    let view = document.getElementById(viewId);
    view.style.backgroundColor = ev.target.value;
}

function colorClicked(ev) {
    if (metadata.actualActionClicked) {
        let input = document.getElementById(metadata.actualActionClicked + '-color');
        input.value = ev.target.getAttribute('data-color');
        input.dispatchEvent(new Event("change"));
    }
}

function colorPickupClicked(ev) {
    let picker = ev.target;
    let heightPos = picker.offsetTop - 125;

    let selector = document.getElementById('tag-color-selector');
    selector.style.top = heightPos;
    
    manageVisible(selector);

    metadata.actualActionClicked = picker.id.replace('-view', '');
    ev.stopPropagation();
}

function manageVisible(el){
    if (el.classList.contains('visible')) {
        el.classList.remove('visible');
    }
    else {
        el.classList.add('visible');
    }
}