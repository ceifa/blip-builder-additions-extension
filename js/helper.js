function getBotFlows(botIdentifier) {
  return new Promise(async function(flows) {
    var botJsonFlow = await getBotJsonFlow(botIdentifier);
    var flowQuantity = Object.keys(botJsonFlow).length;
    var botBuilderFlow = await getBotBuilderNodeFlow(flowQuantity);
    return flows({ nodes: botBuilderFlow, flow: botJsonFlow });
  });
}

function getBotBuilderNodeFlow(nodesQuantity) {
  return new Promise(function(nodes) {
    var botBuilderFlow = doc.getElementsByTagName("builder-node");

    if (Array.from(botBuilderFlow).length !== nodesQuantity)
      return nodes(getBotBuilderNodeFlow(nodesQuantity));

    return nodes(botBuilderFlow);
  });
}

async function getBotJsonFlow(botIdentifier) {
  return new Promise(async function(jsonFlow) {
    var auth = await getBotAuthentication(botIdentifier);
    var flow = await getBotJsonFlowFromBucket(auth);
    return jsonFlow(flow);
  });
}

function getBotJsonFlowFromBucket(auth) {
  return new Promise(function(userflow) {
    fetch("https://msging.net/commands", {
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
      .then(function(x) {
        console.log(x);
        return x.json();
      })
      .then(function(x) {
        userflow(x.resource);
      })
      .catch(function(er) {
        console.log(er);
        userflow();
      });
  });
}

function getBotAuthentication(botIdentifier) {
  return new Promise(function(auth) {
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
      var authorizationKey = await getBotAuthenticationByConfigurationInputs(
        inputs
      );
      return auth(authorizationKey);
    };

    doc.getElementsByTagName("body")[0].appendChild(iframe);
  });
}

async function getBotAuthenticationByConfigurationInputs(inputs) {
  return await new Promise(async function(auth) {
    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].value && inputs[i].value.indexOf("Key ") === 0)
        return auth(inputs[i].value);
    }

    return auth(
      whileTrueWithSleep(getBotAuthenticationByConfigurationInputs, inputs)
    );
  });
}

function getBotIdentifier() {
  var anyHeaderButton = getAnyHeaderButton();
  var regex = /([^\/]*)\/home$/gm;
  var match = regex.exec(anyHeaderButton.getAttribute("href"));
  return match[1];
}

function getAnyHeaderButton() {
  return doc.querySelector("[href*='application/detail/']");
}

function getElementInteractions(element) {
  var actions = element["$contentActions"];
  var conditions = element["$conditionOutputs"];
  var customActions = element["$enteringCustomActions"].concat(
    element["$leavingCustomActions"]
  );

  var interactions = {};

  interactions.hasInput = actions.some(function(x) {
    return x.input && !x.input.bypass;
  });

  interactions.hasBotMessage = actions.some(function(x) {
    return x.action && x.action.type === "SendMessage";
  });

  interactions.hasRegex = conditions.some(function(x) {
    return (
      x.conditions &&
      x.conditions.some(function(y) {
        return y.comparison === "matches";
      })
    );
  });

  interactions.hasInternalAPI = customActions.some(function(x) {
    return (
      x.type === "ProcessHttp" &&
      internalWebsites.some(function(y) {
        return x.settings.uri.includes(y);
      })
    );
  });

  interactions.hasExternalAPI = customActions.some(function(x) {
    return (
      x.type === "ProcessHttp" &&
      !internalWebsites.some(function(y) {
        return x.settings.uri.includes(y);
      })
    );
  });

  interactions.hasEventTracking = customActions.some(function(x) {
    return x.type === "TrackEvent";
  });

  interactions.hasJavascript = customActions.some(function(x) {
    return x.type === "ExecuteScript";
  });

  interactions.hasWebview = actions.some(function(x) {
    return (
      JSON.stringify(x).indexOf("application/vnd.lime.web-link+json") !== -1
    );
  });

  interactions.hasNLP = conditions.some(function(x) {
    return (
      x.conditions &&
      x.conditions.some(function(y) {
        return (
          y.source === "intent" ||
          y.source === "entity" ||
          (y.variable &&
            (y.variable.indexOf("input.intent") !== -1 ||
              y.variable.indexOf("input.entity") !== -1))
        );
      })
    );
  });

  return interactions;
}
