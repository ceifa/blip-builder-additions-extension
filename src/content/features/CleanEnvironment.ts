import { FeatureBase } from "./FeatureBase";

export default class CleanEnvironment extends FeatureBase {
    private isShowingNavbar = true;

    public OnEnableFeature(): void {
        super.OnEnableFeature();
        this.StartAsync();
    }

    public OnLoadBuilder(): void {
        if (this.isEnabled) {
            this.StartAsync();
        }
    }

    private async StartAsync(): Promise<void> {
        this.RemoveBlipChatIcon();
        this.RemoveShadow();
        this.AddHeaderCollapser();
    }

    private RemoveShadow = () => {
        document.getElementsByClassName("builder-header-shadow")![0]!.remove();
    }

    private RemoveBlipChatIcon = () => {
        document.getElementById("blip-chat-open-iframe")!.remove();
    }

    private AddHeaderCollapser = () => {
        const button = document.createElement("li");
        button.innerHTML = "<i id='btn-nav-collapse' class='icon-arrowup'></i>";
        document.querySelector("ul.action-icons").appendChild(button);
        button.onclick = () => {
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

            this.ToggleUserNavbar(this.isShowingNavbar);
        };
        button.click();
    }

    private ToggleUserNavbar = (toggle: boolean) => {
        document.querySelector(".main-header-top").classList.toggle("dn");
    }
}
