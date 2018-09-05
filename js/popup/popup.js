let actualTagColorSettings;

const change = (ev) => {
    let settings = JSON.parse(formToJson());
    
    chrome.storage.sync.set({ settings });

    const form = closestElement(ev.target, 'form');

    chrome.tabs.query({url: '*://portal.blip.ai/*'}, (tabs) => {
        if (tabs.length < 1)
            return;

        for (let tab of tabs){
            chrome.tabs.sendMessage(tab.id, {type: "form-change", form: form.id, input: ev.target.name, settings});
        }
    });
}

const formInputs = document.querySelectorAll('input, select, textarea')

for (let i = 0; i < formInputs.length; i++) {
    formInputs[i].addEventListener("input", change, false);
}

document.body.onload = () => {
    loadData();
}

let autoTagForm = document.getElementById('autotag-settings');
let autoTagInputs = autoTagForm.getElementsByTagName('input');

for (let i = 0; i < autoTagInputs.length; i++){
    autoTagInputs[i].addEventListener("change", (ev) => {
        let viewId = ev.target.name.replace('-color', '-view');
        let view = document.getElementById(viewId);
        view.style.backgroundColor = ev.target.value;
    }, false);
}

(() => {
    loadColorInputPickers();
    loadColorPickupHandler();
})()

function loadColorPickupHandler(){
    let colorOptions = document.getElementsByClassName('blip-tag-color-option');

    for (let i = 0; i < colorOptions.length; i++) {
        colorOptions[i].onclick = (ev) => {
            if (actualTagColorSettings) {
                let input = document.getElementById(actualTagColorSettings + '-color');
                input.value = ev.target.getAttribute('data-color');
                input.dispatchEvent(new Event("change"));
                input.dispatchEvent(new Event("input"));
            }

            ev.stopPropagation();
        }
    }
    
    document.getElementById('tag-color-selector').onclick = (ev) => {
        ev.stopPropagation();
    }

    document.body.onclick = () => {
        let selector = document.getElementById('tag-color-selector');
        selector.classList.remove('visible');
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
            
            if (selector.classList.contains('visible')) {
                selector.classList.remove('visible');
            }
            else {
                selector.classList.add('visible');
            }

            actualTagColorSettings = picker.id.replace('-view', '');
            ev.stopPropagation();
        }
        
    }
}

function loadData(){
    chrome.storage.sync.get([ 'settings' ], (result) => {
        let settings = !result || Object.keys(result).length === 0 ? defaultSettings : result.settings;            
        jsonToForm(settings);
    });

    chrome.tabs.query({url: '*://portal.blip.ai/*'}, (tabs) => {
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

        bots.append(btn);
    }
}