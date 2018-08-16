const formToJson = (form) => {
    let obj = {};
    let elements = form.querySelectorAll('input, select, textarea');

    for(let i = 0; i < elements.length; ++i) {
        if(elements[i].name) {
            obj[elements[i].name] = elements[i].type === 'checkbox' ? elements[i].checked :  elements[i].value;
        }
    }

    return JSON.stringify(obj);
}

const jsonToForm = (json) => {
    let settings = JSON.parse(json);

    for (let config in settings){
        let element = document.getElementsByName(config)[0];

        if (element){
            if (element.type === 'checkbox')
                element.checked = settings[config];
            else
                element.value = settings[config];
        }
    }
}

const settingsForm = document.getElementById('settings');

const change = () => {
    let settings = formToJson(settingsForm);
    
    chrome.storage.sync.set({ settings });

    chrome.tabs.query({active: true, currentWindow: true, url: '*://portal.blip.ai/*'}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {type:"settingsChange"}, function(response){
            // so fancy
        });
    });
}

const formInputs = settingsForm.querySelectorAll('input, select, textarea')

for (let i = 0; i < formInputs.length; i++) {
    formInputs[i].addEventListener("input", change, false);
    formInputs[i].addEventListener("change", change, false);
}

document.body.onload = () => {
    chrome.storage.sync.get([ 'settings' ], (result) => {
        if (!result || Object.keys(result).length === 0)
            return;
            
        jsonToForm(result.settings);
    });
}