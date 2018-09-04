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
    chrome.storage.sync.get([ 'settings' ], (result) => {
        if (!result || Object.keys(result).length === 0)
            return;
            
        jsonToForm(result.settings);
    });
}