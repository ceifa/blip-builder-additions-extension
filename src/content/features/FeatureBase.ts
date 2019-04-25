export default abstract class FeatureBase {
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

    public OnUnloadBuilder(): void {
        // I don't know what to do here
    }

    public abstract OnLoadBuilder(): void;
}
