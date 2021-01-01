
chrome.storage.local.get(["googlePwd"], function(result) {

    if(!result || !result.googlePwd)
        return;

    var googlePwd = result.googlePwd.googlePwd;
    var lastUsageTime = result.googlePwd.lastUsageTime;
    var nowTime = new Date().getTime() / 1000.;

    if (lastUsageTime) {
        var diff = nowTime - lastUsageTime;
        console.log("Time diff since last usage:", diff);
        if (diff < 5 * 60) {
            console.log("Error, too short, stop.");
            // Avoid that it is entered again and again.
            chrome.storage.local.set({googlePwd: {}}, function() {});
            return;
        }
    }

    if (googlePwd && googlePwd.length > 0) {
        console.log("Have Google password, will enter now.");

        var inputPwdElem = document.evaluate(
            '//input[@type="password"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        
        inputPwdElem.value = googlePwd;

        var buttonElem = document.evaluate(
            '//*[@id="passwordNext"]', document,  null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        
        buttonElem.click();

        chrome.storage.local.set(
            {googlePwd: {googlePwd: googlePwd, lastUsageTime: nowTime}},
            function() {});
    }
});
