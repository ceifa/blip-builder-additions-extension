import IConfiguration from "./IConfiguration";

export default class EventTrackConfiguration implements IConfiguration {
    public OnLoadConfiguration = (): void => {
        document.getElementById("identify-loops").addEventListener("click", this.StartSearchingForFlowLoops);
    }

    private StartSearchingForFlowLoops = () => {
        
    }
}