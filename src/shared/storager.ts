export default (browser => {
    const defaultSettings = {
        autotag: {
            enabled: true,
            executescript: '#FF961E',
            eventtrack: '#61D36F',
            distributionlist: '#1EDEFF',
            redirectservice: '#1EA1FF',
            setcontact: '#FF1E90',
            processhttp: '#7762E3',
            setvariable: '#FF4A1E',
            processcommand: '#FC91AE'
        },
        whatsappmarkdown: {
            enabled: true
        }
    };

    let _storage: any = null;

    const ensureHasStorage = async () => {
        return new Promise(resolve => {
            if (!_storage) {
                try {
                    _storage = browser.storage.sync.get('settings', (result: any) => {
                        _storage = result && result['settings'];

                        if (!_storage) {
                            _storage = defaultSettings;
                        }

                        resolve();
                    });
                } catch {
                    _storage = defaultSettings;
                    resolve();
                }
            } else {
                resolve();
            }
        });
    }

    const syncStorage = async () => {
        await ensureHasStorage();
        browser.storage.sync.set({
            settings: _storage
        });
    }

    return class Storager {
        static get = async (key: string) => {
            await ensureHasStorage();

            let current = _storage;
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

        static set = async (key: string, value: any) => {
            await ensureHasStorage();

            let storage: any = _storage;
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

        static clear = async () => {
            _storage = defaultSettings;
            await syncStorage();
        }

        static refresh = async () => {
            _storage = null;
            await ensureHasStorage();
        }
    };
})(chrome || browser);