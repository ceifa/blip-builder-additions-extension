var internalWebsites = ["take.net", "msging.net", "blip.ai"];
var hasSearch = false;
var botIdentifier;
var flow;

(async function(doc, browser) {
  "use strict";

  await start(doc);
})(document, chrome || browser);

async function start(doc) {
  setTimeout(async function() {
    var anyHeaderButton = doc.getElementsByClassName(
      "pointer u-status-on u-status-on--medium"
    )[0];
    var regex = /([^\/]*)\/home$/gm;

    if (!anyHeaderButton) {
      start(doc);
      return;
    }

    var buiderButton = doc.getElementsByTagName("sidenav-menu-item")[0];
    if (!buiderButton) {
      start(doc);
      return;
    }

    setInterval(async function() {
      await createBuilderHandler(doc);
    }, 500);

    var match = regex.exec(anyHeaderButton.getAttribute("href"));
    botIdentifier = match[1];

    var builderFlows = doc.getElementsByTagName("builder-node");
    flow = await getUserFlow(doc, botIdentifier);

    if (Object.keys(flow).length !== Array.from(builderFlows).length) {
      start(doc);
      return;
    }

    await loadAllInteractionData(doc);

    setInterval(async function() {
      var saveCustomActionButtons = doc.getElementsByClassName(
        "button-primary fr"
      );
      var removeCustomActionButtons = doc.getElementsByClassName(
        "icon-delete lh-solid"
      );

      saveOnClickEvent(doc, saveCustomActionButtons);
      saveOnClickEvent(doc, removeCustomActionButtons);
    }, 100);
  }, 300);
}

async function createBuilderHandler(doc) {
  setTimeout(async function() {
    var builderButton = doc.getElementsByTagName("sidenav-menu-item")[0];

    if (!builderButton) {
      await createBuilderHandler(doc);
      return;
    }

    builderButton.onmousedown = async function() {
      hasSearch = false;
      await start(doc);
    };
  }, 350);
}

async function loadSearch(doc, builderFlows) {
  var input = await createSearchDOM(doc);

  input.onkeydown = function() {
    var search = input.value.toLowerCase().trim();
    var contador = 0;

    for (const key in flow) {
      if (flow.hasOwnProperty(key)) {
        const element = flow[key];
        const nodeElement = builderFlows[key];

        var customActions = element["$enteringCustomActions"].concat(
          element["$leavingCustomActions"]
        );

        var actionsJoined = customActions.map(x => x.type).join();

        if (
          search &&
          (actionsJoined.toLowerCase().indexOf(search) !== -1 ||
            element["$title"].toLowerCase().indexOf(search) !== -1)
        ) {
          nodeElement.style.backgroundColor = "rgb(246, 255, 133)";
          nodeElement.style.backgroundImage = "none";
          contador++;
        } else if (key === "onboarding" || key === "fallback") {
          nodeElement.style.backgroundColor = "";
        } else {
          nodeElement.style.backgroundColor = "white";
        }
      }
    }

    var p = doc.getElementById("contador");
    p.innerText = contador;
  };
}

async function createSearchDOM(doc) {
  return await new Promise(async function(searchInput) {
    setTimeout(async function() {
      var buttonList = doc.getElementsByClassName("icon-button-list")[0];

      if (!buttonList) return searchInput(await createSearchDOM(doc));

      var p = doc.createElement("p");
      p.style.color = "white";
      p.id = "contador";

      var input = doc.createElement("input");
      input.style.backgroundColor = "#1E2532";
      input.placeholder = "Buscar";

      var li = doc.createElement("li");
      var li2 = doc.createElement("li");

      li2.appendChild(p);
      li.appendChild(input);

      buttonList.prepend(li2);
      buttonList.prepend(li);

      return searchInput(input);
    }, 100);
  });
}

async function saveOnClickEvent(doc, btns) {
  for (var i = 0; i < btns.length; i++) {
    var btn = btns[i];

    btn.onclick = async function() {
      await loadAllInteractionData(doc);
    };
  }
}

async function loadAllInteractionData(doc) {
  var builderFlows = doc.getElementsByTagName("builder-node");

  flow = flow || (await getUserFlow(doc, botIdentifier));

  if (!hasSearch) {
    await loadSearch(doc, builderFlows);
    hasSearch = true;
  }

  for (const key in flow) {
    if (flow.hasOwnProperty(key)) {
      const element = flow[key];
      const nodeElement = builderFlows[key];

      appendAllInteractionImages(doc, element, nodeElement);
    }
  }
}

function appendAllInteractionImages(doc, element, node) {
  removeAllInteractionElements(node);

  var quantity = 0;
  var actions = element["$contentActions"];
  var conditions = element["$conditionOutputs"];
  var customActions = element["$enteringCustomActions"].concat(
    element["$leavingCustomActions"]
  );

  if (actions.some(x => x.input && !x.input.bypass)) {
    appendImage(doc, node, "https://i.imgur.com/9wdOV0p.png", quantity++);
  }
  if (actions.some(x => x.action && x.action.type === "SendMessage")) {
    appendImage(doc, node, "https://i.imgur.com/RvzGKtP.png", quantity++);
  }
  if (
    conditions.some(
      x => x.conditions && x.conditions.some(y => y.comparison === "matches")
    )
  ) {
    appendImage(doc, node, "https://i.imgur.com/HDxGV24.png", quantity++);
  }
  if (
    customActions.some(
      x =>
        x.type === "ProcessHttp" &&
        internalWebsites.some(y => x.settings.uri.includes(y))
    )
  ) {
    appendImage(doc, node, "https://i.imgur.com/qRBWbZX.png", quantity++);
  }
  if (
    customActions.some(
      x =>
        x.type === "ProcessHttp" &&
        !internalWebsites.some(y => x.settings.uri.includes(y))
    )
  ) {
    appendImage(doc, node, "https://i.imgur.com/Nn57RAu.png", quantity++);
  }
  if (customActions.some(x => x.type === "TrackEvent")) {
    appendImage(doc, node, "https://i.imgur.com/li908ZA.png", quantity++);
  }
  if (customActions.some(x => x.type === "ExecuteScript")) {
    appendImage(doc, node, "https://i.imgur.com/r2JMuMt.png", quantity++);
  }
}

function removeAllInteractionElements(node) {
  var elements = node.getElementsByClassName("interact");

  while (elements.length !== 0) {
    node.removeChild(elements[0]);
  }
}

function appendImage(doc, node, imageSrc, quantity) {
  var imageElement = doc.createElement("img");
  imageElement.src = imageSrc;
  imageElement.width = 15;
  imageElement.style.position = "absolute";
  imageElement.style.bottom = "5px";
  imageElement.style.right = 5 + quantity * 20 + "px";
  imageElement.className = "interact";

  node.appendChild(imageElement);
}

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}

async function getUserFlow(doc, botIdentifier) {
  return await new Promise(async function(userflow) {
    var auth = await getBotAccessKey(doc, botIdentifier);
    return userflow(await getUserFlowFromBucket(auth));
  });
}

async function getBotAccessKey(doc, botIdentifier) {
  return await new Promise(async function(accessKey) {
    var iframe = doc.createElement("iframe");
    iframe.src =
      "https://portal.blip.ai/#/application/detail/" +
      botIdentifier +
      "/configurations/apikey";

    iframe.hidden = "hidden";

    iframe.onload = async function() {
      var frameDoc = iframe.contentWindow.document;
      var inputs = frameDoc.getElementsByClassName(
        "ng-pristine ng-valid ng-not-empty"
      );
      var auth = await getAccessKeyByHtmlCollection(inputs);
      return accessKey(auth);
    };

    doc.getElementsByTagName("body")[0].appendChild(iframe);
  });
}

async function getAccessKeyByHtmlCollection(collection) {
  return await new Promise(async function(accessKey) {
    setTimeout(async function() {
      for (var i = 0; i < collection.length; i++) {
        if (collection[i].value && collection[i].value.indexOf("Key ") === 0)
          return accessKey(collection[i].value);
      }

      return accessKey(getAccessKeyByHtmlCollection(collection));
    }, 100);
  });
}

async function getUserFlowFromBucket(auth) {
  return await new Promise(async function(userflow) {
    await fetch("https://msging.net/commands", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: auth
      }),
      body: JSON.stringify({
        id: guid(),
        method: "get",
        uri: "/buckets/blip_portal:builder_working_flow"
      })
    })
      .then(x => {
        console.log(x);
        return x.json();
      })
      .then(x => {
        userflow(x.resource);
      })
      .catch(er => {
        console.log(er);
        userflow();
      });
  });
}
