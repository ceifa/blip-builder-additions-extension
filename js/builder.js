var searchInput;
var initialized = false;
var intervals = [];

(() => {
    init();
})();

function init() {
    console.log("Initializing...");

    addNavbarHandle(() => {
        addSearch();
        addActionHandle();
        addRemoveActionHandle();
    });
}

function waitBuilder() {
    const navbar = document.getElementsByTagName("sidenav-menu-item");
    const tools = document.getElementsByClassName("icon-button-list");

    if (navbar && navbar[0] && navbar[0].children[0].className.includes("active") && tools.length > 0){
        return true;
    }

    return false;
}

function addNavbarHandle(action) {
    intervals.push(setInterval(() => {
        if (waitBuilder()) {
            if (!initialized) {
                intervals.forEach(i => clearInterval(i));
                initialized = true;
                action();
                init();
            }
        }
        else{
            initialized = false;
        }
    }), 500);
}

function addRemoveActionHandle() {
    intervals.push(setInterval(() => {
        if (!initialized)
            return;

        const deleteButtons = document.querySelectorAll('#action-list .icon-delete');

        if (deleteButtons.length > 0) {
            for (let i = 0; i < deleteButtons.length; i++){
                deleteButtons[i].onclick = (ev) => {
                    let name = ev.target.parentElement.previousElementSibling.firstElementChild.innerText.trim();
                    let actions = document.querySelectorAll("#action-list .w-80 span:not(.invalid-action)");
                    
                    let hasMoreActions = false;
                    for (let k = 0; k < actions.length; k++){
                        if (actions[k].innerText.trim() === name)
                            hasMoreActions = true;
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
    }, 200))
}

function addActionHandle() {
    intervals.push(setInterval(() => {
        if (!initialized)
            return;

        const addActions = document.querySelectorAll("ul.ma0.ph4.pt3 li");
    
        if (addActions.length > 0){
            for (let i = 0; i < addActions.length; i++) {
                addActions[i].onclick = (ev) => {
                    const headerButtons = document.getElementsByClassName("sidebar-helper-header__actions")[0].children;
                    let delay = 0;
    
                    if (headerButtons.length > 1){
                        headerButtons[0].click();
                        delay = 10;
                    }

                    const name = ev.target.innerHTML;

                    const tags = document.querySelectorAll(".sidebar-content-header .blip-tag__label");

                    for (let k = 0; k < tags.length; k++){
                        if (tags[k].innerText === name){
                            return;
                        }
                    }

                    setTimeout(() => {        
                        let input = document.getElementsByClassName("blip-select__input")[0];
                        input.value = name;
                        input.dispatchEvent(new Event("input"))
            
                        setTimeout(() => {
                            let options = document.getElementsByClassName("blip-select__options")[0];
                            let correctOption = document.getElementsByClassName("blip-select__option")[0];
            
                            options.style.display = "none"
                            correctOption.click()
                            
                            setTimeout(() => {
                                let selector = document.getElementsByClassName("blip-tag-select-color")[0];
                                if (!selector){
                                    console.log("Can't find color selector");
                                    return;
                                }
                                                              
                                selector.style.display = "none";
                                let colors = document.getElementsByClassName("blip-tag-color-option");
                                
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
                            }, 10)
                        }, 10)
                    }, delay)
                }
            }
        }
    }, 200));
}

function addSearch() {
    const buttonList = document.getElementsByClassName("icon-button-list")[0];
    
    let li = document.createElement("li");
    li.innerHTML = "<tooltip-button>" +
                        "<div class='tooltip-button'>" +
                            "<button><div><i class='icon icon-search'></i></div></button>" +
                            "<div class='text-container' style='width:200px'>" +
                                "<div class='material-wrapper'>" +
                                    "<input placeholder='Buscar' id='searchField' maxlength='30' style='background:rgba(155,155,155,0); border: none; outline: none !important; width:110px; position:absolute;top: 7px;' />" +
                                    "<span class='input-right text-gray' id='contador' style='position:absolute; top:5px; right:15px;'></span>" +
                                "</div>" +
                            "</div>" +
                        "</div>" +
                    "</tooltip-button>";
    
    buttonList.append(li);

    searchInput = document.getElementById("searchField");

    searchInput.onkeyup = (ev) => {
        let input = ev.target.value.toLowerCase();
        executeSearch(input);
    }
}

function executeSearch(filter){
    chrome.storage.sync.get([ 'settings' ], (result) => {
        let settings;
        
        if (!result || !result.settings)
            settings = {
                outline_enabled: true,
                outline: "#ff4a4a",
                box_enabled: false,
                box: "#f6ff85"
            }
        else
            settings = JSON.parse(result.settings)

        let blocks = document.getElementsByClassName("builder-node-title");
        let found = 0;

        for (let i = 0; i < blocks.length; i++){
            let node = blocks[i].parentElement;
    
            const blockName = blocks[i].innerText.toLowerCase();
            const tags = Array.from(blocks[i].nextElementSibling.getElementsByClassName("blip-tag__label")).map(element => element.innerText).join().toLowerCase();
    
            if (filter && (blockName.includes(filter) || tags.includes(filter))){
                if (settings.outline_enabled){
                    node.style.boxShadow = `0 0 0 4px ${settings.outline}`;
                }
                else {
                    node.style.boxShadow = "none";
                }
                if (settings.box_enabled){
                    node.style.backgroundColor = settings.box;
                    node.style.backgroundImage = "none";
                }
                else {
                    if (node.id === "onboarding" || node.id === "fallback")
                        node.style.backgroundColor = "";
                    else
                        node.style.backgroundColor = "white";
                }

                found++;
            }
            else{
                if (node.id === "onboarding" || node.id === "fallback")
                    node.style.backgroundColor = "";
                else
                    node.style.backgroundColor = "white";

                node.style.boxShadow = "none";
            }
        }

        document.getElementById('contador').innerText = found;
    });
}

chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
        switch(message.type) {
            case "settingsChange":
                executeSearch(searchInput && searchInput.value && searchInput.value.toLowerCase());
                break;
        }
    }
);