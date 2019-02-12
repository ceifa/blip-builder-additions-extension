abstract class Feature {
    configuration: any;
    isEnabled: boolean = false;

    OnEnableFeature(): void {
        this.isEnabled = true;
    }

    OnDisableFeature(): void {
        this.isEnabled = false;
    }

    OnReceiveConfiguration(configuration: any): void {
        this.configuration = configuration;
    }

    abstract OnLoadBuilder(builderController: any): void;
}