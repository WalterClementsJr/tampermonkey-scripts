// ==UserScript==
// @name         WebCache redirector
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  redirect all urls to webcache
// @author       WalterClementsJr
// @match        https://webcache.googleusercontent.com/search*
// @grant        none
// @downloadURL  https://github.com/WalterClementsJr/tampermonkey-scripts/raw/main/misc/webcache-redirect.user.js
// @updateURL    https://github.com/WalterClementsJr/tampermonkey-scripts/raw/main/misc/webcache-redirect.user.js
// ==/UserScript==

(function() {
    'use strict';

    let docs = [...document.querySelectorAll("body > div")];
    docs.pop();

    const redirect = "https://webcache.googleusercontent.com/search?q=cache:";

    let anchors = [];

    for (let doc of docs) {
        anchors = anchors.concat([...doc.getElementsByTagName("a")]);
    }

    for (let i = 0; i < anchors.length; i++) {
        anchors[i].href = redirect + anchors[i].href;
    }
})();
