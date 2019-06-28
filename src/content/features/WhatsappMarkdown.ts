import { inject } from "../Content";
import FeatureBase from "./FeatureBase";

export default class WhatsappMarkdown extends FeatureBase {
    private readonly MarkdownRules = [
        {
            char: `\\*`,
            tag: "strong",
        },
        {
            char: "_",
            tag: "i",
        },
        {
            char: "~",
            tag: "strike",
        },
        {
            char: "```",
            tag: "tt",
        },
    ];

    public OnLoadBuilder(): void {
        this.StartAsync();
    }

    private async StartAsync(): Promise<void> {
        await inject.InterceptFunction("SidebarContentService", "showSidebar", this.OnOpenSidebar);
    }

    private OnOpenSidebar = async () => {
        this.AddWhatsappMarkdown();
        const editIconElements = document.querySelectorAll(".blip-container:not(.chat-state) .editIco:not(.trashIco)");
        editIconElements.forEach((e) => e.addEventListener("click", (_) => {
            document.querySelectorAll("form textarea")
                .forEach((fe) => fe.addEventListener("keydown", (ev: KeyboardEvent) => {
                    if (ev.keyCode === 13) {
                        this.OnOpenSidebar();
                    }
                }));
            document.querySelectorAll(".bubble.left form")
                .forEach((fe) => fe.addEventListener("submit", this.OnOpenSidebar));
        }));
    }

    private AddWhatsappMarkdown = () => {
        if (!this.isEnabled) {
            return;
        }

        const messages = document.querySelectorAll(".bubble.left");
        messages.forEach((m) => {
            const isTypingOrAreEditing =
                !messages ||
                Array.from(m.children).some(
                    (c) =>
                        c.className.includes("typing") || c.tagName.toLowerCase() === "form",
                );

            if (!isTypingOrAreEditing) {
                const contentElement = m.lastElementChild;
                contentElement.innerHTML = this.ProcessMarkdown(contentElement.innerHTML);
            }
        });
    }

    private ProcessMarkdown = (text: string) => {
        for (const rule of this.MarkdownRules) {
            const rgx = new RegExp(`${rule.char}(.+?)${rule.char}`, "g");
            text = text.replace(rgx, `<${rule.tag}>$1</${rule.tag}>`);
        }
        return text;
    }
}
