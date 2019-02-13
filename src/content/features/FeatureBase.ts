abstract class Feature {
    public isEnabled: boolean = false;
    private configuration: any;

    public OnEnableFeature(): void {
        this.isEnabled = true;
    }

    public OnDisableFeature(): void {
        this.isEnabled = false;
    }

    public OnReceiveConfiguration(configuration: any): void {
        this.configuration = configuration;
    }

    public abstract OnLoadBuilder(builderController: any): void;
}
