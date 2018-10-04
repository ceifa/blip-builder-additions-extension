let builderObserver;

function initAutoTag() {
    createBuilderObserver();
}

function stopAutoTag() {
    if (builderObserver)
        builderObserver.disconnect();

    const tab = document.getElementById("node-content-tab");

    if (tab){
        const customs = tab.querySelectorAll("li, .icon-delete");

        for (let i = 0; i < customs.length; i++) {
            customs[i].onclick = null;
        }
    }
}

function createBuilderObserver() {
    builderObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0){
                 for (var i = 0; i < mutation.addedNodes.length; i++){
                     if (mutation.addedNodes[i])
                        hook.call("new-element", mutation.addedNodes[i]);
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

hook.add("new-element", (el) => {
    if (el.tagName && el.tagName.toLowerCase() === "ul" && el.className.includes("ph4")) {
        addActionTagHandler(el);
    }
});

hook.add("mutation-element", (el) => {
    if (el.id === "action-list") {
        removeActionTagHandler(el);
    }
});

function addActionTagHandler(actionList){
    const actions = actionList.getElementsByTagName("li");

    for (let i = 0; i < actions.length; i++) {
        if (!actions[i].onclick){
            actions[i].onclick = (ev) => {
                const name = ev.target.textContent;
                const tab = document.getElementById("node-content-tab");
                const tags = tab.getElementsByClassName("blip-tag__label");
    
                for (let k = 0; k < tags.length; k++){
                    if (tags[k].textContent === name){
                        return;
                    }
                }
    
                addActionTag(tab, name);
            }
        }
    }
}

function removeActionTagHandler(actionList){
    const icons = actionList.getElementsByClassName("icon-delete");

    for (let i = 0; i < icons.length; i++) {
        if (!icons[i].onclick){
            icons[i].onclick = (ev) => {
                let name = ev.target.parentElement.previousElementSibling.firstElementChild.textContent.trim();
                let actions = actionList.querySelectorAll(".w-80 span:not(.invalid-action)");
                
                let hasMoreActions;
                for (let k = 0; k < actions.length; k++){
                    hasMoreActions = hasMoreActions || actions[k].textContent.trim() === name;
                }

                if (!hasMoreActions){
                    let tags = document.querySelectorAll('.sidebar-content-header .blip-tag__label');

                    for (let k = 0; k < tags.length; k++){
                        if (tags[k].innerText === name) {
                            tags[k].nextElementSibling.click();
                        }
                    }
                }
            }
        }
    }
}

function addActionTag(tab, name){
    const header = tab.getElementsByClassName("sidebar-content-header")[0];
    const tagMenuBtn = header.getElementsByTagName("img");

    if (tagMenuBtn.length > 0){
        tagMenuBtn[0].click();
    }

    const tagMenu = header.getElementsByTagName("blip-tags")[0];

    let action = possibleActions.find(a => name === a.name || a.alias.includes(name));

    let input = tagMenu.getElementsByTagName("input")[0];
    input.value = action.name;

    setTimeout(() => {
        input.dispatchEvent(new Event("input"));

        setTimeout(() => {
            let options = tagMenu.getElementsByClassName("blip-select__options")[0];
            options.style.display = "none"
    
            let correctTagOption = options.getElementsByClassName("blip-select__option")[0];
            correctTagOption.click()

            setTimeout(() => {
                let colorSelector = tagMenu.getElementsByClassName("blip-tag-select-color")[0];

                if (!colorSelector)
                    return;

                colorSelector.style.display = "none";

                let config = action.name.toLowerCase().replace(' ', '-') + '-color';

                let colors = colorSelector.getElementsByClassName("blip-tag-color-option");

                for (let i = 0; i < colors.length; i++) {
                    let currentColor = colors[i].getAttribute('data-color');

                    if (currentColor === settings[config]){
                        colors[i].click();
                    }
                }
            }, 10);
        }, 10);
    }, 5);
}