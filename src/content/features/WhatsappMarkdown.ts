import Utils from "../../shared/Utils";
import { FeatureBase } from "./FeatureBase";

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
        if (this.isEnabled) {
            this.StartAsync();
        }
    }

    private async StartAsync(): Promise<void> {
        await Utils.InterceptFunction("#canvas", null, "SidebarContentService", "showSidebar", this.OnOpenSidebar);
    }

    private OnOpenSidebar = async () => {
        this.AddWhatsappMarkdown();
        await Utils.InterceptFunction("contents", "contents", null, "onUpdateAndSave", this.AddWhatsappMarkdown);
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
