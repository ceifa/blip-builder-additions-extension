let autotag_started;
let _addActionTagTimeout;

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
        if (!_addActionTagTimeout) {
            _addActionTagTimeout = setTimeout(() => {
                _addActionTagTimeout = null;
                addActionTagHandler(el);
            }, 15);
        }
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
    }
}

function removeActionTagHandler(actionList) {
    const icons = actionList.getElementsByClassName("icon-delete");

    for (const icon of icons) {
        if (!icon.onclick) {
            icon.onclick = function (ev) {
                const tags = document.querySelectorAll(".sidebar-content-header .blip-tag__label");
                const actions = Array.from(actionList.querySelectorAll(".w-80 span:not(.invalid-action)")).map(a => a.innerText.trim());

                for (const tag of tags) {
                    const isActionTag = possibleActions.find(a => tag.innerText === a.name || a.alias.includes(tag.innerText));

                    if (isActionTag && !actions.some(a => a === tag.innerText)) {
                        tag.nextElementSibling.click();
                    }
                }
            }
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
            }, 15);
        }, 15);
    }, 5);
}