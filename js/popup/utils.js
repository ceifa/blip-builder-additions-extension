const formToJson = () => {
    let obj = {};
    let elements = document.querySelectorAll('input, select, textarea');

    for(let i = 0; i < elements.length; ++i) {
        if(elements[i].name) {
            obj[elements[i].name] = elements[i].type === 'checkbox' ? elements[i].checked :  elements[i].value;
        }
    }

    return JSON.stringify(obj);
}

const jsonToForm = (json) => {
    let settings = JSON.parse(json);

    for (let config in settings){
        let element = document.getElementsByName(config)[0];

        if (element){
            if (element.type === 'checkbox')
                element.checked = settings[config];
            else
                element.value = settings[config];
        }
    }
}

const closestElement = (el, selector) => {
    var matchesFn;

    ['matches','webkitMatchesSelector','mozMatchesSelector','msMatchesSelector','oMatchesSelector'].some(function(fn) {
        if (typeof document.body[fn] == 'function') {
            matchesFn = fn;
            return true;
        }
        return false;
    })

    var parent;

    while (el) {
        parent = el.parentElement;
        if (parent && parent[matchesFn](selector)) {
            return parent;
        }
        el = parent;
    }

    return null;
}