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
    },
    chatbase: {
        init: initChatbase,
        stop: stopChatbase
    }
}
let initialized;
let settings;
let builderHandler;
let builderObserver;

(() => {
    loadSettings().then(_ => {
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
            createBuilderObserver();
        }
    }
    else if (initialized){
        initialized = false;
        stopFeatures();
        stopBuilderObserver();
    }
}

function startFeatures() {
    for (let key in features){
        if (settings[key + "-enabled"]){
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
    let feature = key.replace("-enabled", "");

    if (settings[key]){
        features[feature].init();
    }
    else {
        features[feature].stop();
    }
}

function createBuilderObserver() {
    builderObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes){
                for (let addedNode of mutation.addedNodes) {
                    if (addedNode)
                        hook.call("new-element", addedNode);
                }
            }

            hook.call("mutation-element", mutation.target);
        });
    });
    
    var config = {
        childList: true,
        subtree: true
    };
    
    builderObserver.observe(document.getElementById("main-content-area"), config);
}

function stopBuilderObserver() {
    if (builderObserver){
        builderObserver.disconnect();
        builderObserver = null;
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