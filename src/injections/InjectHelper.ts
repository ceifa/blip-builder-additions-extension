export const cloneObject = (source: any): any => {
    let copy: any;

    if (source instanceof Function) {
        copy = null;
    } else if (source == null || typeof source !== "object") {
        copy = source;
    } else if (source instanceof Date) {
        copy = new Date();
        copy.setTime(source.getTime());
    } else if (source instanceof Array) {
        copy = [];
        for (let i = 0; i < source.length; i++) {
            copy[i] = cloneObject(source[i]);
        }
    } else if (source instanceof Error) {
        copy = source.message;
    } else if (source instanceof Object) {
        copy = {};
        for (const attr in source) {
            if (source.hasOwnProperty(attr)) {
                copy[attr] = cloneObject(source[attr]);
            }
        }
    }

    return copy;
};
