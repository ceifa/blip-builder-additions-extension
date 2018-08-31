const features = {
    search: {
        init: initSearch,
        stop: stopSearch
    },
    autotag: {
        init: initAutoTag,
        stop: stopAutoTag
    }
}

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
        if (settings[key + "_enabled"]){
            features[key].init();
        }
    }
}

function stopFeatures() {
    for (let key in features){
        features[key].stop();
    }
}

function refreshFeature(key) {
    let feature = key.replace("_enabled", "");

    if (settings[key]){
        features[feature].init();
    }
    else {
        features[feature].stop();
    }
}

function loadSettings() {
    return new Promise((callback) => {
        chrome.storage.sync.get([ "settings" ], (result) => {
            if (result){
                settings = JSON.parse(result.settings);
            }
            else {
                settings = {
                    autotag_enabled: true,
                    search_enabled: true,
                    box: "#f6ff85",
                    box_enabled: false,
                    outline: "#ff4a4a",
                    outline_enabled: true
                }
            }
    
            callback();
        });
    });
}

chrome.runtime.onMessage.addListener(
    function(message) {
        if (message.type === "form-change"){
            settings = JSON.parse(message.settings);

            if (message.form === "features"){
                refreshFeature(message.input);
            }
        }

        hook.call(message.type, message.form, message.input);
    }
);