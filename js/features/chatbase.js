let chatbase_started;

const chatbaseMessageIcon = `
    <img style="margin-top: -35px; margin-right: -2px;" src="https://i.imgur.com/JKnS5xi.png" />
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
            <h1 class="mb5 mt4-1" >Restore published version</h1>
            <div class="mh6 ph4" >If you restore the last published version, you may loose any changes made in the flow since then. Do you want to proceed?</div>
        </div>

        <div class="modal-footer">
            <button type="submit" class="button-primary w-100">Yes</button>
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

    if (!isTypingOrHasIconOrAreEditing) {
        const chatbaseOption = document.createElement("div");
        chatbaseOption.style = "right: 51px; background-color: gold;";
        chatbaseOption.className = "editIco chatbaseIco";
        chatbaseOption.innerHTML = chatbaseMessageIcon;
        chatbaseOption.onclick = function() {
            const modal = document.createElement("div");
            modal.id = "chatbase-modal";
            modal.className = "modal";
            modal.innerHTML = chatbaseMessageModal;
            document.body.append(modal);

            const closers = document.getElementsByClassName("chatbase-close-modal");
            for (const closer of closers) {
                closer.onclick = function() {
                    document.getElementById("chatbase-modal").remove();
                }
            }
        };
        leftBubble.append(chatbaseOption);
    }
}