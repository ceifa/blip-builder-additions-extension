var initialized = false;
var intervals = [];

(() => {
    addNavbarHandle();
})();

function init() {
    console.log("Initializing...");

    addSearch();
    addActionHandle();
}

function waitBuilder() {
    const navbar = document.getElementsByTagName("sidenav-menu-item");
    const tools = document.getElementsByClassName("icon-button-list");

    if (navbar && navbar[0] && navbar[0].children[0].className.includes("active") && tools.length > 0){
        return true;
    }

    return false;
}

function addNavbarHandle() {
    intervals.push(setInterval(() => {
        if (waitBuilder()) {
            if (!initialized) {
                intervals.forEach(i => clearInterval(i));
                initialized = true;
                init();
            }
        }
        else{
            initialized = false;
        }
    }), 500);
}

function addActionHandle() {
    intervals.push(setInterval(() => {
        if (!initialized)
            return;

        const addActions = document.querySelectorAll(".ma0.ph4.pt3 li");
    
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

                    const tags = document.getElementsByClassName("blip-tag__label");

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
                            
                            document.getElementsByClassName("blip-tag-select-color")[0].style.display = "none";

                            setTimeout(() => {
                                let colors = document.getElementsByClassName("blip-tag-color-option");
                                
                                console.log(name)
                                switch (name) {
                                    case 'Event tracking':
                                        colors[1].click();
                                        break;
                                    case 'Execute script':
                                        colors[3].click();
                                        break;
                                    case 'Manage distribution list':
                                        colors[5].click();
                                        break;
                                    case 'Redirect to service':
                                        colors[6].click();
                                        break;
                                    case 'Set contact':
                                        colors[8].click();
                                        break;
                                    case 'Process HTTP':
                                        colors[11].click();
                                        break;
                                }
                            }, 10)
                        }, 10)
                    }, delay)
                }
            }
        }
    }, 250));
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

    let searchInput = document.getElementById("searchField");

    searchInput.onkeyup = (ev) => {
        let input = ev.target.value.toLowerCase();
        let blocks = document.getElementsByClassName("builder-node-title");

        for (let i = 0; i < blocks.length; i++){
            let node = blocks[i].parentElement;

            const blockName = blocks[i].innerText.toLowerCase();
            const tags = Array.from(blocks[i].nextElementSibling.getElementsByClassName("blip-tag__label")).map(element => element.innerText).join().toLowerCase();

            if (input && (blockName.includes(input) || tags.includes(input))){
                node.style.boxShadow = "0 0 0 4px #ff4a4a";
            }
            else{
                node.style.boxShadow = "none";
            }
        }
    }
}