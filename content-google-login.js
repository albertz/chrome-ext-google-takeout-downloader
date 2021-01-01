
var googlePwd = "";
try {
    googlePwd = localStorage.googlePwd;
} catch (error) {}

if (googlePwd.length > 0) {
    var inputPwdElem = document.evaluate(
        '//input[@type="password"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    
    inputPwdElem.value = googlePwd;

    var buttonElem = document.evaluate(
        '//*[@id="passwordNext"]', document,  null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    
    buttonElem.click();
}
