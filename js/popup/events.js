let metadata = {};

const change = (ev) => {
    let settings = JSON.parse(formToJson());
    
    chrome.storage.sync.set({ settings });

    const form = closestElement(ev.target, 'form');

    chrome.tabs.query({url: '*://*.blip.ai/*'}, (tabs) => {
        if (tabs.length < 1)
            return;

        for (let tab of tabs){
            chrome.tabs.sendMessage(tab.id, {type: "form-change", form: form.id, input: ev.target.name, settings});
        }
    });
}

const clicked = (ev) => {
    chrome.tabs.query({url: '*://*.blip.ai/*'}, (tabs) => {
        if (tabs.length < 1)
            return;

        let condition = () => true;

        let conditionFunctionName = ev.target.getAttribute('propagation-condition');
        if (conditionFunctionName){
            condition = window[conditionFunctionName];
        }

        for (let tab of tabs){
            if (condition(tab))
                chrome.tabs.sendMessage(tab.id, {type: "btn-clicked", btn: ev.target.id, metadata});
        }
    });
}

(() => {
    let formInputs = document.querySelectorAll('input, select, textarea')

    for (let i = 0; i < formInputs.length; i++) {
        formInputs[i].addEventListener("input", change, false);
    }
    
    let clickHandlers = document.getElementsByClassName('click-handler');
    
    for (let i = 0; i < clickHandlers.length; i++) {
        clickHandlers[i].addEventListener("click", clicked, false);
    }
})()