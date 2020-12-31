
var port = chrome.runtime.connect({name: "backup-google-takeout"});

port.onMessage.addListener(function(msg) {
  if (msg.name == "nextDownload")
    nextDownload(msg.partNr);
});

function nextDownload(partNr) {

  var xpath = `//*[starts-with(., 'Part ${partNr} of ')]`;
  var matchingElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

  if (!matchingElement) {
    var showButtonElem = document.evaluate('//*[text()="Show exports"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    showButtonElem.click();
    matchingElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  }
  console.assert(matchingElement);

  var downloadElement = matchingElement.nextSibling;
  console.assert(downloadElement.textContent.includes("Download"), downloadElement);
  var downloadElementLinks = downloadElement.getElementsByTagName("a");
  console.assert(downloadElementLinks.length == 1);
  console.log("next download:", matchingElement, downloadElementLinks[0]);
  downloadElementLinks[0].click();
}
