export default class Utils {
    public static injectPageScript = (file: string) => {
        const element = document.createElement("script");
        element.src = Utils.getUrl(file);

        document.head.appendChild(element);
        return new Promise((resolve) => element.addEventListener("load", resolve));
    }

    public static getRandomIdentifier = () => Math.random().toString(36).substr(2, 9);

    public static getUrl = (path: string) => Utils.getBrowser().extension.getURL(path);

    public static sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    public static getBrowser = () => chrome || browser;
}
