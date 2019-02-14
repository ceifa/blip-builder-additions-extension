window.addEventListener('message', function(ev) {
    console.log(ev);
    window.postMessage(window);
});

window.addEventListener('load', (ev) => {
    console.log("loaded")
});