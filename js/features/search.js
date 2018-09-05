let searchInput;

const searchButton =   "<tooltip-button id='search-tool'>" +
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

function initSearch() {
    const buttonList = document.getElementsByClassName("icon-button-list")[0];
    
    let li = document.createElement("li");
    li.innerHTML = searchButton;
    
    buttonList.append(li);

    searchInput = document.getElementById("searchField");

    searchInput.onkeyup = (ev) => {
        let input = ev.target.value.toLowerCase();
        executeSearch(input);
    }
}

function stopSearch() {
    let tooltip = document.getElementById('search-tool');

    if (tooltip){
        executeSearch();
        tooltip.parentElement.removeChild(tooltip);
    }
}

function executeSearch(filter){
    const blocks = document.getElementsByClassName("builder-node-title");
    let found = 0;

    
    for (let i = 0; i < blocks.length; i++){
        let node = blocks[i].parentElement;

        const blockName = blocks[i].innerText.toLowerCase();
        const tags = Array.from(blocks[i].nextElementSibling.getElementsByClassName("blip-tag__label")).map(element => element.innerText).join().toLowerCase();

        if (filter && (blockName.includes(filter) || tags.includes(filter))){
            colorizeBlock(node, true);

            found++;
        }
        else{
            colorizeBlock(node, false);
        }
    }

    document.getElementById('contador').innerText = found;
}

function colorizeBlock(block, match){
    if (match && settings['outline-enabled'])
        block.style.boxShadow = `0 0 0 4px ${settings.outline}`;
    else
        block.style.boxShadow = "none";

    if (match && settings['box-enabled']){
        block.style.backgroundColor = settings.box;
        block.style.backgroundImage = "none";
    }
    else {
        if (block.id === "onboarding" || block.id === "fallback")
            block.style.backgroundColor = "";
        else
            block.style.backgroundColor = "white";
    }
}

hook.add("form-change", (form) => {
    if (form === "search-settings") {
        executeSearch(searchInput && searchInput.value && searchInput.value.toLowerCase());
    }
});