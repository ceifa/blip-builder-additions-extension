"use strict";

var doc;
var botFlows;
var botIdentifier;

var internalWebsites = ["take.net", "msging.net", "blip.ai"];

(async function(browser) {
  "use strict";

  doc = document;

  await waitForBuilderDOM();
  createBuilderSideBarItemHandler();

  botIdentifier = getBotIdentifier();
  botFlows = await getBotFlows(botIdentifier);

  loadAllInteractionImages();
  loadSearch();
  createUserInteractionHandler();
})(chrome || browser);

function createUserInteractionHandler() {
  setInterval(function() {
    var userActionButtons = doc.querySelectorAll(
      ".button-primary.fr, .icon-delete.lh-solid, #container-floating, .ma0.menu-more-items > li, .ma0.flex > li, .editIco.trashIco"
    );

    for (var i = 0; i < userActionButtons.length; i++) {
      var btn = userActionButtons[i];

      btn.onclick = async function() {
        botFlows = await getBotFlows(botIdentifier);
        loadAllInteractionImages();
      };
    }
  }, 350);
}

function loadSearch() {
  var input = createSearchDOM();

  input.onkeyup = function() {
    var search = input.value.toLowerCase().trim();
    executeSearch(search, botFlows.nodes, botFlows.flow);
  };
}

function executeSearch(search, nodeFlow, jsonFlow) {
  var contador = 0;

  for (var key in jsonFlow) {
    if (jsonFlow.hasOwnProperty(key)) {
      var element = jsonFlow[key];
      var nodeElement = nodeFlow[key];

      var customActions = element["$enteringCustomActions"].concat(
        element["$leavingCustomActions"]
      );

      var actionsJoined = customActions
        .map(function(x) {
          return x.type;
        })
        .join();

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
}

function createSearchDOM() {
  var buttonList = doc.getElementsByClassName("icon-button-list")[0];

  var li = doc.createElement("li");
  li.innerHTML =
    "<tooltip-button>" +
    "<div class='tooltip-button'>" +
    "<button><div><i class='icon icon-search'></i></div></button>" +
    "<div class='text-container' style='width:200px'>" +
    "<div class='material-wrapper'>" +
    "<input placeholder='Buscar' id='searchField' maxlength='30' style='background:rgba(155,155,155,0); border: none; outline: none !important; width:110px; position:absolute;top: 7px;' />" +
    "<span class='input-right text-gray' id='contador' style='position:absolute; top:5px; right:15px;'></span>" +
    "</div>" +
    "</div>" +
    "</div></tooltip-button>";

  buttonList.append(li);

  var input = doc.getElementById("searchField");

  return input;
}

function loadAllInteractionImages() {
  var jsonFlow = botFlows.flow;
  var nodeFlow = botFlows.nodes;

  for (var key in jsonFlow) {
    if (jsonFlow.hasOwnProperty(key) && key.indexOf("desk") === -1) {
      var element = jsonFlow[key];
      var nodeElement = nodeFlow[key];

      appendAllInteractionImages(element, nodeElement);
    }
  }
}

function removeAllInteractionElements(node) {
  var elements = node.getElementsByClassName("interact");

  while (elements.length !== 0) {
    node.removeChild(elements[0]);
  }
}

function appendAllInteractionImages(element, node) {
  removeAllInteractionElements(node);

  var quantity = 0;
  var interactions = getElementInteractions(element);

  if (interactions.hasInput) {
    appendImage(
      node,
      "https://i.imgur.com/9wdOV0p.png",
      quantity++,
      "Input do usuário"
    );
  }
  if (interactions.hasBotMessage) {
    appendImage(
      node,
      "https://i.imgur.com/RvzGKtP.png",
      quantity++,
      "Interação do bot"
    );
  }
  if (interactions.hasRegex) {
    appendImage(node, "https://i.imgur.com/HDxGV24.png", quantity++, "Regex");
  }
  if (interactions.hasInternalAPI) {
    appendImage(
      node,
      "https://i.imgur.com/P56IOl8.png",
      quantity++,
      "API interna"
    );
  }
  if (interactions.hasExternalAPI) {
    appendImage(
      node,
      "https://i.imgur.com/t0fUURZ.png",
      quantity++,
      "API externa"
    );
  }
  if (interactions.hasEventTracking) {
    appendImage(
      node,
      "https://i.imgur.com/li908ZA.png",
      quantity++,
      "Tracking de evento"
    );
  }
  if (interactions.hasJavascript) {
    appendImage(
      node,
      "https://i.imgur.com/r2JMuMt.png",
      quantity++,
      "JavaScript"
    );
  }
  if (interactions.hasWebview) {
    appendImage(node, "https://i.imgur.com/EPMtB2K.png", quantity++, "Webview");
  }
  if (interactions.hasNLP) {
    appendImage(node, "https://i.imgur.com/e9rw9a4.png", quantity++, "NLP");
  }
}

function appendImage(node, imageSrc, quantity, title) {
  var imageElement = doc.createElement("img");
  imageElement.src = imageSrc;
  imageElement.width = 15;
  imageElement.style.position = "absolute";
  imageElement.style.bottom = "5px";
  imageElement.style.right = 5 + quantity * 20 + "px";
  imageElement.style.cursor = "help";
  imageElement.className = "interact";
  imageElement.title = title;

  node.appendChild(imageElement);
}

function whileTrueWithSleep(func) {
  for (
    var _len = arguments.length,
      params = Array(_len > 1 ? _len - 1 : 0),
      _key = 1;
    _key < _len;
    _key++
  ) {
    params[_key - 1] = arguments[_key];
  }

  return new Promise(function(result) {
    setTimeout(function() {
      return result(func.apply(undefined, params));
    }, 100);
  });
}

function waitForBuilderDOM() {
  return new Promise(function(ready) {
    var anyHeaderButton = getAnyHeaderButton();

    if (!anyHeaderButton) return ready(whileTrueWithSleep(waitForBuilderDOM));

    var buiderButton = doc.getElementsByTagName("sidenav-menu-item")[0];
    if (!buiderButton) return ready(whileTrueWithSleep(waitForBuilderDOM));

    var buttonList = doc.getElementsByClassName("icon-button-list")[0];
    if (!buttonList) return ready(whileTrueWithSleep(waitForBuilderDOM));

    ready();
  });
}

function createBuilderSideBarItemHandler() {
  var builderButton = doc.getElementsByTagName("sidenav-menu-item")[0];

  if (!builderButton) {
    return;
  }

  builderButton.onmousedown = async function() {
    var builderButtonLiNode = builderButton.childNodes[0];

    if (builderButtonLiNode.className.indexOf("active") === -1) {
      await waitForBuilderDOM(doc);
      var botIdentifier = getBotIdentifier();
      botFlows = await getBotFlows(botIdentifier);

      loadAllInteractionImages();
      loadSearch();
    }
  };

  setTimeout(createBuilderSideBarItemHandler, 2000);
}
