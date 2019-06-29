export default abstract class FeatureBase {
    public isEnabled: boolean = false;
    protected configuration: any;

    public onEnableFeature(): void {
        this.isEnabled = true;
    }

    public onDisableFeature(): void {
        this.isEnabled = false;
    }

    public onReceiveConfiguration(configuration: any): void {
        this.configuration = configuration;
    }

    public onUnloadBuilder(): void {
        // I don't know what to do here
    }

    public abstract onLoadBuilder(): void;
}
