const formToJson = () => {
    let obj = {};
    let elements = document.querySelectorAll('input, select, textarea');

    for(let element of elements) {
        if(element.name) {
            let value = element.type === 'checkbox' ? element.checked :  element.value;
            obj[element.name] = value;
        }
    }

    return JSON.stringify(obj);
}

const jsonToForm = (json) => {
    for (let config in json){
        let elements = document.getElementsByName(config);

        if (elements && elements.length > 0){
            setElementValue(elements[0], json[config])
        }
    }
}

const setElementValue = (element, value) => {
    if (element.type === 'checkbox')
        element.checked = value;
    else
        element.value = value;

    element.dispatchEvent(new Event("change"));
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