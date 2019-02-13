export default class Utils {
    public static interceptFunction = (source: any, targetName: string, options: any) => {
        const fnToWrap = source[targetName];

        source[targetName] = function() {
            if (options.hasOwnProperty("before")) {
                options.before.apply(this, arguments);
            }

            const result = fnToWrap.apply(this, arguments);

            if (options.hasOwnProperty("after")) {
                options.after.apply(this, arguments);
            }

            return result;
        };
    }
}
