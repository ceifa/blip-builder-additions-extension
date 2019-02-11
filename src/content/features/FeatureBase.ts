abstract class Feature {
    isEnabled: boolean = false;

    OnEnableFeature(): void {
        this.isEnabled = true;
    }

    OnDisableFeature(): void {
        this.isEnabled = false;
    }

    abstract OnLoadBuilder(builderController: any): void;
}