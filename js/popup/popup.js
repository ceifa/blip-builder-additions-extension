(() => {
    loadData();
    loadAutoTagInputHandler();
    loadColorInputPickers();
    loadColorPickupHandler();

    document.body.onclick = () => {
        let visibles = document.getElementsByClassName('visible');
        Array.from(visibles).forEach(el => el.classList.remove('visible'));
    }

    document.getElementById('reset-configs').onclick = resetConfigs;
})()

function resetConfigs() {
    jsonToForm(defaultSettings);
    chrome.storage.sync.set({ settings: defaultSettings });
    chrome.tabs.query({url: '*://portal.blip.ai/*'}, (tabs) => {
        if (tabs.length < 1)
            return;

        for (let tab of tabs){
            chrome.tabs.sendMessage(tab.id, {type: "form-change", defaultSettings});
        }
    });
}

function loadAutoTagInputHandler() {
    let autoTagForm = document.getElementById('autotag-settings');
    let autoTagInputs = autoTagForm.getElementsByTagName('input');

    for (let i = 0; i < autoTagInputs.length; i++){
        autoTagInputs[i].addEventListener("change", (ev) => {
            let viewId = ev.target.name.replace('-color', '-view');
            let view = document.getElementById(viewId);
            view.style.backgroundColor = ev.target.value;
        }, false);
    }
}

function loadColorPickupHandler(){
    let colorOptions = document.getElementsByClassName('blip-tag-color-option');

    for (let i = 0; i < colorOptions.length; i++) {
        colorOptions[i].onclick = (ev) => {
            if (metadata.actualActionClicked) {
                let input = document.getElementById(metadata.actualActionClicked + '-color');
                input.value = ev.target.getAttribute('data-color');
                input.dispatchEvent(new Event("change"));
                input.dispatchEvent(new Event("input"));
            }
        }
    }
}

function loadColorInputPickers() {
    let pickers = document.getElementsByClassName('color-picker-action');
    for (let i = 0; i < pickers.length; i++) {
        pickers[i].onclick = (ev) => {
            let picker = ev.target;
            let heightPos = picker.offsetTop + 20;
    
            let selector = document.getElementById('tag-color-selector');
            selector.style.top = heightPos;
            
            manageVisible(selector);

            metadata.actualActionClicked = picker.id.replace('-view', '');
            ev.stopPropagation();
        }
        
    }
}

function loadData(){
    chrome.storage.sync.get([ 'settings' ], (result) => {
        let settings = !result || Object.keys(result).length === 0 ? defaultSettings : result.settings;            
        jsonToForm(settings);
    });

    chrome.tabs.query({url: '*://*.blip.ai/*'}, (tabs) => {
        if (tabs.length < 1)
            return;

        let identifiers = new Set();

        for (let tab of tabs){
            const getIdentifierRgx = /application\/detail\/(.*?)\//g;
            let rgxResult = getIdentifierRgx.exec(tab.url);
            
            if (rgxResult.length == 2){
                identifiers.add(rgxResult[1]);
            }
        }

        if (identifiers.size > 0)
            addBots(identifiers);
    });
}

function addBots(botIdentifierList){
    let section = document.getElementById('bots-section');
    section.style.display = "";

    let bots = document.getElementById('bots');

    for (const identifier of botIdentifierList) {
        let btn = document.createElement('button');
        btn.classList = "bp-btn bp-btn--text-only bp-btn--bot bot-btn";
        btn.textContent = identifier;

        btn.onclick = (ev) => {
            let heightPos = btn.offsetTop - 40;

            let options = document.getElementById('bot-options-list');
            options.style.top = heightPos;
            
            manageVisible(options);

            metadata.botIdentifier = ev.target.textContent;
            ev.stopPropagation();
        }

        bots.append(btn);
    }
}

function manageVisible(el){
    if (el.classList.contains('visible')) {
        el.classList.remove('visible');
    }
    else {
        el.classList.add('visible');
    }
}

function repairTagsTabValidation(tab){
    return tab.url.includes(metadata.botIdentifier);
}