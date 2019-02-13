export default ((brow: typeof browser | typeof chrome) => {
    let _storage: any = null;

    const ensureHasStorage = (): Promise<void> => new Promise(resolve => {
        if (!_storage) {
            try {
                _storage = brow.storage.sync.get('settings', (result: any) => {
                    _storage = result && result['settings'];
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
        await ensureHasStorage();
        brow.storage.sync.set({
            settings: _storage
        });
    }

    return class Storager {
        static get = async (key: string): Promise<any> => {
            await ensureHasStorage();

            let current = _storage || {};
            const keys = key.split('.');

            for (const path of keys) {
                if (current.hasOwnProperty(path)) {
                    current = current[path];
                } else {
                    return null;
                }
            }

            return current;
        }

        static set = async (key: string, value: any): Promise<void> => {
            await ensureHasStorage();

            let storage = _storage || {};
            const keys = key.split('.');

            for (var i = 0; i < keys.length; i++) {
                var path = keys[i];

                if (i === keys.length - 1) {
                    storage[path] = value;
                    break;
                } else if (!storage.hasOwnProperty(path)) {
                    storage[path] = {};
                }

                storage = storage[path];
            }

            await syncStorage();
        }

        static clear = async (): Promise<void> => {
            _storage = {};
            await syncStorage();
        }

        static refresh = async (): Promise<void> => {
            _storage = null;
            await ensureHasStorage();
        }
    };
})(chrome || browser);