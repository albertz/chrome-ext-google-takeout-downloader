
window.onload = function() {
    var pwdElem = document.getElementById('google-password');

    function storeGooglePwd() {
        localStorage.googlePwd = pwdElem.value;
    }

    try {
        pwdElem.value = localStorage.googlePwd;
    } catch (e) {}  // ignore
    pwdElem.onchange = storeGooglePwd;
}
