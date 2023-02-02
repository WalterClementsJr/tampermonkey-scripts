// ==UserScript==
// @name         Skip video on udemy
// @namespace    https://github.com/WalterClementsJr
// @version      0.9
// @description  try to take over the world!
// @author       walker
// @match        https://fpt-software.udemy.com/course*
// @downloadURL  https://github.com/WalterClementsJr/tampermonkey-scripts/blob/main/misc/skip-udemy.user.js
// @updateURL    https://github.com/WalterClementsJr/tampermonkey-scripts/blob/main/misc/skip-udemy.user.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    const skipBtn = document.createElement('button');
    skipBtn.classList.add('skip-video');
    skipBtn.textContent = 'Skip Video';
    skipBtn.style.zIndex = 100000;
    skipBtn.style.backgroundColor = '#fff';
    skipBtn.style.position = 'absolute';
    skipBtn.style.top = '50%';
    skipBtn.style.left = '50%';
    skipBtn.style.fontSize = "30px";
    skipBtn.style.cursor = "pointer";

    document.body.appendChild(skipBtn);

    skipBtn.addEventListener('click', (async) => {
        console.log('skipbtn is clicked');
        doAll();
    });

    // simulate a synchronous sleep
    function wait(ms) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(ms)
            }, ms);
        });
    }

    function skipVideo() {
        const mediaList = document.querySelectorAll('video,audio');

        // no video -> probably quiz
        if (mediaList.length === 0) {
            doQuiz();
            return;
        }
        for (const media of mediaList) {
            if (media && Number.isFinite(media.duration)) {
                media.currentTime = media.duration - 2;
            }
        }
    }

    async function doQuiz() {
        // start quiz
        await wait(500);
        try { document.querySelector('[data-purpose="start-or-resume-quiz"]').click(); }
        catch (e) { console.log(e); }

        while (true) {
            console.log('selecting answer');

            await wait(500);
            let answers = document.querySelector('[aria-labelledby="question-prompt"]');

            // no answer - probably out of quiz - select continue button then return
            if (answers === undefined || answers == null) {
                console.log('answers not found');
                try {document.querySelector('[data-purpose="go-to-next"]').click()}
                catch (e) {console.log(e)}
                return false;
            }
            console.log('answers found');

            let isCorrect = false;
            let no = 0;

            // select all answers until we find a correct one
            while (!isCorrect) {
                // select first answer
                answers
                    .querySelectorAll("li")[no]
                    .querySelectorAll('label')[0]
                    .click();

                // 'check answer' button
                document.querySelector('[data-purpose="next-question-button"]').click();

                // wait for answer check
                await wait(500);

                if (document.querySelector('[data-purpose="next-question-button"]').disabled === true) {
                    // wrong answer -> select next answer next time
                    no++;
                } else {
                    isCorrect = true;
                    document.querySelector('[data-purpose="next-question-button"]').click();
                }
            }

            // finish a quiz
            document.querySelector('[data-purpose="next-question-button"]').click();
            // document.querySelector('[data-purpose="skip-question-button"]').click();
        }
    };

    /**
    * select the next video skipBtn and click it
    *
    **/
    function clickNextVideo() {
        const goToNext = document.querySelector('[data-purpose="go-to-next-button"]');
        try {goToNext.click();}
        catch(e) {return false;}

        return true;
    }

    function clickPlayVideo() {
        let playBtn = document.querySelector('[data-purpose="video-play-button-initial"]');
        try {playBtn.click();}
        catch(e) {return false;}
        return true;
    }

    async function doAll() {
        try {
            // play video for a while
            await wait(2000);
            await skipVideo();

            // click until next video
            let clickedNextVid = false;
            while(!clickedNextVid) {
                await wait(300);
                clickedNextVid = clickNextVideo();
            }
        } catch (e) {
            console.log(e);
            return false;
        }
        return true;
    }

    (async function Main() {
        let interval = 5000;

        while (true) {
            await wait(interval);
            console.log('function is running every ', interval);
            skipBtn.click();
        }
    })();
})();

