// ==UserScript==
// @name         WebCache redirector
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  redirect all urls to webcache
// @author       WalterClementsJr
// @match        https://webcache.googleusercontent.com/search*
// @grant        none
// @downloadURL  https://github.com/WalterClementsJr/tampermonkey-scripts/raw/main/misc/webcache-redirect.user.js
// @updateURL    https://github.com/WalterClementsJr/tampermonkey-scripts/raw/main/misc/webcache-redirect.user.js
// ==/UserScript==

(function() {
    'use strict';

    const body = document.querySelector("body > div:last-child");
    const anchors = body.getElementsByTagName("a");
    const redirect = "https://webcache.googleusercontent.com/search?q=cache:";

    for (let i = 0; i < anchors.length; i++) {
        anchors[i].href = redirect + anchors[i].href;
    }
})();
