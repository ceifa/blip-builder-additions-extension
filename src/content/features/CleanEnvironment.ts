import { FeatureBase } from "./FeatureBase";

export default class CleanEnvironment extends FeatureBase {
    private isShowingNavbar = true;
    private button: any;

    public OnEnableFeature(): void {
        super.OnEnableFeature();
        this.StartAsync();
    }

    public OnDisableFeature(): void {
        super.OnDisableFeature();
        this.RemoveHeaderCollapse();
    }

    public OnLoadBuilder(): void {
        if (this.isEnabled) {
            this.StartAsync();
        }
    }

    public OnUnloadBuilder(): void {
        super.OnUnloadBuilder();
        this.RemoveHeaderCollapse();
    }

    private async StartAsync(): Promise<void> {
        this.RemoveBlipChatIcon();
        this.RemoveShadow();

        this.isShowingNavbar = true;
        this.AddHeaderCollapser();
    }

    private RemoveShadow = () => {
        document.getElementsByClassName("builder-header-shadow")![0]!.remove();
    }

    private RemoveBlipChatIcon = () => {
        if (document.getElementById("blip-chat-open-iframe")) {
            document.getElementById("blip-chat-open-iframe").remove();
        }
    }

    private RemoveHeaderCollapse = () => {
        this.ToggleUserNavbar(false);
        const canvas = document.getElementById("canvas");
        if (canvas) { canvas.style.height = ""; }
        const container = (document.querySelector(".builder-container") as HTMLElement);
        if (container) { container.style.height = ""; }
        this.button.remove();
    }

    private AddHeaderCollapser = () => {
        this.button = document.createElement("li");
        this.button.innerHTML = "<i id='btn-nav-collapse' class='icon-arrowup'></i>";
        document.querySelector("ul.action-icons").appendChild(this.button);
        this.button.onclick = () => {
            this.isShowingNavbar = !this.isShowingNavbar;

            const collapser = document.getElementById("btn-nav-collapse");
            if (this.isShowingNavbar) {
                collapser.classList.remove("icon-arrowdown");
                collapser.classList.add("icon-arrowup");
                document.getElementById("canvas").style.height = "";
                (document.querySelector(".builder-container") as HTMLElement).style.height = "";
            } else {
                collapser.classList.remove("icon-arrowup");
                collapser.classList.add("icon-arrowdown");
                document.getElementById("canvas").style.height = "calc(100vh - 56px)";
                (document.querySelector(".builder-container") as HTMLElement).style.height = "calc(100vh - 56px)";
            }

            this.ToggleUserNavbar(!this.isShowingNavbar);
        };
        this.button.click();
    }

    private ToggleUserNavbar = (toggle: boolean) => {
        if (toggle) {
            document.querySelector(".main-header-top").classList.add("dn");
        } else {
            document.querySelector(".main-header-top").classList.remove("dn");
        }
    }
}
