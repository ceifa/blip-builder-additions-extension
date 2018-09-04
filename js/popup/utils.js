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
    for (let config in json){
        let element = document.getElementsByName(config)[0];

        if (element){
            if (element.type === 'checkbox')
                element.checked = json[config];
            else
                element.value = json[config];
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