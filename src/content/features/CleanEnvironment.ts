import Utils from "../../shared/Utils";
import { isBuilderLoaded } from "../Content";
import FeatureBase from "./FeatureBase";

export const USER_HEADER_SELECTOR = ".main-header-top:first-child";

export default class CleanEnvironment extends FeatureBase {
    private shouldHide: string[] = [
        "#blip-chat-container",
        ".builder-header-shadow:first-child",
    ];

    private isShowingNavbar: boolean;

    public onEnableFeature(): void {
        super.onEnableFeature();
        if (isBuilderLoaded) {
            this.startAsync();
        }
    }

    public onDisableFeature(): void {
        super.onDisableFeature();
        this.stopAsync();
    }

    public onLoadBuilder(): void {
        this.startAsync();
    }

    public onUnloadBuilder(): void {
        super.onUnloadBuilder();
        this.stopAsync();
    }

    private async stopAsync(): Promise<void> {
        this.toggleHidables(false);
        this.removeHeaderCollapser();
        this.isShowingNavbar = false;
    }

    private async startAsync(): Promise<void> {
        if (!this.isEnabled || document.getElementById("addictions-cleanenv-collapser")) {
            return;
        }

        this.toggleHidables(true);
        await this.addHeaderCollapser();
    }

    private async addHeaderCollapser(): Promise<void> {
        const res = await fetch(Utils.getUrl("resources/collapser.html"));
        const html = await res.text();

        const icons = document.querySelector(".bot-header-details");
        const collapserContainer = document.createElement("div");
        collapserContainer.innerHTML = html;
        icons.prepend(collapserContainer);
        await Utils.sleep(20);

        const button = document.getElementById("addictions-cleanenv-collapser");
        button.addEventListener("click", () => {
            const collapser = document.getElementById("addictions-cleanenv-icon");

            if (this.isShowingNavbar) {
                collapser.className = "icon-arrowup";
                document.getElementById("canvas").style.height = "";
                (document.querySelector(".builder-container") as HTMLElement).style.height = "";
            } else {
                collapser.className = "icon-arrowdown";
                document.getElementById("canvas").style.height = "calc(100vh - 56px)";
                (document.querySelector(".builder-container") as HTMLElement).style.height = "calc(100vh - 56px)";
            }

            this.isShowingNavbar = !this.isShowingNavbar;
            this.toggleElementDisplay(document.querySelector(USER_HEADER_SELECTOR), this.isShowingNavbar);
        });

        if (!this.isShowingNavbar) {
            button.click();
        }
    }

    private removeHeaderCollapser(): void {
        this.toggleElementDisplay(document.querySelector(USER_HEADER_SELECTOR), false);

        const canvas = document.getElementById("canvas");
        if (canvas) {
            canvas.style.height = "";
        }

        const container = (document.querySelector(".builder-container") as HTMLElement);
        if (container) {
            container.style.height = "";
        }

        const button = document.getElementById("addictions-cleanenv-collapser");
        if (button) {
            button.remove();
        }
    }

    private toggleHidables(toggle: boolean): void {
        this.shouldHide.forEach((s) => {
            const element = document.querySelector(s);
            this.toggleElementDisplay(element, toggle);
        });
    }

    private toggleElementDisplay(element: Element, toggle: boolean): void {
        if (element && element.classList) {
            if (toggle) {
                element.classList.add("dn");
            } else {
                element.classList.remove("dn");
            }
        }
    }
}
