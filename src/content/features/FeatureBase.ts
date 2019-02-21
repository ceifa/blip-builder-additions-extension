export abstract class FeatureBase {
    public isEnabled: boolean = false;
    protected configuration: any;

    public OnEnableFeature(): void {
        this.isEnabled = true;
    }

    public OnDisableFeature(): void {
        this.isEnabled = false;
    }

    public OnReceiveConfiguration(configuration: any): void {
        this.configuration = configuration;
    }

    public abstract OnLoadBuilder(): void;
}
