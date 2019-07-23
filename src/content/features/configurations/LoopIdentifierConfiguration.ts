import { inject } from "../../Content";
import IConfiguration from "./Configuration";

export default class EventTrackConfiguration implements IConfiguration {
    public onLoadConfiguration = (): void => {
        document.getElementById("identify-loops").addEventListener("click", this.startSearchingForFlowLoops);
    }

    private startSearchingForFlowLoops = async () => {
        const flow = await inject.getVariable("flow");
        let loopTail: Set<string> = new Set<string>();

        for (const stateKey of Object.keys(flow)) {
            const state = flow[stateKey];

            const hasInput = this.getStateInput(state);

            if (!hasInput) {
                for (const output of this.getStateOutputs(state)) {
                    loopTail.clear();
                    const stateLoopTail = this.hasStateLoop(flow, state, output, loopTail);
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

            await inject.callFunction("ngToast", "danger", ["Your flow has loops. See the loop tail."]);
        } else {
            document.getElementById("found-loops").classList.add("dn");

            await inject.callFunction("ngToast", "success", ["Your flow doesn't has loops. Nice!"]);
        }

        for (let i = 0; i < 2; i++) {
            (document.querySelector(".zoom.zoom-display") as HTMLElement).click();
        }
    }

    private hasStateLoop = (flow: any, state: any, output: any, loopTail: Set<string>) => {
        loopTail = new Set<string>(loopTail);

        if (Array.from(loopTail).some((s) => s === output.stateId)) {
            return false;
        }

        const outputState = flow[output.stateId];

        const outputStateOutputs = this.getStateOutputs(outputState);
        if (!outputStateOutputs || outputStateOutputs.length === 0) {
            return false;
        }

        const hasInput = this.getStateInput(outputState);
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
            nextTail = this.hasStateLoop(flow, state, o, loopTail);
            return nextTail;
        })) {
            return nextTail;
        }

        return false;
    }

    private getStateInput = (state: any) => {
        return state.$contentActions.find((a: any) => a.input && !a.input.bypass);
    }

    private getStateOutputs = (state: any) => {
        let outputs = state.$conditionOutputs;
        if (state.$defaultOutput) {
            outputs = [...(outputs || []), state.$defaultOutput];
        }
        return outputs;
    }
}
