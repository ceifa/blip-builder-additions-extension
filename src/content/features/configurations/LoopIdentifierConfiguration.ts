import Utils from "../../../shared/Utils";
import { inject } from "../../Content";
import IConfiguration from "./IConfiguration";

export default class EventTrackConfiguration implements IConfiguration {
    public OnLoadConfiguration = (): void => {
        document.getElementById("identify-loops").addEventListener("click", this.StartSearchingForFlowLoops);
    }

    private StartSearchingForFlowLoops = async () => {
        const flow = await inject.GetVariable("flow");
        let loopTail: Set<string> = new Set<string>();

        for (const stateKey of Object.keys(flow)) {
            const state = flow[stateKey];

            const hasInput = this.GetStateInput(state);

            if (!hasInput) {
                for (const output of this.GetStateOutputs(state)) {
                    loopTail.clear();
                    const stateLoopTail = this.HasStateLoop(flow, state, output, loopTail);
                    if (stateLoopTail) {
                        loopTail = stateLoopTail;
                        break;
                    }
                }
            }

            if (loopTail.size) {
                break;
            }
        }

        if (loopTail.size) {
            const currentTailArr = Array.from(loopTail);
            const loopTailLog = [...currentTailArr, currentTailArr[0]]
                .map((c) => `<li>${flow[c].$title}</li>`).join("");

            document.getElementById("found-loops").classList.remove("dn");
            document.getElementById("found-loops-container").innerHTML = loopTailLog;

            await inject.CallFunction("ngToast", "danger", ["Your flow has loops. See the loop tail."]);
        } else {
            document.getElementById("found-loops").classList.add("dn");

            await inject.CallFunction("ngToast", "success", ["Your flow doesn't has loops. Nice!"]);
        }

        for (let i = 0; i < 2; i++) {
            (document.querySelector(".zoom.zoom-display") as HTMLElement).click();
        }
    }

    private HasStateLoop = (flow: any, state: any, output: any, loopTail: Set<string>) => {
        loopTail = new Set<string>(loopTail);

        if (Array.from(loopTail).some((s) => s === output.stateId)) {
            return false;
        }

        const outputState = flow[output.stateId];

        const outputStateOutputs = this.GetStateOutputs(outputState);
        if (!outputStateOutputs || outputStateOutputs.length === 0) {
            return false;
        }

        const hasInput = this.GetStateInput(outputState);
        if (hasInput) {
            return false;
        }

        if (outputStateOutputs.some((o: any) => o.stateId === state.id)) {
            loopTail.add(output.stateId);
            loopTail.add(state.id);
            return loopTail;
        }

        loopTail.add(output.stateId);

        let nextTail;
        if (outputStateOutputs.some((o: any) => {
            nextTail = this.HasStateLoop(flow, state, o, loopTail);
            return nextTail;
        })) {
            return nextTail;
        }

        return false;
    }

    private GetStateInput = (state: any) => {
        return state.$contentActions.find((a: any) => a.input && !a.input.bypass);
    }

    private GetStateOutputs = (state: any) => {
        let outputs = state.$conditionOutputs;
        if (state.$defaultOutput) {
            outputs = [...(outputs || []), state.$defaultOutput];
        }
        return outputs;
    }
}
