hook.add("btn-clicked", (btn) => {
    if (btn === "repair-tags") {
        repairCurrentBotTags();
    }
});

async function repairCurrentBotTags() {
    let authKey = await getBotAuthKey(metadata.botIdentifier);
    console.log("Getting auth key...");

    let botFlow = await getBotFlow(authKey);
    console.log("Getting bot flow...");
    
    botFlow = repairTags(botFlow);
    console.log("Repairing tags...");

    chrome.runtime.sendMessage({
        type: 'download-file',
        fileType: 'text/json',
        content: JSON.stringify(botFlow),
        fileName: `fixed-tags-${metadata.botIdentifier}.json`
    });
    console.log("Downloading...");
}

function getBotAuthKey(identifier) {
    return new Promise((result) => {
        let iframe = document.createElement('iframe');
        iframe.src = `https://${location.host}/#/application/detail/${identifier}/configurations/apikey`;
        iframe.hidden = 'hidden';
    
        iframe.onload = () => {
            let doc = iframe.contentWindow.document;
            let infos = doc.getElementsByClassName('input-clipboard-container');
    
            let interval = setInterval(() => {
                for (let i = 0; i < infos.length; i++){
                    let input = infos[i].firstElementChild;
    
                    if (input.value.includes('Key ')) {
                        clearInterval(interval);
                        result(input.value);
                    }
                }
            }, 100);
        }

        document.body.appendChild(iframe);
    });
}

function getBotFlow(authKey) {
    return new Promise((result) => {
        fetch('https://msging.net/commands', {
            method: "POST",
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: authKey
            }),
            body: JSON.stringify({
              id: guid(),
              method: "get",
              uri: "/buckets/blip_portal:builder_working_flow"
            })
        })
        .then(res => res.json())
        .then(res => result(res.resource));
    });
}

function repairTags(flow) {
    for (const key in flow) {
        if (flow.hasOwnProperty(key)) {
            flow[key] = removeCurrentTags(flow[key]);
            flow[key] = addTags(flow[key]);
        }
    }
    return flow;
}

function removeCurrentTags(block) {
    if (block['$tags']){
        for (let i = 0; i < block['$tags'].length; i++) {
            const tag = block['$tags'][i];
            let canRemove = possibleActions.some(a => tag.label === a.name || a.alias.includes(tag.label));

            if (canRemove) {
                block['$tags'].splice(i, 1);
            }
        }
    }

    return block;
}

function addTags(block) {
    block['$tags'] = block['$tags'] || [];
    let actions = block['$enteringCustomActions'].concat(block['$leavingCustomActions']);

    for (const action of actions) {
        let actionName = possibleActions.find(a => action.type === a.name || a.alias.includes(action.type)).name;

        if (block['$tags'].some(t => t.label === actionName))
            continue;

        let colorKey = actionName.toLowerCase().replace(' ', '-') + '-color';
        
        block['$tags'].push({
            background: settings[colorKey],
            label: actionName,
            id: "blip-tag-" + guid(),
            canChangeBackground: false
        });
    }

    return block;
}

function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}