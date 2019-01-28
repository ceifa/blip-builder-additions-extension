let autotag_started;

function initAutoTag() {
    autotag_started = true;
}

function stopAutoTag() {
    autotag_started = false;

    const tab = document.getElementById("node-content-tab");

    if (tab) {
        const customs = tab.querySelectorAll("li, .icon-delete");

        for (let i = 0; i < customs.length; i++) {
            customs[i].onclick = null;
        }
    }
}

hook.add("new-element", el => {
    if (autotag_started && el.tagName && el.tagName.toLowerCase() === "ul" && el.className.includes("ph4")) {
        addActionTagHandler(el);
    }
});

hook.add("mutation-element", el => {
    if (autotag_started && el.id === "action-list") {
        removeActionTagHandler(el);
    }
});

function addActionTagHandler(actionList) {
    const actions = actionList.getElementsByTagName("li");

    for (const action of actions) {
        if (!action.hasAddActionTagListener) {
            action.addEventListener("click", function (ev) {
                const name = ev.target.textContent;
                const tab = document.getElementById("node-content-tab");
                const tags = tab.getElementsByClassName("blip-tag__label");

                for (let k = 0; k < tags.length; k++) {
                    if (tags[k].textContent === name) {
                        return;
                    }
                }

                addActionTag(tab, name);
            }, true);
            action.hasAddActionTagListener = true;
        }
    }
}

function removeActionTagHandler(actionList) {
    const icons = actionList.getElementsByClassName("icon-delete");

    for (const icon of icons) {
        if (!icon.hasRemoveActionTagListener) {
            icon.addEventListener("click", function (ev) {
                const tags = document.querySelectorAll(".sidebar-content-header .blip-tag__label");
                const actions = Array.from(document.querySelectorAll("span[ng-if^='action.type']"))
                    .map(a => a.getAttribute("ng-if").match("'(.*)'")[1]);

                for (const tag of tags) {
                    const actionTag = possibleActions.find(p => tag.innerText === p.name || p.alias.includes(tag.innerText));
                    const hasAction = actionTag && actions.some(a => a === actionTag.name || actionTag.alias.includes(a));
                    
                    if (!hasAction) {
                        tag.nextElementSibling.click();
                    }
                }
            });
            icon.hasRemoveActionTagListener = true;
        }
    }
}

function addActionTag(tab, name) {
    const header = tab.getElementsByClassName("sidebar-content-header")[0];
    const tagMenuBtn = header.getElementsByTagName("img");

    if (tagMenuBtn.length > 0) {
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
            correctTagOption.click();

            setTimeout(() => {
                let colorSelector = tagMenu.getElementsByClassName("blip-tag-select-color")[0];

                if (!colorSelector)
                    return;

                colorSelector.style.display = "none";

                let config = action.name.toLowerCase().replace(' ', '-') + '-color';

                let colors = colorSelector.getElementsByClassName("blip-tag-color-option");

                for (let i = 0; i < colors.length; i++) {
                    let currentColor = colors[i].getAttribute('data-color');

                    if (currentColor === settings[config]) {
                        colors[i].click();
                    }
                }
            }, 20);
        }, 20);
    }, 10);
}