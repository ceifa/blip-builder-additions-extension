const hook = {
    add: (key, func) => {
        hooks.push({key, func});
    },
    call: (key, ...params) => {
        let toCall = hooks.filter(h => h.key === key);
        toCall.forEach(h => h.func(...params));
    }
}

let hooks = [];