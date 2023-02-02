// ==UserScript==
// @name         Youtube Video Quality Picker
// @namespace    https://github.com/WalterClementsJr
// @version      0.1
// @description  add buttons to select video quality in 2 clicks less
// @author       walterwalker
// @downloadURL  https://github.com/WalterClementsJr/tampermonkey-scripts/blob/main/youtube/youtube-quality-picker.user.js
// @updateURL    https://github.com/WalterClementsJr/tampermonkey-scripts/blob/main/youtube/youtube-quality-picker.user.js
// @grant        GM_addStyle
// @match        https://www.youtube.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    function wait(ms) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(ms)
            }, ms);
        });
    }

    // wait for element to exist
    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }
            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    async function waitForVideo(){
        let video = document.querySelector('video');
        while(!video){
            console.log('waiting for video');
            await wait(200);
            video = document.querySelector('video');
        }
    };


    /**
    * Sets the quality
    * options are: "Highest" and the options available in the menu ("720p60", "480p", etc.)
    */
    async function setQuality(quality){
        let settingsButton = document.getElementsByClassName("ytp-settings-button")[0];
        settingsButton.click();
        await wait(500);

        let qualityMenu = document.getElementsByClassName("ytp-panel-menu")[0].lastChild;
        qualityMenu.click();
        await wait(500);

        let qualityOptions = [...document.getElementsByClassName("ytp-menuitem")];
        let selection;

        if (quality == 'Highest') selection = qualityOptions[0];
        else selection = qualityOptions.filter(el => el.innerText == quality)[0];

        if (!selection) {
            let qualityTexts = qualityOptions.map(el => el.innerText).join('\n');
            console.log('"' + quality + '" not found. Options are: \n\nHighest\n' + qualityTexts);
            settingsButton.click();
            return;
        }

        if (selection.attributes['aria-checked'] === undefined) {
            selection.click();

            settingsButton.click();
            await wait(100);
            settingsButton.click();
        } else settingsButton.click();
    };

    // create quality button selects
    async function createButtons() {
        await waitForVideo();

        // imposible without opening the setting panel and select qualities
        // better to leave the options static
        const qualities = ['144p', '240p', '360p', '480p', '720p'];

        const btnLocation = document.createElement('div');
        btnLocation.style.cssText = 'display: flex;';

        let titleCssSelector = '.watch-active-metadata.style-scope.ytd-watch-flexy *> h1.style-scope';

        waitForElm(titleCssSelector).then((elm) => {
            console.log('Element is ready');

            document.querySelector(titleCssSelector).appendChild(btnLocation);

            for (let i of qualities) {
                const skipBtn = document.createElement('button');
                skipBtn.textContent = i;
                skipBtn.classList.add('button-12');
                skipBtn.style.cursor = "pointer";

                skipBtn.addEventListener('click', (async) => {
                    console.log('skipbtn is clicked');
                    setQuality(i);
                });
                btnLocation.appendChild(skipBtn);
            }
        });
    }

    let css = ".button-12 { display: flex; flex-direction: column; align-items: center; padding: 6px 14px; font-family: -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif; border-radius: 6px; border: none; background: #0f0f0f; box-shadow: 0px 0.5px 1px rgba(0, 0, 0, 0.1), inset 0px 0.5px 0.5px rgba(255, 255, 255, 0.5), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.12); color: #DFDEDF; user-select: none; -webkit-user-select: none; touch-action: manipulation; } .button-12:focus { box-shadow: inset 0px 0.8px 0px -0.25px rgba(255, 255, 255, 0.2), 0px 0.5px 1px rgba(0, 0, 0, 0.1), 0px 0px 0px 3.5px rgba(58, 108, 217, 0.5); outline: 0; }"
    GM_addStyle(css);

    window.addEventListener('yt-page-data-updated', function () {
        console.log('page data reloaded');
        if (window.location.href !== "https://www.youtube.com/") {
            createButtons();
        }
    });
})();
