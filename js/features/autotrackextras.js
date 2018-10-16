let autotrack_started;

function initAutoTrackExtras() {
    autotrack_started = true;
    createBuilderObserver();
}

function stopAutoTrackExtras() {
    autotrack_started = false;
    if (builderObserver){
        builderObserver.disconnect();
        builderObserver = null;
    }
}


hook.add("new-element", (el) => {
    if (autotrack_started && el.tagName && el.tagName.toLowerCase() === "ul" && el.className.includes("ph4")) {
        addEventTrackHandler(el);
    }
});

function addEventTrackHandler(actionList) {
    const actions = actionList.getElementsByTagName("li");
    const eventTrackPossibleActions = possibleActions.find(p => p.name === "Event tracking");

    for (let action of actions) {
        if (action.textContent === eventTrackPossibleActions.name || eventTrackPossibleActions.alias.some(a => a === action.textContent)){
            action.addEventListener("click", (ev) => {
                getTracks().then(tracks => {
                    setTimeout(() => {
                        let keyValue = document.getElementsByTagName("key-value")[0];
                        let addBtn = keyValue.getElementsByTagName("button")[0];

                        for (let extras of tracks) {
                            let keyInputs = document.getElementsByName("key");
        
                            if (extras.key && extras.value && !Array.from(keyInputs).some(k => k.value === extras.key)){
                                addBtn.click();
        
                                let valueInputs = document.getElementsByName("value");
                                let lastKey = keyInputs[keyInputs.length - 1];
                                let lastValue = valueInputs[valueInputs.length - 1];
        
                                lastKey.value = extras.key;
                                lastValue.value = extras.value;
                            }
                        }
                    }, 100);
                });
            });
        }
    }
}

function getTracks() {
    return new Promise(callback => {
        chrome.storage.sync.get([ 'extras' ], result => {
            if (!result || !result.extras || result.extras.length === 0)
                return callback();
    
            return callback(result.extras);
        });
    });
}