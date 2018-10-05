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
            
            if (rgxResult && rgxResult.length == 2){
                identifiers.add(rgxResult[1]);
            }
        }

        if (identifiers.size > 0)
            addBots(identifiers);
    });
};

function hideVisibles() {
    let visibles = document.getElementsByClassName('visible');
    Array.from(visibles).forEach(el => el.classList.remove('visible'));
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
        input.dispatchEvent(new Event("input"));
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

function repairTags(ev) {
    chrome.tabs.query({url: '*://*.blip.ai/*'}, (tabs) => {
        if (tabs.length < 1)
            return;

        for (let tab of tabs){
            if (repairTagsTabValidation(tab))
                chrome.tabs.sendMessage(tab.id, {type: "btn-clicked", btn: ev.target.id, metadata});
        }
    });
}

function repairTagsTabValidation(tab){
    return tab.url.includes(metadata.botIdentifier);
}