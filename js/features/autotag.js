let builderObserver;

function initAutoTag() {
    createBuilderObserver();
}

function stopAutoTag() {
    builderObserver.disconnect();
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

function removeActionTagHandler(actionList){
    let icons = actionList.getElementsByClassName("icon-delete");

    for (let i = 0; i < icons.length; i++) {
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

function addActionTag(tab, name){
    const header = tab.getElementsByClassName("sidebar-content-header")[0];
    const tagMenuBtn = header.getElementsByTagName("img");

    if (tagMenuBtn.length > 0){
        tagMenuBtn[0].click();
    }

    const tagMenu = header.getElementsByTagName("blip-tags")[0];

    let input = tagMenu.getElementsByTagName("input")[0];
    input.value = name;

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
                let colors = colorSelector.getElementsByClassName("blip-tag-color-option");   

                switch (name) {
                    case 'Event tracking':
                    case 'Registro de eventos':
                        colors[1].click();
                        break;
                    case 'Execute script':
                    case 'Executar script':
                        colors[3].click();
                        break;
                    case 'Manage distribution list':
                    case 'Gerenciar lista de distribuição':
                        colors[5].click();
                        break;
                    case 'Redirect to service':
                    case 'Redirecionar a um serviço':
                        colors[6].click();
                        break;
                    case 'Set contact':
                    case 'Definir contato':
                        colors[8].click();
                        break;
                    case 'Process HTTP':
                    case 'Requisição HTTP':
                        colors[11].click();
                        break;
                }
            }, 10);
        }, 10);
    }, 5);
}

function removeActionTag(actionElement){
    
}