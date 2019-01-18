let chatbase_started;

const chatbaseMessageIcon = `
    <img style="margin-top: -35px; margin-right: -2px;" src="https://i.imgur.com/JKnS5xi.png" />
`;

const chatbaseInputIcon = `
    <img src="https://i.imgur.com/JKnS5xi.png" style="width: 25px;height: 100%;">
`;

const chatbaseMessageModal = `
    <div class="modal-overlay chatbase-close-modal"></div>
    <form class="modal-dialog modal-sm layout-center-y">
        <div class="modal-toolbar">
            <button type="button" class="no-style chatbase-close-modal">
                <i class="icon-close text-gray"></i>
            </button>
        </div>

        <div class="modal-body row">
            <h1 class="mb5 mt4-1" >Insert chatbase bot response</h1>
            <div class="mh6 ph4" style="text-align: start">
                <div class="mt3 labeled-input">
                    <label>Intention</label>
                    <input type="text" />
                </div>
                <div class="mt3 labeled-input">
                    <label>Bot response message</label>
                    <input id="bot-response-message" type="text" />
                </div>
            </div>
        </div>

        <div class="modal-footer">
            <button type="submit" class="button-primary w-100">Confirm</button>
        </div>
    </form>
`;

function initChatbase() {
    chatbase_started = true;
}

function stopChatbase() {
    chatbase_started = false;
}

hook.add("new-element", (el) => {
    if (chatbase_started && el.className && el.className.includes("anchor-container") && el.className.includes("component-card-container")) {
        addChatbaseMessageOptions(el);
    } else if (chatbase_started && el.id === "node-content-tab") {
        addChatbaseInputOption(el);
    }
});

hook.add("mutation-element", (el) => {
    if (chatbase_started && el.className && el.className.includes("blip-card-container")) {
        addChatbaseMessageOptions(el);
    }
});

function addChatbaseMessageOptions(message) {
    const leftBubble = message.querySelector(".bubble.left");
    const isTypingOrHasIconOrAreEditing = leftBubble && Array.from(leftBubble.children).some(c => c.className.includes("typing") || c.className.includes("chatbaseIco") || c.tagName.toLowerCase() === "form");

    if (leftBubble && !isTypingOrHasIconOrAreEditing) {
        if (true) {
            const noChatbasePoint = document.createElement('div');
            noChatbasePoint.style = "background-color: #f76556;width: 10px;height: 10px;border-radius: 50%;margin-left: auto;margin-right: 25px;";
            leftBubble.parentElement.append(noChatbasePoint);
        }

        const chatbaseOption = document.createElement("div");
        chatbaseOption.style = "right: 51px; background-color: gold;";
        chatbaseOption.className = "editIco chatbaseIco";
        chatbaseOption.innerHTML = chatbaseMessageIcon;
        chatbaseOption.botResponseMessage = leftBubble.lastElementChild.textContent.trim();
        chatbaseOption.onclick = function() {
            const modal = document.createElement("div");
            modal.id = "chatbase-modal";
            modal.className = "modal";
            modal.innerHTML = chatbaseMessageModal;
            document.body.append(modal);

            const botMessageElement = document.getElementById("bot-response-message");
            botMessageElement.value = this.botResponseMessage;

            const closers = document.getElementsByClassName("chatbase-close-modal");
            for (const closer of closers) {
                closer.onclick = function() {
                    document.getElementById("chatbase-modal").remove();
                };
            }
        };
        leftBubble.append(chatbaseOption);
    }
}

function addChatbaseInputOption(el) {
    const tabItems = document.getElementsByClassName("content-tabs-items")[0];

    if (tabItems) {
        const chatbaseOption = document.createElement("li");
        chatbaseOption.style = "padding: 0;margin-left: 8px;display: inline-flex;vertical-align: middle;cursor: pointer;";
        chatbaseOption.innerHTML = chatbaseInputIcon;
        tabItems.append(chatbaseOption);
    }
}

function getSelectedNode() {
    return document.querySelector('.selected-node.editing-node');
}

function getToast() {
    return angular && angular.element(document.body).injector().get('ngToast');
}