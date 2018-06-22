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
    return doc.getElementsByClassName(
      "pointer u-status-on u-status-on--medium"
    )[0];
  }