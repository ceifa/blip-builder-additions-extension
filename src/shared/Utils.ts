export default class Utils {
    public static InjectPageScript = (file: string) => {
        const element = document.createElement("script");
        element.src = Utils.GetUrl(file);

        document.head.appendChild(element);
        return new Promise((resolve) => element.addEventListener("load", resolve));
    }

    public static GetRandomIdentifier = () => Math.random().toString(36).substr(2, 9);

    public static GetUrl = (path: string) => Utils.GetBrowser().extension.getURL(path);

    public static Sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    public static GetBrowser = () => chrome || browser;
}
