abstract class Feature {
    settings: any;
    isEnabled: boolean = false;

    constructor(settings: any) {
        this.settings = settings;
    };

    OnEnableFeature(): void {
        this.isEnabled = true;
    }

    OnDisableFeature(): void {
        this.isEnabled = false;
    }

    abstract OnLoadBuilder(builderController: any): void;
}