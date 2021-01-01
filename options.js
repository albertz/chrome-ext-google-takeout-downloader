
window.onload = function() {
    var pwdElem = document.getElementById('google-password');

    function storeGooglePwd() {
        chrome.storage.local.set(
            {googlePwd: {googlePwd: pwdElem.value}},
            function() {});
    }

    pwdElem.onchange = storeGooglePwd;

    chrome.storage.local.get(["googlePwd"], function(result) {
        if(result && result.googlePwd) {
            pwdElem.value = result.googlePwd;
        }
    });
}
