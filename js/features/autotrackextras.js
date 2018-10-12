function initAutoTrackExtras() {
    createBuilderObserver();
}

function stopAutoTrackExtras() {
    if (builderObserver){
        builderObserver.disconnect();
        builderObserver = null;
    }
}


hook.add("new-element", (el) => {
    let started = startedFeatures.some(s => s === "autotrackextras");

    if (started && el.tagName && el.tagName.toLowerCase() === "ul" && el.className.includes("ph4")) {
        addEventTrackHandler(el);
    }
});

function addEventTrackHandler(actionList) {
    const actions = actionList.getElementsByTagName("li");
    const eventTrackPossibleActions = possibleActions.find(p => p.name === "Event tracking");

    for (let action of actions) {
        if (action.textContent === eventTrackPossibleActions.name || eventTrackPossibleActions.alias.some(a => a === action.textContent)){
            action.addEventListener("click", (ev) => {
                
            });
        }
    }
}