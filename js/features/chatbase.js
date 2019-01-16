let chatbase_started;

const chatbaseMessageIcon = `
    <img style="margin-top: -35px; margin-right: -2px;" src="https://i.imgur.com/JKnS5xi.png" />
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
    const isTypingOrHasIconOrAreEditing = Array.from(leftBubble.children).some(c => c.className.includes("typing") || c.className.includes("chatbaseIco") || c.tagName.toLowerCase() === "form");

    if (leftBubble && !isTypingOrHasIconOrAreEditing) {
        const chatbaseOption = document.createElement("div");
        chatbaseOption.style = "right: 51px; background-color: gold;";
        chatbaseOption.className = "editIco chatbaseIco";
        chatbaseOption.innerHTML = chatbaseMessageIcon;
        leftBubble.append(chatbaseOption);
    }
}