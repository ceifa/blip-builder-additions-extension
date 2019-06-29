import Utils from "./Utils";

export default ((brow: typeof browser | typeof chrome) => {
    let storage: any = {};

    const ensureHasStorage = (): Promise<void> => new Promise((resolve: () => void) => {
        if (!storage || Object.keys(storage).length === 0) {
            try {
                brow.storage.sync.get("settings", (result: any) => {
                    storage = (result && result.settings) || {};
                    resolve();
                });
            } catch {
                resolve();
            }
        } else {
            resolve();
        }
    });

    const syncStorage = async (): Promise<void> => {
        brow.storage.sync.set({
            settings: storage,
        });
    };

    return class Storager {
        public static get = async (key: string | void): Promise<any> => {
            await ensureHasStorage();

            let current = storage;

            if (key) {
                const keys = key.split(".");

                for (const path of keys) {
                    if (current.hasOwnProperty(path)) {
                        current = current[path];
                    } else {
                        return null;
                    }
                }
            }

            return current;
        }

        public static set = async (key: string, value: any): Promise<void> => {
            await ensureHasStorage();

            let current = storage;
            const keys = key.split(".");

            for (let i = 0; i < keys.length; i++) {
                const path = keys[i];

                if (i === keys.length - 1) {
                    current[path] = value;
                    break;
                } else if (!storage || !storage.hasOwnProperty(path)) {
                    current[path] = {};
                }

                current = current[path];
            }

            await syncStorage();
        }

        public static clear = async (): Promise<void> => {
            storage = {};
            await syncStorage();
        }

        public static refresh = async (): Promise<void> => {
            storage = {};
            await ensureHasStorage();
        }
    };
})(Utils.getBrowser());
