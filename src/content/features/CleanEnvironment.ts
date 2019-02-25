import Utils from "../../shared/Utils";
import { isBuilderLoaded } from "../Content";
import { FeatureBase } from "./FeatureBase";

export const USER_HEADER_SELECTOR = ".main-header-top:first-child";

export default class CleanEnvironment extends FeatureBase {
    private shouldHide: string[] = [
        "#blip-chat-container",
        ".builder-header-shadow:first-child",
    ];

    private isShowingNavbar: boolean;

    public OnEnableFeature(): void {
        super.OnEnableFeature();
        if (isBuilderLoaded) {
            this.StartAsync();
        }
    }

    public OnDisableFeature(): void {
        super.OnDisableFeature();
        this.StopAsync();
    }

    public OnLoadBuilder(): void {
        this.StartAsync();
    }

    public OnUnloadBuilder(): void {
        super.OnUnloadBuilder();
        this.StopAsync();
    }

    private async StopAsync(): Promise<void> {
        this.ToggleHidables(false);
        this.RemoveHeaderCollapser();
    }

    private async StartAsync(): Promise<void> {
        if (!this.isEnabled) {
            return;
        }

        this.ToggleHidables(true);
        await this.AddHeaderCollapser();
    }

    private async AddHeaderCollapser(): Promise<void> {
        const res = await fetch(Utils.getUrl("resources/collapser.html"));
        const html = await res.text();

        document.querySelector("ul.action-icons").innerHTML += html;
        await Utils.sleep(20);

        const button = document.getElementById("addictions-cleanenv-li");
        button.onclick = () => {
            const collapser = document.getElementById("addictions-cleanenv-i");

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
            this.ToggleElementDisplay(document.querySelector(USER_HEADER_SELECTOR), this.isShowingNavbar);
        };

        button.click();
    }

    private RemoveHeaderCollapser(): void {
        this.ToggleElementDisplay(document.querySelector(USER_HEADER_SELECTOR), false);

        const canvas = document.getElementById("canvas");
        if (canvas) {
            canvas.style.height = "";
        }

        const container = (document.querySelector(".builder-container") as HTMLElement);
        if (container) {
            container.style.height = "";
        }

        const button = document.getElementById("addictions-cleanenv-li");
        if (button) {
            button.remove();
        }
    }

    private ToggleHidables(toggle: boolean): void {
        this.shouldHide.forEach((s) => {
            const element = document.querySelector(s);
            if (element && element.classList) {
                this.ToggleElementDisplay(element, toggle);
            }
        });
    }

    private ToggleElementDisplay(element: Element, toggle: boolean): void {
        if (toggle) {
            element.classList.add("dn");
        } else {
            element.classList.remove("dn");
        }
    }
}
