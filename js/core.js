const features = {
    search: {
        init: initSearch,
        stop: stopSearch
    },
    autotag: {
        init: initAutoTag,
        stop: stopAutoTag
    },
    autotrackextras: {
        init: initAutoTrackExtras,
        stop: stopAutoTrackExtras
    }
}

let startedFeatures = [];

let initialized;
let settings;
let builderHandler;

(() => {
    loadSettings().then(() => {
        createBuilderHandler();
    });
})();

function createBuilderHandler() {
    init();
    builderHandler = setInterval(init, 500)
}

function isOnBuilder() {
    const navbar = document.getElementsByTagName("sidenav-menu-item");
    const tools = document.getElementsByClassName("icon-button-list");

    if (navbar && navbar[0] && navbar[0].children[0].className.includes("active") && tools.length > 0){
        return true;
    }

    return false;
}

function init() {
    if (isOnBuilder()){
        if (!initialized){
            initialized = true;
            startFeatures();
        }
    }
    else if (initialized){
        initialized = false;
        stopFeatures();
    }
}

function startFeatures() {
    for (let key in features){
        if (settings[key + "-enabled"]){
            features[key].init();
            startedFeatures.push(key);
        }
    }
}

function stopFeatures() {
    for (let key in features){
        features[key].stop();
        startedFeatures = startedFeatures.filter(s => s !== key);
    }
}

function refreshFeature(key) {
    let feature = key.replace("-enabled", "");

    if (settings[key]){
        features[feature].init();
        startedFeatures.push(key);
    }
    else {
        features[feature].stop();
        startedFeatures = startedFeatures.filter(s => s !== key);
    }
}

function loadSettings() {
    return new Promise((callback) => {
        chrome.storage.sync.get([ "settings" ], (result) => {
            if (result && result.settings){
                settings = result.settings;
            }
            else {
                settings = defaultSettings;
            }
    
            callback();
        });
    });
}

chrome.runtime.onMessage.addListener(function(message) {
    if (message.type === "form-change") {
        settings = message.settings;

        if (message.form === "features-settings") {
            refreshFeature(message.input);
        }

        hook.call(message.type, message.form, message.input);
    }
    else if (message.type === "btn-clicked") {
        metadata = message.metadata;

        hook.call(message.type, message.btn);
    }
});