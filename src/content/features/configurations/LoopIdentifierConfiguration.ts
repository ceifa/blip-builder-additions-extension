import { Command } from "../../../shared/types/Command";
import Utils from "../../../shared/Utils";
import IConfiguration from "./IConfiguration";

export default class EventTrackConfiguration implements IConfiguration {
    public OnLoadConfiguration = (): void => {
        document.getElementById("identify-loops").addEventListener("click", this.StartSearchingForFlowLoops);
    }

    private StartSearchingForFlowLoops = async () => {
        const flow = await Utils.SendCommand(Command.GetVariable, "#canvas", null, "flow");

        const currentTail: Set<string> = new Set<string>();
        let hasLoop: boolean = false;

        for (const stateKey of Object.keys(flow)) {
            const state = flow[stateKey];

            const hasInput = this.GetStateInput(state);

            if (!hasInput) {
                for (const output of this.GetStateOutputs(state)) {
                    currentTail.clear();
                    if (this.HasStateLoop(flow, state, output, currentTail)) {
                        hasLoop = true;
                        break;
                    }
                }
            }

            if (hasLoop) {
                break;
            }
        }

        if (hasLoop) {
            const currentTailArr = Array.from(currentTail);
            const loopTailLog = [...currentTailArr, currentTailArr[0]]
                .map((c) => `<li>${flow[c].$title}</li>`).join("");

            document.getElementById("found-loops").classList.remove("dn");
            document.getElementById("found-loops-container").innerHTML = loopTailLog;

            await Utils.SendCommand(Command.SetVariable, "#canvas", null, "searchedStates", currentTailArr);
            await Utils.SendCommand(Command.CallFunction, "#canvas", null, "ngToast", "danger",
                ["Your flow has loops. See the loop tail."]);
        } else {
            document.getElementById("found-loops").classList.add("dn");

            await Utils.SendCommand(Command.CallFunction, "#canvas", null, "ngToast", "success",
                ["Your flow doesn't has loops. Nice!"]);
        }
    }

    private HasStateLoop = (flow: any, state: any, output: any, currentTail: Set<string>) => {
        if (Array.from(currentTail).some((s) => s === output.stateId)) {
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
            currentTail.add(output.stateId);
            currentTail.add(state.id);
            return true;
        }

        currentTail.add(output.stateId);

        return outputStateOutputs.some((o: any) => this.HasStateLoop(flow, state, o, currentTail));
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
